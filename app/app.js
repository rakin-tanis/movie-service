import express from "express";
import dotenv from "dotenv";
import router from "./router/router.js";
import { advisor } from "./middleware/advisor.js";

const app = express();
dotenv.config();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(advisor);

export default app;
