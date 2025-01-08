const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)
    console.log("Encrypted password: ", password)
}

module.exports = { encryptPassword };