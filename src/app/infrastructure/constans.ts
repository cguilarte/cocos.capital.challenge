import { SideType, StatusType } from "../domain/types";

export const SIDE = {
	BUY: SideType.BUY,
	SELL: SideType.SELL,
	CASH_IN: SideType.CASH_IN,
	CASH_OUT: SideType.CASH_OUT,
} as const;

export const STATUS = {
	NEW: StatusType.NEW,
	FILLED: StatusType.FILLED,
	REJECTED: StatusType.REJECTED,
	CANCELLED: StatusType.CANCELLED,
} as const;