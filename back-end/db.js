import mysql from "mysql2/promise";
import { dbConfig } from "./config/db.config.js";

const connection = await mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

console.log("Successfully connected to the database.");

export default connection;
