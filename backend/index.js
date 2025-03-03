const express = require("express");
const { sequelize } = require("./db");
const { encryptPassword } = require('./encrypt');
const logIn = require("./modules/LogIn");
const { getWarehouseDataByCategoryId, getCategories, addCategory, setWarehouseData} = require("./modules/WarehouseData");
const addUser = require('./modules/addUser'); // Upewnij się, że ścieżka jest poprawna
const adminRoutes = require('./routes/AdminRoutes');
const addAdmin = require("./modules/admin"); // Import routera
const Warehouse = require('./models/Warehouse');
const Category = require('./models/Category');
const CategoryCustomField = require('./models/CategoryCustomField');
const WarehouseProperties = require('./models/WarehouseProperties');
const {getWarehouseDataByID} = require("./modules/Warehouse");


const PORT = 4000;
const app = express();
const adminPassword = 'zaq1@WSX';

app.use(express.json());



// Associations
Category.hasMany(CategoryCustomField, {
  foreignKey: 'CategoryID', // Matches the field in CategoryCustomField
  as: 'customFields' // Alias for the association
});

Category.hasMany(Warehouse, {
  foreignKey: 'categoryId', // Matches the field in Warehouse
  as: 'warehouses' // Alias for the association
});



// Associations
CategoryCustomField.belongsTo(Category, {
  foreignKey: 'CategoryID', // Matches the field in CategoryCustomField
  as: 'category' // Alias for the association
});

CategoryCustomField.hasMany(WarehouseProperties, {
  foreignKey: 'CustomFieldID', // Matches the field in WarehouseProperties
  as: 'properties' // Alias for the association
});



// Associations
Warehouse.belongsTo(Category, {
  foreignKey: 'categoryId', // Matches the field in Warehouse
  as: 'category' // Alias for the association
});

Warehouse.hasMany(WarehouseProperties, {
  foreignKey: 'WarehouseID', // Matches the field in WarehouseProperties
  as: 'properties' // Alias for the association
});



// Associations
WarehouseProperties.belongsTo(Warehouse, {
  foreignKey: 'WarehouseID', // Matches the field in WarehouseProperties
  as: 'warehouse' // Alias for the association
});

WarehouseProperties.belongsTo(CategoryCustomField, {
  foreignKey: 'CustomFieldID',
  targetKey: 'id',  // This is crucial for correct joining
  as: 'customField'
});









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

app.get('/warehouse/:categoryId', async (req, res) => {
  await getWarehouseDataByCategoryId(req, res);
});

app.put('/warehouse/:categoryId/:productId', async (req, res) => {
  await setWarehouseData(req, res);
});

app.get('/categories', async (req, res) => {
  await getCategories(req, res);
});


app.post('/users/add', addUser);

app.put('/category/:name', addCategory);
app.put('/category', addCategory);