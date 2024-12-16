const express = require("express");
const router = express.Router();
const {getdashboard,
    postdashboard} = require('../controllers/apiController');

router.route('/get-dashboard').get(getdashboard);

router.route('/post-dashboard').post(postdashboard);

module.exports = router;