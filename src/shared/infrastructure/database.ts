import { logger } from "./dependencies";

const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDATABASE,
	max: 10, // Máximo de conexiones activas
	idleTimeoutMillis: 30000, // Tiempo máximo de inactividad antes de cerrar la conexión
	connectionTimeoutMillis: 2000, // Tiempo máximo para establecer una conexión
});

pool.on('connect', () => {
	console.log('✅ Database connected');
});

pool.on('error', (err: any) => {
	logger.error(err);
	console.log('❌ Database not connected');
});


export default pool;