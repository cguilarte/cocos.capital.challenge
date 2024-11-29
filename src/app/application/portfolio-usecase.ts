import { IRepository } from "../domain/IRepository";
import { AvailableCashType, PorfolioType, PositionsFilledType, PositionsType } from "../domain/types";

export class PortfolioCase {
	constructor(
		private readonly repository: IRepository,
	) { }

	/**
	 * Calculaos el porfolio del usuario
	 * @param {number} userId - ID del usuario
	 * @returns {Promise<PorfolioType>} porfolio
	 */
	async calculatePortfolio(userId: number): Promise<PorfolioType> {

		const positions = await this.repository.getOrdersFilled(userId);

		// Calcular valores y rendimiento de cada posición
		const processedPositions = positions.map((pos: PositionsFilledType) => ({
			id: pos.instrumentid,
			ticker: pos.ticker,
			name: pos.name,
			quantity: Math.abs(parseInt(pos.net_quantity)),
			averagePrice: Number((parseFloat(pos.avg_price)).toFixed(2)),
			currentPrice: parseFloat(pos.current_price),
			totalValue: Math.abs(parseInt(pos.net_quantity)) * parseFloat(pos.current_price),
			gain: Number((((parseFloat(pos.current_price) - parseFloat(pos.avg_price)) / parseFloat(pos.avg_price)) * 100).toFixed(2))
		}));

		const cashResult: AvailableCashType = await this.repository.cashAvaliable(userId);
		const availableCash = parseFloat(cashResult.available_cash || '0');

		const totalAccountValue = processedPositions.reduce((sum: any, pos: PositionsType) => sum + pos.totalValue, availableCash);

		return {
			totalAccountValue,
			availableCash,
			positions: processedPositions
		}

	}

}