import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js"
import sequelize from "./models/index.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});