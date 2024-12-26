//APIs to handle Jobs
const executeQuery = require("../config/database");

module.exports.postJob = async (req, res, next) => {
    //check required fields
    const requiredFields = [ 'title', 'company_mail', 'experience', 'salary_from', 'salary_to', 'location', 'skills', 'tags', 'description' ];
    const missingFields = requiredFields.filter((field) => {
        const value = req.body[field];
        if (Array.isArray(value)) {
            return value.length === 0;
        } else if (typeof value === 'string') {
            return !value.trim();
        }
        return !value;
    });
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameters.",
            missingFields: missingFields,
        });
    }
    //API body
    const { title, company_mail, experience, salary_from, salary_to, location, skills, tags, description } = req.body;

    //Check if Employer already exists with Email
    const checkEmployerQuery = `select * from job_portal.employers e where e.email = '${company_mail}' and e.deleted = false`;
    console.log("check Employer Query :",checkEmployerQuery);
    const isEmployerExist = await executeQuery(checkEmployerQuery);
    console.log("Employer Detail:",isEmployerExist);
    if(isEmployerExist.length < 1){
        res.status(200).json({
            success: false,
            message: "Employer doesn't exist with this Email",
        });
    } 
    else {
        try {
            const insertQuery = `INSERT INTO job_portal.jobs (title, company, experience, salary_from, salary_to, location, description, tags, skills, employer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`;
            const values = [title, isEmployerExist[0]?.company_name, experience, salary_from, salary_to, location, description, tags, skills, isEmployerExist[0]?.id];

            const result = await executeQuery(insertQuery, values);
            const newJob = result[0];
            console.log("newJob>>>",newJob);
        
            res.status(201).json({
                success: true,
                message: 'Job Posted'
            });
        } catch (error) {
            console.log('Error Inserting Employer:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create Employer'
            });
        }
    }

}