const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authentication');
const {
    getdashboard,
    postdashboard,
    getUser,
    login,
    createUser,
    createEmployer
} = require('../controllers/apiController');

router.route('/get-dashboard').get(getdashboard);

router.route('/post-dashboard').post(postdashboard);

router.route('/get-user').get(authenticateJWT,getUser);

router.route('/login').post(login);

router.route('/signup-user').post(createUser);

router.route('/signup-employer').post(createEmployer);

module.exports = router;