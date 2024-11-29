import Joi from "joi";

// finimos el esquema para validar la entrad de una orden BUY o SELL
export const orderSchema = Joi.object({
	userId: Joi.number()
		.integer()
		.min(1)
		.required()
		.messages({ "any.required": "El campo 'userId' es obligatorio" }),
	instrumentId: Joi.number()
		.integer()
		.min(1)
		.required()
		.messages({ "any.required": "El campo 'instrumentId' es obligatorio" }),
	side: Joi.string()
		.valid("BUY", "SELL")
		.required()
		.messages({ "any.required": "El campo 'side' es obligatorio", "any.only": "El campo 'side' solo puede ser 'BUY' o 'SELL'" }),
	type: Joi.string()
		.valid("MARKET", "LIMIT")
		.required()
		.messages({ "any.required": "El campo 'type' es obligatorio", "any.only": "El campo 'type' solo puede ser 'MARKET' o 'LIMIT'" }),
	quantity: Joi.number()
		.positive()
		.required()
		.messages({ "any.required": "El campo 'quantity' es obligatorio", "number.positive": "La cantidad debe ser un número positivo" }),
	price: Joi.number()
		.positive()
		.when("side", {
			is: "SELL",
			then: Joi.required().messages({ "any.required": "El campo 'price' es obligatorio cuando 'side' es 'SELL'" }),
			otherwise: Joi.optional(),
		})
		.messages({ "number.positive": "El precio debe ser un número positivo" }),
});


// Define el esquema para validar el parámetro query
export const querySchema = Joi.object({
	query: Joi.string()
		.min(1)
		.required()
		.messages({
			"any.required": "El parámetro 'query' es obligatorio",
			"string.empty": "El parámetro 'query' no puede estar vacío",
		}),
});

// Definimos el esquema para validar el parámetro `id` en la ruta
export const portfolioSchema = Joi.object({
	userId: Joi.number().integer().min(1).required(), // Validamos que `id` sea un número entero positivo
});