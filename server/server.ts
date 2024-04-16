import express from "express"
import dotenv from "dotenv";
import { processEnv } from "./env";
import UrlRoute from "./routes/url";
import errorMiddleware from "./middlewares/error.middleware";
import cors from 'cors';

const { PORT } = processEnv;
const urlRoute = new UrlRoute();
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  
  res.send({ greeting: "Hello world!" });
});

app.use(urlRoute.path, urlRoute.router)
app.use(errorMiddleware);

app.listen(PORT);
