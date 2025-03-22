// lib/db.ts
import mysql from "mysql2";

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

export const executeQuery = async <T>(query: string, values: any[] = []): Promise<T> => {
	try {
		const [results] = await db.promise().execute(query, values);
		return results as T;
	} catch (error) {
		throw Error('Database query failed: ' + error);
	}
}

export default db;
