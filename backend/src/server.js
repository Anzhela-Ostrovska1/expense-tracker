import express from "express"; 
import cors from "cors"; 
import dotenv from "dotenv"; 
import "./db.js";
import authRoutes from "./routes/auth.routes.js"; 
import transactionRoutes from "./routes/transactions.routes.js";

dotenv.config(); 




const app = express();
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://expense-tracker-chi-jade.vercel.app'
  ]
}));
app.use(express.json());

app.use("/api/auth", authRoutes); 
app.use("/api/transactions", transactionRoutes); 

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});



const PORT = process.env.PORT || 5000;    
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


