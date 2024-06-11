import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import dotenv from "dotenv";

import sessionStore from "./sessionStore.js";

import { BACKEND_PORT, FRONTEND_IP_PORT } from "./port.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";

dotenv.config();

const app = express();

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: sessionStore,
  }),
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `${FRONTEND_IP_PORT}`,
    credentials: true,
  }),
);

app.use((req, res, next) => {
  if (!req.session.viewCount) {
    req.session.viewCount = 0;
  }
  req.session.viewCount++;
  console.log(`세션 ID: ${req.sessionID}, 조회수: ${req.session.viewCount}`);
  next();
});

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`서버가 http://localhost:${BACKEND_PORT} 에서 실행 중입니다.`);
});
