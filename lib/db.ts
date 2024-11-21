// lib/db.js
import mysql from "mysql2";

const db = mysql.createConnection({
	host: "14.225.192.251",
	user: "adcacomv_esa",
	password: "uCd79ZB3TKQP",
	database: "adcacomv_esa",
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to the database:", err.stack);
	} else {
		console.log("Connected to the database");
	}
});

export default db;
