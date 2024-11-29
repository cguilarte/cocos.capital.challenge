import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

type ValidationTarget = "body" | "query" | "params";

export const validate = (schema: Schema, target: ValidationTarget = "body") => {
	return (req: Request, res: Response, next: NextFunction): void => {
		// Elegimos la parte del request que se debe validar
		const dataToValidate = req[target];

		const { error } = schema.validate(dataToValidate, { abortEarly: false });

		if (error) {
			res.status(400).json({
				error: error.details.map((detail) => detail.message), // Devuelve todos los errores
			});
			return; // Detenemos la ejecución del middleware
		}

		next(); // Continúa al siguiente middleware o controlador
	};
};
