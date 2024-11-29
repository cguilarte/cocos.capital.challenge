import { Request, Response } from "express";
import { PortfolioCase } from "../../application/portfolio-usecase";
import { PorfolioType } from "../../domain/types";

export class PortfolioController {
	constructor(private readonly portfolioService: PortfolioCase, private readonly logger: any) { }

	async getPortfolio(req: Request, res: Response) {
		try {
			const userId: any = req.params.userId;
			// Obtener información del portfolio
			const portfolio: PorfolioType = await this.portfolioService.calculatePortfolio(userId);

			res.json({
				totalAccountValue: portfolio.totalAccountValue,
				availableCash: portfolio.availableCash,
				positions: portfolio.positions
			});

		} catch (error: any) {
			this.logger.error(`Error: fetching portfolio: ${error}`);
			res.status(500).json({
				error: 'Error al obtener el portfolio',
				details: error.message
			});
		}

	}
}
