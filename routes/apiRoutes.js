const express = require("express");
const router = express.Router();

router.route('/get-dashboard').get((req, res) => {
    res.status(200).json({message : `This is Dashboard Api.`});
})

module.exports = router;