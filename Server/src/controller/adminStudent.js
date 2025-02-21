const Student = require('../model/Student')
// const Master = require('../model/Master')
// const Dojo = require('../model/Dojo')

// exports.getStudents = async (req, res) => {
//     try {
//         const students = await Student.aggregate([
//             { 
//                 $match: {active: true }
//             },
//             {
//                 $addFields: {
//                     age: {
//                         $dateDiff: {
//                             startDate: "$dateOfBirth",
//                             endDate: new Date(),
//                             unit: "year"
//                         }
//                     }
//                 }
//             }
//         ]);

//         if (students.length === 0) {
//             return res.status(404).json({ message: 'No students found.' });
//         }

//         res.status(200).json({ success: true,
//             data: students,
//             message: 'Students retrieved successfully.' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find({ active: true })
            .populate('dojoId', 'name address.place') // Only fetch dojo name and place

        if (!students.length) {
            return res.status(404).json({ message: 'No students found.' });
        }

        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            age: new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear(),
            dojoName: student.dojoId?.name,
            dojoPlace: student.dojoId?.address?.place
        }));

        res.status(200).json({
            success: true,
            data: formattedStudents,
            message: 'Students retrieved successfully.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getStudentById = async (req, res) => {
    try {
        const studId = req.params.id

        const student = await Student.findOne({_id:studId,  active: true })
                                      .populate('dojoId', 'name address.place' )  // Populate dojo details
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


exports.filterStudByDojo = async (req, res) => {
    try {
        const { place } = req.query;; 
        if(!place){
             return res.status(404).json({ message: 'No place given.' });
 
        }
        const students = await Student.find({ active: true })
            .populate({
                path: 'dojoId',
                select: 'name address.place',
                match: place ? { 'address.place': place } : {} // Filter by place if provided
            });

        // Remove students where dojoId is null (when no match in filter)
        const filteredStudents = students.filter(student => student.dojoId);

        if (!filteredStudents.length) {
            return res.status(404).json({ message: `No students at this Dojo.` });
        }

        const formattedStudents = filteredStudents.map(student => ({
            ...student.toObject(),
            age: new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear(),
            dojoName: student.dojoId?.name,
            dojoPlace: student.dojoId?.address?.place
        }));

        res.status(200).json({
            success: true,
            data: formattedStudents,
            message: 'Students retrieved successfully.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// exports.filtereStudentsAge = async (req, res) => {
//     try {
//         const {minAge, maxAge} = req.query;
//         const currentDate = new Date();

//         const students = await Student.aggregate([
//             {
//                 $addFields: {
//                     age: {
//                         $dateDiff: { startDate: "$dateOfBirth", endDate: currentDate, unit: "year" }
//                     }
//                 }
//             },
//             {
//                 $match: {
//                     active: true,
//                     ...(minAge && { age: { $gte: parseInt(minAge) } }),
//                     ...(maxAge && { age: { $lte: parseInt(maxAge) } })
//                 }
//             }
//         ]);

//         res.status(200).json({ success: true, data: students });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


