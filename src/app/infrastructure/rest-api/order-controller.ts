import { Request, Response } from "express";
import { OrderCase } from "../../application/order-usecase";


export class OrderController {
	constructor(private readonly orderService: OrderCase, private readonly logger: any) { }

	async createOrder(req: Request, res: Response) {
		try {
			// Extraer datos de la solicitud
			const {
				userId,
				instrumentId,
				side,
				type,
				quantity,
				price
			} = req.body;

			const order = await this.orderService.executeOrder(userId, instrumentId, side, type, quantity, price);
			res.status(200).send(order);

		} catch (error: any) {
			this.logger.error(`Error: fetching execute order: ${error}`);
			res.status(500).json({
				error: 'Error al ejecutar la order',
				details: error.message
			});
		}
	}
}
