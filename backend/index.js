const express = require("express");
const { sequelize } = require("./db");
const { encryptPassword } = require('./encrypt');
const logIn = require("./modules/LogIn");
const { WarehouseData, getWarehouseDataByID, getCategories, setWarehouseDataByID, getCategory, addNewItem, updateItemQuantity, addCategory } = require("./modules/WarehouseData");
const addUser = require('./modules/addUser'); // Upewnij się, że ścieżka jest poprawna
const adminRoutes = require('./routes/AdminRoutes');
const addAdmin = require("./modules/admin"); // Import routera
const Warehouse = require('./models/Warehouse');
const Category = require('./models/Category');
const CategoryCustomField = require('./models/CategoryCustomField');
const WarehouseProperties = require('./models/WarehouseProperties');


const PORT = 4000;
const app = express();
const adminPassword = 'zaq1@WSX';

app.use(express.json());

Warehouse.belongsTo(Category, { as: 'category' });
CategoryCustomField.belongsTo(Category, { as: 'category', foreignKey: 'CategoryID', targetKey: 'id' });

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync();
    console.log('Models synchronized!');
    console.log(`Server listening on ${PORT}`);
    await addAdmin('admin', adminPassword);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});


// Endpointy API
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/login", async (req, res) => {
  await logIn(req, res);
});

app.get('/warehouse', async (req, res) => {
  await WarehouseData(req, res);
});

app.get('/warehouse/:id', async (req, res) => {
  await getWarehouseDataByID(req, res);
});

app.put('/warehouse/:id', async (req, res) => {
  await setWarehouseDataByID(req, res);
});

app.get('/categories', async (req, res) => {
  await getCategories(req, res);
});

app.post('/api/warehouse/add', addNewItem);
app.put('/api/warehouse/update', updateItemQuantity);
app.put('/category/:name', addCategory);
app.post('/users/add', addUser);


app.put('/category/:name', addCategory);
app.put('/category', addCategory);