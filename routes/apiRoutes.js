const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authentication');
const {
    getdashboard,
    postdashboard,
    getUser,
    login,
    logout,
    verifyToken,
    createUser,
    createEmployer,
    postJob,
    getUserProfile,
    editUserProfile
} = require('../controllers/apiController');

router.route('/get-dashboard').get(getdashboard);

router.route('/post-dashboard').post(postdashboard);

router.route('/get-user').get(authenticateJWT, getUser);

router.route('/login').post(login);

router.route('/logout').post(logout);

router.route('/verify-token').get(authenticateJWT, verifyToken);

router.route('/signup-user').post(createUser);

router.route('/signup-employer').post(createEmployer);

router.route('/create-job-post').post(authenticateJWT, postJob);

router.route('/get-user-profile').get(authenticateJWT, getUserProfile);

router.route('/edit-user-profile').post(authenticateJWT, editUserProfile);


module.exports = router;