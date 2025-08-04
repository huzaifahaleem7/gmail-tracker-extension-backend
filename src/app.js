import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//import tracking routes
import trackingRoutes from "./routes/email.route.js";
app.use("/api/email", trackingRoutes);

export default app;
