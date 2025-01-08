const express = require("express");
const sequelize = require("./db");
const { encryptPassword } = require('./encrypt');
const logIn = require("./Modules/LogIn");
const { WarehouseData, getWarehouseDataByID, getCategories } = require("./Modules/WarehouseData");

const PORT = 4000;
const app = express();
const adminPassword = 'ZAQ!2wsx';

app.use(express.json());

app.listen(PORT, async () => {
  try {
    encryptPassword(adminPassword)
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync();
    console.log('Models synchronized!');
    console.log(`Server listening on ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/login", async (req, res) => {
  await logIn(req, res);
});

app.post('/warehouseData', async (req, res) => {
  await WarehouseData(req, res)
});

app.post('/getWarehouseDataByID', async (req, res) => {
  await getWarehouseDataByID(req, res)
});

app.post('/getCategories', async (req, res) => {
  await getCategories(req, res)
});