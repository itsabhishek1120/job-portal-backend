//APIs to handle Users
const getData = require("../config/database");

module.exports.getUser = async (req, res, next) => {
    const {email, password} = req.query;
    console.log("Bodyyy>>>>>",req.query);
        if(!email || !password){
            console.log(">>........",req.body);
            res.status(400);
            res.message = "Please enter Email and Password.";
            return next(res);
        }
    try {
        const query = `select * from job_portal.users u where u.email = '${email}' and u.password = '${password}' and u.deleted = false`;
        // const query = `select * from job_portal.users`;
        console.log("Query :",query);
        let user = await getData(query);
        console.log("User Data>>>",user);
    } catch (error) {
        console.log("Getting Error>>",error);
    }
}