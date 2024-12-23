//APIs to handle Users
const executeQuery = require("../config/database");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

module.exports.getUser = async (req, res, next) => {
    const {email, password} = req.query;
    console.log("Params :",req.query);
    if(!email || !password){
        res.status(400);
        res.message = "Please enter Email and Password.";
        return next(res);
    }

    try {
        const query = `select * from job_portal.users u where u.email = '${email}' and u.password = '${password}' and u.deleted = false`;
        console.log("Query :",query);
        let user = await executeQuery(query);
        if(!user.length){
            res.status(200).json({
                success: false,
                message: "No user data found.",
                data: user
            });
        }
        console.log("User Data :",user);
        res.status(200).json({
            success: true,
            message: res.message || "Data fetched successfully.",
            data: user
        });
    } catch (error) {
        console.log("Getting Error>>",error);
    }
}

module.exports.createUser = async (req, res, next) => {
    //check required fields
    const requiredFields = [ 'name', 'contact', 'city', 'state', 'pincode', 'address', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameters.",
            missingFields: missingFields,
        });
    }
    //API body
    const { name, contact, city, state, pincode, address, email, password } = req.body;

    //Check if user already exists with Email
    const checkUserQuery = `select * from job_portal.users u where u.email = '${email}' and u.deleted = false`;
    console.log("checkUserQuery :",checkUserQuery);
    let isUserExist = await executeQuery(checkUserQuery);
    console.log("Userrrrr:",isUserExist);
    if(isUserExist.length > 0){
        res.status(200).json({
            success: false,
            message: "User already exist with this Email",
        });
    } 
    else {
        try {
            //Hash the Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log("Hashed Password :",hashedPassword);
            const insertQuery = `INSERT INTO job_portal.users (name, contact, city, state, pincode, address, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
            const values = [name, contact, city, state, pincode, address, email, hashedPassword];
            const result = await executeQuery(insertQuery, values);
            const newUser = result[0];
            console.log("newUser>>>",newUser);
            // const loginResponse = await axios.post(process.env.API_URL+'/login', {
            //     email: email,
            //     password: password,
            // });
            // console.log("loginResponse>>",loginResponse?.data);
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.PASS_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.ENV !== "DEV",
                sameSite: process.env.ENV === 'DEV' ? 'Strict' : 'None',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
        
            res.status(201).json({
                success: true,
                message: 'Sign Up Successful'
            });
        } catch (error) {
            console.log('Error inserting user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create user'
            });
        }
    }

}