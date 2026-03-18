import express from "express"; //фреймворк для Node.js
import cors from "cors"; //Браузер **блокирует** запросы если фронтенд и бекенд на разных портах. cors() говорит — разрешить ✅
import dotenv from "dotenv"; 
import "./db.js";
import authRoutes from "./routes/auth.routes.js"; 

dotenv.config(); // ← читает .env файл

// `app.use()` — это **middleware** (промежуточный обработчик). Каждый запрос проходит через него перед тем как попасть в роут:
// ```
// Запрос от Angular
//        ↓
// app.use(cors())          ← разрешает запросы с других портов. Без этого Angular не может обращаться к бекенду
//        ↓
// app.use(express.json())  ← превращает JSON в объект req.body. // Без этого req.body было бы undefined
//                                                                  Когда Angular отправляет { email, password }
//                                                                  express.json() превращает это в JavaScript объект
//        ↓
// app.use("/api/auth", authRoutes)  ← отправляет на нужный роут. Это значит — все запросы которые начинаются с `/api/auth` отправляй в `authRoutes`:
//        ↓
//      Ответ

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); 

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend works 🚀" });
});

const PORT = process.env.PORT || 5000;    // если есть в .env   если нет — используй 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// 
// 1. Angular отправляет:
//    POST http://localhost:5000/api/auth/register
//    Body: { email: "vasya@mail.ru", password: "123456" }

// 2. cors() → разрешает запрос с порта 4200

// 3. express.json() → превращает Body в req.body объект

// 4. app.use("/api/auth") → видит /api/auth/register
//    → отправляет в authRoutes

// 5. router.post("/register") → выполняет логику:
//    → проверяет email
//    → хеширует пароль
//    → сохраняет в базу
//    → создаёт токен

// 6. res.json({ token, user }) → отправляет ответ в Angular