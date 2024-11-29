import { Request, Response } from "express";
import { SearchCase } from "../../application/search-usecase";


export class SearchController {
	constructor(private readonly searchService: SearchCase, private readonly logger: any) { }

	async searchInstruments(req: Request, res: Response) {
		try {
			const { query }: any = req.query;

			if (!query || query.trim() === '') {
				res.status(400).json({
					error: 'Se requiere consulta de búsqueda',
					message: 'Proporcione un término de búsqueda para el símbolo o el nombre del instrumento.'
				});
			}

			const instruments = await this.searchService.find(query)

			res.status(200).json(instruments);

		} catch (error: any) {
			this.logger.error(`Error: fetching search instruments: ${error}`);
			res.status(500).json({
				error: 'Error al obtener los intrumentos',
				details: error.message
			});
		}

	}
}
