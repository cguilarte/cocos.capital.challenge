import { IRepository } from "../domain/IRepository";
import { PorfolioType, PositionsType, SideType, TypeOrderType } from "../domain/types";
import { STATUS } from "../infrastructure/constans";
import { PortfolioCase } from "./portfolio-usecase";

export class OrderCase {
	constructor(
		private readonly portfolioService: PortfolioCase,
		private readonly repository: IRepository,
	) { }

	/**
	 * Validar disponibilidad de fondos o acciones
	 * @param {Object} portfolio - Cartera del usuario
	 * @param {string} instrumentId - ID del instrumento
	 * @param {string} side - Tipo de orden (BUY/SELL)
	 * @param {number} size - Cantidad de la orden
	 * @param {number} orderPrice - Precio de la orden
	 */
	private async validateOrderCapacity(portfolio: PorfolioType, instrumentId: number, side: string, size: number, orderPrice: number | null) {

		switch (side) {
			case SideType.BUY:
				const totalOrderValue = (orderPrice as number) * size;
				if (totalOrderValue > portfolio.availableCash) {
					throw new Error('Fondos insuficientes para ejecutar la orden');
				}
				break;

			case SideType.SELL:
				const instrumentPosition: PositionsType | undefined = portfolio.positions.find((pos: PositionsType) => pos.id === instrumentId);
				if (!instrumentPosition || instrumentPosition.quantity < size) {
					throw new Error('Cantidad de acciones insuficientes para vender');
				}
				break;
			case SideType.CASH_IN:
			case SideType.CASH_OUT:
				// Validaciones específicas para transferencias si son necesarias
				break;
			default:
				throw new Error('Tipo de orden no válido');
		}
	}

	/**
	 * Obtener precio de mercado para un instrumento
	 * @param {string} instrumentId - ID del instrumento
	 * @returns {Promise<number>} Precio de mercado
	 */
	private async getMarketPrice(instrumentId: number): Promise<number> {
		const marketPriceResult = await this.repository.getMarketPriceInstrument(instrumentId);
		return parseFloat(marketPriceResult.close);
	}

	/**
	 * Crear una nueva orden
	 * @param {string} instrumentId - ID del instrumento
	 * @param {string} userId - ID del usuario
	 * @param {string} side - Tipo de orden (BUY/SELL)
	 * @param {number} size - Cantidad de la orden
	 * @param {string} type - Tipo de orden (MARKET/LIMIT)
	 * @param {number} [price=null] - Precio de la orden
	 * @returns {Promise<Object>} Detalles de la orden
	 */

	async executeOrder(userId: number, instrumentId: number, side: SideType, type: TypeOrderType, size: number, price: number | null = null) {

		// Obtener precio de orden
		const orderPrice = type === TypeOrderType.MARKET
			? await this.getMarketPrice(instrumentId)
			: price;


		try {
			// Iniciar transacción
			await this.repository.session('BEGIN');

			// Calcular cartera del usuario
			const portfolio = await this.portfolioService.calculatePortfolio(userId);

			// Validar capacidad de la orden
			await this.validateOrderCapacity(portfolio, instrumentId, side, size, orderPrice);

			// Insertar orden
			const status = type === TypeOrderType.MARKET ? STATUS.FILLED : STATUS.NEW;

			const orderResultId = await this.repository.createOrder([
				instrumentId,
				userId,
				size,
				orderPrice,
				type,
				side,
				status
			]);


			// Confirmar transacción
			await this.repository.session('COMMIT');

			return {
				orderId: orderResultId,
				status: status
			};

		} catch (error: any) {
			// Revertir transacción en caso de error
			await this.repository.session('ROLLBACK');

			// Si el error es por fondos insuficientes, marcar como REJECTED
			if (error.message.includes('insuficientes')) {
				// Opcionalmente, guardar la orden rechazada
				const status = STATUS.REJECTED
				await this.repository.createOrder([
					instrumentId,
					userId,
					size,
					orderPrice,
					type,
					side,
					status
				]);
			}

			throw error;
		}
	}

	/**
		* Cancelar una orden
		* @param {number} orderId - ID de la orden
		* @returns {Promise<Object>} Resultado de la cancelación
		*/
	async cancelOrder(orderId: number) {
		const order = await this.repository.getOrderById(orderId);

		if (order.status !== STATUS.NEW) {
			throw new Error('Solo se pueden cancelar órdenes en estado NEW');
		}

		await this.repository.updateOrderStatus(orderId, STATUS.CANCELLED);

		return {
			orderId: orderId,
			status: STATUS.CANCELLED
		};
	}

}