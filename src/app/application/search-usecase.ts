import { IRepository } from "../domain/IRepository";
import { InstrumentType } from "../domain/types";

export class SearchCase {
	constructor(
		private readonly repository: IRepository,
	) { }

	/**
	 * Calculaos el porfolio del usuario
	 * @param {query} query - Consulta del ususario, busqueda por ticker y/o por nombre
	 * @returns {Promise}  total y resultado
	*/
	async find(query: string) {

		const searchTerm = `%${query.trim().toUpperCase()}%`;

		const instruments: InstrumentType[] | [] = await this.repository.getInstruments(searchTerm);

		if (instruments.length === 0) {
			return {
				total: 0,
				results: []
			}
		}

		// Transform results to include additional market data
		const formattedResults = instruments.map((instrument: InstrumentType) => ({
			id: instrument.id,
			ticker: instrument.ticker,
			name: instrument.name,
			type: instrument.type,
			last_price: instrument.last_price ? parseFloat(instrument.last_price || '0').toFixed(2) : 0
		}));

		return {
			total: formattedResults.length,
			results: formattedResults
		};

	}

}