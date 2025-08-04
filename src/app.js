import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://mail.google.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//import tracking routes
import trackingRoutes from "./routes/email.route.js";
app.use("/api/v1/email", trackingRoutes);

export default app;
