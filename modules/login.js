const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const getData = require("../config/database");

const SECRET_KEY = process.env.PASS_SECRET;

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Bodyyy :", req.body);
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Please enter Email and Password.'});
    }
    const query = `select * from job_portal.users u where u.email = '${email}' and u.deleted = false`;
    let user = await getData(query);
    console.log("User :", user);
    if (!user.length) {
        res.status(400).json({ success: false, message: 'No user found.'});
    }
    const userData = user[0];
    // const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash('testing@123', salt);
    //   console.log("Hashed Pass::",hashedPassword);
    const isPass = await bcrypt.compare(password, userData.password)
    console.log(">>>>>>", isPass);
    if (!userData || !isPass) {
        return res.status(401).json({ success: false, message: 'Invalid credentials',  pass: isPass});
    }
    const token = jwt.sign({ id: userData.id, email: userData.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ success: true, message: 'Auth Generated Successfully',  token: token });
    return next(res);

}; 
