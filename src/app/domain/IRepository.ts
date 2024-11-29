import { AvailableCashType, InstrumentType, MarketdataType, PositionsFilledType } from "./types";

export interface IRepository {
  session(query: string): Promise<any | null>;
  getOrdersFilled(userId: number): Promise<PositionsFilledType[] | []>;
  cashAvaliable(userId: number): Promise<AvailableCashType>;
  getInstruments(searchTerm: string): Promise<InstrumentType[] | []>;
  getMarketPriceInstrument(instrumentId: number): Promise<Pick<MarketdataType, 'close'>>;
  createOrder(values: any[]): Promise<any | []>;
  getOrderById(orderId: number): Promise<any | []>;
  updateOrderStatus(orderId: number, status: string): Promise<void>;
}
