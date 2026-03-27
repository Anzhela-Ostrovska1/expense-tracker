import express from "express";
import bcrypt from "bcryptjs"; //хешурует пароль для базы данных и потом расшифроввывает 
                               //когда пользователь вводит норм пароль (123456) с тем хешированным в базе даннх
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

// РЕГИСТРАЦИЯ
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 1. Проверяем есть ли уже такой email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 2. Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Создаём пользователя в базе
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // 4. Создаём JWT токен
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ЛОГИН
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Ищем пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Сравниваем пароль с хешем
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Создаём JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;