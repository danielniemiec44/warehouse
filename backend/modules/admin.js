const User = require('../models/User');

// Funkcja bez obslugi http obsługująca dodawanie admina jeśli nie istnieje
const addAdmin = async (username, password) => {
    return await User.findOrCreate({
        where: {username: username},
        defaults: {
            username,
            password,
            canAddProduct: true,
            canDeleteProduct: true,
            canEditProduct: true,
            canEditCategory: true,
        }
    });
}

module.exports = addAdmin;