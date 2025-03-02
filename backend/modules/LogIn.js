const User = require("../models/User");
const bcrypt = require("bcrypt");

const logIn = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if(user === null) {
            res.status(401).json({error: 'Invalid username'});
            return;
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

module.exports = logIn;