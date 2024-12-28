//Controller for the APIs
const usersModule = require('../modules/users');
const loginModule = require('../modules/login');
const jobsModule = require('../modules/jobs');

const getdashboard = (req, res) => {
    res.status(200).json({message : `This is Get Dashboard Api.`});
}

const postdashboard = (req, res) => {
    console.log("This is request body :",req.body);
    const {name, is_tested} = req.body;
    if(!name || !is_tested){
        res.status(400);
        throw new Error("Body Params Missing !!");
    }
    res.status(200).json({message : `This is Post Dashboard Api.`});
}

const getUser = (req, res, next) => {
    usersModule.getUser(req, res, next);
}

const createUser = (req, res, next) => {
    usersModule.createUser(req, res, next);
}

const createEmployer = (req, res, next) => {
    usersModule.createEmployer(req, res, next);
}

const login = (req, res, next) => {
    loginModule.login(req, res, next);
}

const logout = (req, res, next) => {
    loginModule.logout(req, res, next);
}

const verifyToken = (req, res, next) => {
    loginModule.verifyToken(req, res, next);
}

const postJob = (req, res, next) => {
    jobsModule.postJob(req, res, next);
}

module.exports = {
    getdashboard,
    postdashboard,
    getUser,
    login,
    logout,
    verifyToken,
    createUser,
    createEmployer,
    postJob
};