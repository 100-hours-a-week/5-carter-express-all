import MySQLStore from "express-mysql-session";
import pool from "./db.js";

const options = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  createDatabaseTable: true,
};

const sessionStore = new MySQLStore(options, pool);

export default sessionStore;
