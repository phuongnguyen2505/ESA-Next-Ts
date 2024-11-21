// lib/db.js
import mysql from "mysql2";

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "esa_next",
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to the database:", err.stack);
	} else {
		console.log("Connected to the database");
	}
});

export default db;
