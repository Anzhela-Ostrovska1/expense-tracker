import express from "express";
import Transaction from "../models/transaction.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// MIDDLEWARE — проверяем токен перед каждым запросом
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // ← сохраняем userId в запросе
    next(); // ← пускаем дальше
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ПОЛУЧИТЬ ВСЕ ТРАНЗАКЦИИ ПОЛЬЗОВАТЕЛЯ
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.userId },
      order: [["date", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ДОБАВИТЬ ТРАНЗАКЦИЮ
router.post("/", authMiddleware, async (req, res) => {
  const { amount, type, category, date, description } = req.body;

  try {
    const transaction = await Transaction.create({
      user_id: req.userId,
      amount,
      type,
      category,
      date,
      description,
    });
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// УДАЛИТЬ ТРАНЗАКЦИЮ
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.destroy();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// РЕДАКТИРОВАТЬ ТРАНЗАКЦИЮ
router.put("/:id", authMiddleware, async (req, res) => {
  const { amount, type, category, date, description } = req.body;

  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.update({ amount, type, category, date, description });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
