//APIs to handle Users
const executeQuery = require("../config/database");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

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
        let user = await executeQuery(query);
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

module.exports.createUser = async (req, res, next) => {
    //check required fields
    const requiredFields = [ 'name', 'contact', 'city', 'state', 'pincode', 'address', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameters.",
            missingFields: missingFields,
        });
    }
    //API body
    const { name, contact, city, state, pincode, address, email, password } = req.body;

    //Check if user already exists with Email
    const checkUserQuery = `select * from job_portal.users u where u.email = '${email}' and u.deleted = false`;
    console.log("checkUserQuery :",checkUserQuery);
    let isUserExist = await executeQuery(checkUserQuery);
    console.log("Userrrrr:",isUserExist);
    if(isUserExist.length > 0){
        res.status(200).json({
            success: false,
            message: "User already exist with this Email",
        });
    } 
    else {
        try {
            //Hash the Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log("Hashed Password :",hashedPassword);
            const insertQuery = `INSERT INTO job_portal.users (name, contact, city, state, pincode, address, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
            const values = [name, contact, city, state, pincode, address, email, hashedPassword];
            const result = await executeQuery(insertQuery, values);
            const newUser = result[0];
            console.log("newUser>>>",newUser);
            // const loginResponse = await axios.post(process.env.API_URL+'/login', {
            //     email: email,
            //     password: password,
            // });
            // console.log("loginResponse>>",loginResponse?.data);
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.PASS_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.ENV !== "DEV",
                sameSite: process.env.ENV === 'DEV' ? 'Strict' : 'None',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
        
            res.status(201).json({
                success: true,
                message: 'Sign Up Successful'
            });
        } catch (error) {
            console.log('Error inserting user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create user'
            });
        }
    }

}

module.exports.createEmployer = async (req, res, next) => {
    //check required fields
    const requiredFields = [ 'employer_name', 'employer_contact', 'employer_address', 'employer_email', 'employer_password' ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameters.",
            missingFields: missingFields,
        });
    }
    //API body
    const { employer_name, employer_contact, employer_address, employer_email, employer_password } = req.body;

    //Check if Employer already exists with Email
    const checkEmployerQuery = `select * from job_portal.employers e where e.email = '${employer_email}' and e.deleted = false`;
    console.log("checkEmployerQuery :",checkEmployerQuery);
    let isEmployerExist = await executeQuery(checkEmployerQuery);
    console.log("Employerrr:",isEmployerExist);
    if(isEmployerExist.length > 0){
        res.status(200).json({
            success: false,
            message: "Employer already exist with this Email",
        });
    } 
    else {
        try {
            //Hash the Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(employer_password, salt);
            console.log("Hashed Password :",hashedPassword);
            const insertQuery = `INSERT INTO job_portal.employers (company_name, contact, address, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
            const values = [employer_name, employer_contact, employer_address, employer_email, hashedPassword];
            const result = await executeQuery(insertQuery, values);
            const newEmployer = result[0];
            console.log("newEmployer>>>",newEmployer);

            const token = jwt.sign({ id: newEmployer.id, email: newEmployer.email }, process.env.PASS_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.ENV !== "DEV",
                sameSite: process.env.ENV === 'DEV' ? 'Strict' : 'None',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
        
            res.status(201).json({
                success: true,
                message: 'Sign Up Successful'
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

module.exports.getUserProfile = async (req, res, next) => {
    const {email} = req.query;
    console.log("Params :",req.query);
    if(!email){
        res.status(400);
        res.message = "Email Param Missing.";
        return next(res);
    }

    try {
        const checkUserQuery = `SELECT * FROM job_portal.user_profile WHERE email = $1;`;
        console.log("Query:",checkUserQuery);
        let existingUser = await executeQuery(checkUserQuery, [email]);
        console.log("User Profile Data :",existingUser);
        if (existingUser.length > 0) {
            existingUser = existingUser[0];
            let respbody = {
                currentJobTitle: existingUser.current_job_title,
                experience: existingUser.experience,
                currentCompany: existingUser.current_company,
                noticePeriod: existingUser.notice_period,
                profilePicture: existingUser.profile_picture || '',
                highestQualification: existingUser.highest_qualification,
                fieldOfStudy: existingUser.field_of_study,
                instituteName: existingUser.institute_name,
                graduationYear: existingUser.graduation_year,
                skills: existingUser.skills,
                portfolio: existingUser.portfolio,
                linkedin: existingUser.linkedin,
                github: existingUser.github,
                otherProfile: existingUser.other_profile,
              };
            console.log("respbody:",respbody);
            res.status(200).json({
                success: true,
                message: "User Profile found.",
                data: respbody
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No User Profile data exists."
            });
        }
    } catch (error) {
        console.log('Error getting user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
}

module.exports.editUserProfile = async (req, res, next) => {
    // Check required fields
    const requiredFields = [
        'email',
        // 'currentJobTitle',
        // 'experience',
        // 'currentCompany',
        // 'noticePeriod',
        // 'highestQualification',
        // 'fieldOfStudy',
        // 'instituteName',
        // 'graduationYear',
        // 'skills'
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(200).json({
            success: false,
            message: "Missing required parameters.",
            missingFields: missingFields,
        });
    }

    // API body
    const { email, currentJobTitle, experience, currentCompany, noticePeriod, profilePicture = null, highestQualification, fieldOfStudy, instituteName, graduationYear, skills, portfolio, linkedin, github, otherProfile } = req.body;

    try {
        // Check if user already exists
        const checkUserQuery = `SELECT * FROM job_portal.user_profile WHERE email = $1;`;
        const existingUser = await executeQuery(checkUserQuery, [email]);

        if (existingUser.length > 0) {
            const existingData = existingUser[0];

            // Compare existing data with incoming data
            const updates = {};
            const isValid = (value) => value !== undefined;

            if (isValid(currentJobTitle) && existingData.current_job_title !== currentJobTitle) updates.current_job_title = currentJobTitle;
            if (isValid(experience) && existingData.experience !== experience) updates.experience = experience;
            if (isValid(currentCompany) && existingData.current_company !== currentCompany) updates.current_company = currentCompany;
            if (isValid(noticePeriod) && existingData.notice_period !== noticePeriod) updates.notice_period = noticePeriod;
            if (isValid(profilePicture) && existingData.profile_picture !== profilePicture) updates.profile_picture = profilePicture;
            if (isValid(highestQualification) && existingData.highest_qualification !== highestQualification) updates.highest_qualification = highestQualification;
            if (isValid(fieldOfStudy) && existingData.field_of_study !== fieldOfStudy) updates.field_of_study = fieldOfStudy;
            if (isValid(instituteName) && existingData.institute_name !== instituteName) updates.institute_name = instituteName;
            if (isValid(graduationYear) && existingData.graduation_year !== graduationYear) updates.graduation_year = graduationYear;
            if (isValid(skills) && JSON.stringify(existingData.skills) !== JSON.stringify(skills)) updates.skills = skills;
            if (isValid(portfolio) && existingData.portfolio !== portfolio) updates.portfolio = portfolio;
            if (isValid(linkedin) && existingData.linkedin !== linkedin) updates.linkedin = linkedin;
            if (isValid(github) && existingData.github !== github) updates.github = github;
            if (isValid(otherProfile) && existingData.other_profile !== otherProfile) updates.other_profile = otherProfile;


            if (Object.keys(updates).length > 0) {
                // Build dynamic update query
                const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
                const updateQuery = `UPDATE job_portal.user_profile SET ${setClause} WHERE email = $1 RETURNING *;`;
                const updateValues = [email, ...Object.values(updates)];
                const updatedUser = await executeQuery(updateQuery, updateValues);

                return res.status(200).json({
                    success: true,
                    message: "User profile updated successfully.",
                    userProfile: updatedUser[0]
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "No changes detected, user profile remains unchanged.",
                    userProfile: existingData
                });
            }
        } else {
            // Insert new user profile
            const insertQuery = `INSERT INTO job_portal.user_profile ( email, current_job_title, experience, current_company, notice_period, profile_picture, highest_qualification, field_of_study, institute_name, graduation_year, skills, portfolio, linkedin, github, other_profile ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 ) RETURNING *;`;
            const values = [ email, currentJobTitle, experience, currentCompany, noticePeriod, profilePicture, highestQualification, fieldOfStudy, instituteName, graduationYear, skills, portfolio, linkedin, github, otherProfile ];

            const result = await executeQuery(insertQuery, values);
            const newUserProfile = result[0];

            res.status(201).json({
                success: true,
                message: "User profile created successfully",
                userProfile: newUserProfile
            });
        }
    } catch (error) {
        console.error('Error creating or updating user profile:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create or update user profile."
        });
    }
};
