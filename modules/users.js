//APIs to handle Users
const getData = require("../config/database");

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
        let user = await getData(query);
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