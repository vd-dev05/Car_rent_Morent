import { Router } from "express";
import UserRouter from "./userRouter/index.js";
import CarRouter from "./carRouter/index.js";
import NewsRouter from "./newsRouter/index.js";
import CommentRouter from "./commentRouter/index.js";
import MailRouter from "./mailRouter/index.js";
import ApplicationRouter from "./applicationRouter/index.js";
const V1Router = Router();

V1Router.use("/users", UserRouter);
V1Router.use("/cars", CarRouter);
V1Router.use("/news", NewsRouter);
V1Router.use("/comments", CommentRouter);
V1Router.use("/mail", MailRouter);
V1Router.use("/applications", ApplicationRouter);

export default V1Router;
