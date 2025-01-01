import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { gamesRouter } from "./routes/games"; 
import { cors } from "hono/cors";
import { wsRouter } from "./routes/ws"; 


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/games", gamesRouter); 
app.route("/api/v1/ws", wsRouter); 


export default app;