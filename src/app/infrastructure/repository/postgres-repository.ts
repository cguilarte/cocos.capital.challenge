import { IRepository } from "../../domain/IRepository";
import pool from "../../../shared/infrastructure/database";
import { AvailableCashType, InstrumentType, MarketdataType, PositionsFilledType } from "../../domain/types";

export class PostgresRepository implements IRepository {
  private db: any;

  constructor() {
    this.initDb();
  }

  async initDb() {
    this.db = await pool.connect();
  }

  async session(query: string) {
    return await this.db.query(query);
  }

  async getOrdersFilled(userId: number): Promise<PositionsFilledType[] | []> {

    const query = {
      text: `SELECT 
          i.id as instrumentId, 
          i.ticker, 
          i.name, 
          SUM(CASE WHEN o.side = 'BUY' THEN o.size ELSE -o.size END) as net_quantity,
          AVG(o.price) as avg_price,
          m.close as current_price
        FROM orders o
        JOIN instruments i ON o.instrumentId = i.id
        JOIN marketdata m ON i.id = m.instrumentId
        WHERE 
          o.userId = $1 
          AND o.status = 'FILLED' 
          AND i.type = 'ACCIONES'
          AND m.date = (SELECT MAX(date) FROM marketdata)
        GROUP BY 
          i.id, i.ticker, i.name, m.close
        HAVING SUM(CASE WHEN o.side = 'BUY' THEN o.size ELSE -o.size END) > 0`,
      values: [userId],
      rowMode: "object",
    };
    const positions = await this.db.query(query);

    return positions.rows;

  }

  async cashAvaliable(userId: number): Promise<AvailableCashType> {
    const query = {
      text: `
        SELECT 
        SUM(CASE 
          WHEN side = 'CASH_IN' THEN size 
          WHEN side = 'CASH_OUT' THEN -size 
          WHEN side = 'SELL' THEN price * size
          WHEN side = 'BUY' THEN -(price * size)
        END) as available_cash
      FROM orders 
      WHERE userId = $1 AND status = 'FILLED'`,
      values: [userId],
      rowMode: "object",
    };

    const cash = await this.db.query(query);
    return cash.rows[0];
  }

  async getInstruments(searchTerm: string): Promise<InstrumentType[] | []> {

    const query = {
      text: `
        SELECT 
          id, 
          ticker, 
          name, 
          type,
          (SELECT close FROM marketdata 
          WHERE instrumentId = instruments.id 
          ORDER BY date DESC 
          LIMIT 1) as last_price
        FROM instruments
        WHERE 
          UPPER(ticker) LIKE $1 OR 
          UPPER(name) LIKE $1
        LIMIT 20`,
      values: [searchTerm],
      rowMode: "object",
    };

    const Instruments = await this.db.query(query);

    return Instruments.rows;
  }


  async getMarketPriceInstrument(instrumentId: number): Promise<Pick<MarketdataType, 'close'>> {

    const query = {
      text: `
        SELECT close 
        FROM marketdata 
        WHERE instrumentid = $1 
        ORDER BY date DESC 
        LIMIT 1`,
      values: [instrumentId],
      rowMode: "object",
    };

    const marketPrice = await this.db.query(query);

    return marketPrice.rows[0];

  }

  async createOrder(values: any[]): Promise<any | null> {
    try {
      const query = {
        text: ` INSERT INTO orders 
        (instrumentid, userid, size, price, type, side, status, datetime)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id`,
        values,
      };

      const order = await this.db.query(query.text, query.values);

      return order.rows[0].id;
    } finally {
      //this.db.release();
    }
  }

  async getOrderById(orderId: number): Promise<any | []> {
    const query = {
      text: `SELECT status  FROM orders WHERE id = $1 LIMIT 1`,
      values: [orderId],
      rowMode: "object",
    };

    const order = await this.db.query(query);

    return order.rows[0];
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const query = {
      text: `UPDATE orders SET status = $1 WHERE id = $2`,
      values: [status, orderId],
      rowMode: "object",
    };

    await this.db.query(query);
  }

}
