
export enum SideType {
  BUY = "BUY",
  SELL = "SELL",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum StatusType {
  NEW = "NEW",
  FILLED = "FILLED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum TypeOrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT"
}

export enum TypeInstrument {
  ACCIONES = "ACCIONES",
  MONEDA = "MONEDA"
}

export type PositionsType = {
  id: number;
  ticker: string;
  name: string;
  quantity: number;
  averagePrice: number | string;
  currentPrice: number;
  totalValue: number;
  gain: number;
}

export type PositionsFilledType = {
  instrumentid: number;
  ticker: string;
  name: string;
  net_quantity: string;
  avg_price: string;
  current_price: string;
}


export type PorfolioType = {
  totalAccountValue: number;
  availableCash: number;
  positions: PositionsType[]
}

export type InstrumentType = {
  id: number;
  ticker: string;
  name: string;
  type: TypeInstrument;
  last_price: string | null;
}


export type AvailableCashType = {
  available_cash: string;
}

export type MarketdataType = {
  instrumentid: number;
  high: number;
  low: number;
  open: number;
  close: string;
  previosclose: number;
  date: Date;
}