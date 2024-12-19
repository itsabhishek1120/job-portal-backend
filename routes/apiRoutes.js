const express = require("express");
const router = express.Router();
const {
    getdashboard,
    postdashboard,
    getUser
} = require('../controllers/apiController');

router.route('/get-dashboard').get(getdashboard);

router.route('/post-dashboard').post(postdashboard);

router.route('/get-user').get(getUser);

module.exports = router;