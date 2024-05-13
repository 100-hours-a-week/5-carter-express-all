import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import { BACKEND_PORT, FRONTEND_IP_PORT } from "./port.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";

const app = express();
const session = {
  secret: "key123hard123",
  resave: true,
  saveUninitialized: true,
};

app.use(cookieParser());
app.use(expressSession(session));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `${FRONTEND_IP_PORT}`,
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`서버가 http://localhost:${BACKEND_PORT} 에서 실행 중입니다.`);
});
