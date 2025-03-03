const User = require('../models/User');

// Funkcja obsługująca dodawanie użytkownika
const addUser = async (req, res) => {
  const { username, password, canAddProduct, canDeleteProduct, canEditProduct, canEditCategory } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Brak wymaganych danych: username lub password' });
  }

  try {
    // Tworzenie nowego użytkownika
    const newUser = await User.create({
      username,
      password,
      canAddProduct: canAddProduct || false,
      canDeleteProduct: canDeleteProduct || false,
      canEditProduct: canEditProduct || false,
      canEditCategory: canEditCategory || false,
    });

    res.status(201).json({ message: 'Użytkownik został dodany pomyślnie', user: newUser });
  } catch (error) {
    console.error('Błąd przy dodawaniu użytkownika:', error);
    res.status(500).json({ message: 'Błąd przy dodawaniu użytkownika', error });
  }
};

module.exports = addUser;
