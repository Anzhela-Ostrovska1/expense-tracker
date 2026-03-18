import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL via Sequelize"))
  .catch((err) => console.error("❌ DB connection error:", err));

export default sequelize;



