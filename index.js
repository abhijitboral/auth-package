require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});