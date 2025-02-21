const Student = require('../model/student')
const Master = require('../model/master')
const Dojo = require('../model/dojo')
const upload = require("../config/multerConfig");


exports.createStudent = (req, res) => {
    upload.single("storeImage")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const masterEmail = req.user.email;
            const {
                Name,
                dateOfBirth,
                gender,
                contact: { parentName, phone, email, address } = {},
                physicalInfo: { height, weight } = {},
                beltInfo,
                achievements
            } = req.body;
            console.log(req.body);
            
            if (!Name || !dateOfBirth || !gender || !parentName || !phone || !email || !height || !weight) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const existingStudent = await Student.findOne({ 'contact.email': email });

            if (existingStudent) {
                return res.status(400).json({ message: 'A student with this parent email already exists.' });
            }
            const masterData = await Master.findOne({ email: masterEmail, active: true });
            if (!masterData) {
                return res.status(404).json({ message: 'No master found.' });
            }

            const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
            if (!dojo) {
                return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
            }
            const imageUrl = req.file ? req.file.path : undefined; 


            const newStudent = new Student({
                dojoId: dojo._id,
                masterId: masterData._id,
                Name,
                dateOfBirth,
                gender,
                contact: {
                    parentName,
                    phone,
                    email,
                    address: address || ''
                },
                physicalInfo: {
                    height,
                    weight
                },
                beltInfo: beltInfo || { currentBelt: 'White' },
                image : imageUrl,
                achievements: achievements || []
            });

            await newStudent.save();
            res.status(201).json({ message: 'Student created successfully', student: newStudent });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};


exports.getStudents = async (req, res) => {
    try {
        const masterEmail = req.user.email;  // Ensure authentication middleware sets req.user
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }
        const students = await Student.aggregate([
            { 
                $match: { masterId: masterData._id, active: true }
            },
            {
                $addFields: {
                    age: {
                        $dateDiff: {
                            startDate: "$dateOfBirth",
                            endDate: new Date(),
                            unit: "year"
                        }
                    }
                }
            }
        ]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found.' });
        }

        res.status(200).json({ success: true,
            data: students,
            message: 'Students retrieved successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getStudentById = async (req, res) => {
    try {
        const masterEmail = req.user.email;  // Ensure authentication middleware sets req.user
        const studId = req.params.id
        // Find the master to get the dojo and master IDs
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }
        const student = await Student.findOne({_id:studId, masterId: masterData._id, active: true })
                                    //   .populate('dojoId', 'name location')  // Populate dojo details
        if (!student) {
            return res.status(404).json({ message: 'No student found.' });
        }
        res.status(200).json({ success: true,
            data: student,
            message: 'student retrieved successfully.'  });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateBelt = async(req,res)=>{
    try{
        const masterEmail = req.user.email;  
        const studId = req.params.id
        const {currentBelt,dateAwarded}=req.body
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }

        const student = await Student.findOneAndUpdate({_id:studId, masterId: masterData._id, active: true },
            {$set :{'beltInfo.currentBelt': currentBelt },
                    $push: { 'beltInfo.beltHistory': { belt: currentBelt, dateAwarded } } },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            message: "Belt details updated successfully.",
            data: student
        });
        

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.addAchievements = async(req,res)=>{
    try{
        const masterEmail = req.user.email;  
        const studId = req.params.id
        const {title,date,description,category}=req.body
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }

        const student = await Student.findOneAndUpdate({_id:studId, masterId: masterData._id, active: true },
            { $push: {achievements: {title, date, description,category} } },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            message: "Achievements updated successfully.",
            data: student
        });
        

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}



exports.deleteStudent = async(req,res)=>{
    try{
        const masterEmail = req.user.email;  
        const studId = req.params.id
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }
        const student = await Student.findOneAndUpdate({_id:studId, masterId: masterData._id, active: true},
            { $set: {active:false} },
            { new: true, runValidators: true })
            res.status(200).json({
                message: "Delete student.",
                data: student
            });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

