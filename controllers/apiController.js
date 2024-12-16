//Controller for the APIs

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

module.exports = {getdashboard, postdashboard};