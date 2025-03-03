const express = require('express');
const router = express.Router();
const db = require('../db'); // Importujemy moduł bazy danych
const User = require('../models/User'); // Przechodzi jeden poziom wyżej do katalogu `models/`


function isAdmin(req, res, next) {
  if (
    req.user &&
    req.user.canAddProduct &&
    req.user.canDeleteProduct &&
    req.user.canEditProduct &&
    req.user.canEditCategory
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Brak uprawnień' });
}

// Tymczasowo wyłączamy sprawdzanie uprawnień
router.post('/add-user', async (req, res) => {
    const { username, password, canAddProduct, canDeleteProduct, canEditProduct, canEditCategory } = req.body;
    try {
      await db.sequelize.sync();
      const newUser = await User.create({
        username,
        password,
        canAddProduct: canAddProduct || false,
        canDeleteProduct: canDeleteProduct || false,
        canEditProduct: canEditProduct || false,
        canEditCategory: canEditCategory || false
      });
      res.json({ message: 'Użytkownik dodany', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Błąd przy dodawaniu użytkownika', error });
    }
  });