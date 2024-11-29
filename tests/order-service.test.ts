import { OrderCase } from '../src/app/application/order-usecase';
import { SideType, TypeOrderType } from '../src/app/domain/types';
import { STATUS } from '../src/app/infrastructure/constans';

// Mocks para las dependencias
const mockRepository: jest.Mocked<any> = {
	session: jest.fn(),
	getOrdersFilled: jest.fn(),
	getMarketPriceInstrument: jest.fn(),
	createOrder: jest.fn(),
	updateOrderStatus: jest.fn(),
	getOrderById: jest.fn()
};

const mockPortfolioService: jest.Mocked<any> = {
	repository: mockRepository, // Añade el repositorio al mock
	calculatePortfolio: jest.fn()
};

describe('OrderCase', () => {
	let orderService: OrderCase;

	beforeEach(() => {
		// Crear una nueva instancia antes de cada prueba
		orderService = new OrderCase(
			mockPortfolioService,
			mockRepository
		);

		// Limpiar todos los mocks
		jest.clearAllMocks();
	});

	describe('executeOrder', () => {
		const userId = 1;
		const instrumentId = 100;

		test('Ejecutar orden de compra con fondos suficientes', async () => {
			// Configurar mocks para una compra exitosa
			mockPortfolioService.calculatePortfolio.mockResolvedValue({
				totalAccountValue: 8800000,
				availableCash: 7000000,
				positions: []
			});

			mockRepository.getMarketPriceInstrument.mockResolvedValue({
				close: '150.50'
			});

			mockRepository.createOrder.mockResolvedValue(1); // ID de orden

			// Ejecutar orden
			const result = await orderService.executeOrder(
				userId,
				instrumentId,
				SideType.BUY,
				TypeOrderType.MARKET,
				10
			);

			// Verificaciones
			expect(result).toEqual({
				orderId: 1,
				status: STATUS.FILLED
			});

			// Verificar llamadas a métodos
			expect(mockPortfolioService.calculatePortfolio).toHaveBeenCalledWith(userId);
			expect(mockRepository.createOrder).toHaveBeenCalledWith(expect.arrayContaining([
				instrumentId,
				userId,
				10,
				expect.any(Number), // Precio
				TypeOrderType.MARKET,
				SideType.BUY,
				STATUS.FILLED
			]));
		});

		test('Ejecutar orden de venta con acciones suficientes', async () => {
			// Configurar mocks para una venta exitosa
			mockPortfolioService.calculatePortfolio.mockResolvedValue({
				totalAccountValue: 8000,
				availableCash: 5000,
				positions: [{
					id: instrumentId,
					ticker: "TES",
					name: "testing",
					quantity: 20,
					averagePrice: 109,
					currentPrice: 23,
					totalValue: 244,
					gain: 23.34
				}]
			});

			mockRepository.getMarketPriceInstrument.mockResolvedValue({
				close: '150.50'
			});

			mockRepository.createOrder.mockResolvedValue(2); // ID de orden

			// Ejecutar orden
			const result = await orderService.executeOrder(
				userId,
				instrumentId,
				SideType.SELL,
				TypeOrderType.MARKET,
				10
			);

			// Verificaciones
			expect(result).toEqual({
				orderId: 2,
				status: STATUS.FILLED
			});
		});

		test('Orden de compra fallida por fondos insuficientes', async () => {
			// Configurar mocks para fondos insuficientes
			mockPortfolioService.calculatePortfolio.mockResolvedValue({
				totalAccountValue: 8000,
				availableCash: 100,
				positions: []
			});

			mockRepository.getMarketPriceInstrument.mockResolvedValue({
				close: '150.50'
			});


			// Ejecutar orden y esperar error
			await expect(orderService.executeOrder(
				userId,
				instrumentId,
				SideType.BUY,
				TypeOrderType.MARKET,
				10
			)).rejects.toThrow('Fondos insuficientes');

			// Verificar que se haya intentado crear una orden rechazada
			expect(mockRepository.createOrder).toHaveBeenCalledWith(
				expect.arrayContaining([
					instrumentId,
					userId,
					10,
					expect.any(Number),
					TypeOrderType.MARKET,
					SideType.BUY,
					STATUS.REJECTED
				])
			);
		});

		test('Orden de venta fallida por acciones insuficientes', async () => {
			// Configurar mocks para acciones insuficientes
			mockPortfolioService.calculatePortfolio.mockResolvedValue({
				totalAccountValue: 8000,
				availableCash: 5000,
				positions: [{
					id: instrumentId,
					ticker: "TES",
					name: "testing",
					quantity: 5,
					averagePrice: 109,
					currentPrice: 23,
					totalValue: 244,
					gain: 23.34
				}]
			});

			mockRepository.getMarketPriceInstrument.mockResolvedValue({
				close: '150.50'
			});

			// Ejecutar orden y esperar error
			await expect(orderService.executeOrder(
				userId,
				instrumentId,
				SideType.SELL,
				TypeOrderType.MARKET,
				10
			)).rejects.toThrow('Cantidad de acciones insuficientes');
		});
	});

	describe('cancelOrder', () => {
		test('Cancelar orden en estado NEW', async () => {
			const orderId = 1;

			// Configurar mock para una orden existente
			mockRepository.getOrderById.mockResolvedValue({
				id: orderId,
				status: STATUS.NEW
			});

			// Ejecutar cancelación
			const result = await orderService.cancelOrder(orderId);

			// Verificaciones
			expect(result).toEqual({
				orderId: orderId,
				status: STATUS.CANCELLED
			});

			expect(mockRepository.updateOrderStatus).toHaveBeenCalledWith(
				orderId,
				STATUS.CANCELLED
			);
		});

		test('Intentar cancelar orden que no está en estado NEW', async () => {
			const orderId = 1;

			// Configurar mock para una orden ya procesada
			mockRepository.getOrderById.mockResolvedValue({
				id: orderId,
				status: STATUS.FILLED
			});

			// Ejecutar cancelación y esperar error
			await expect(orderService.cancelOrder(orderId)).rejects.toThrow(
				'Solo se pueden cancelar órdenes en estado NEW'
			);
		});
	});
});