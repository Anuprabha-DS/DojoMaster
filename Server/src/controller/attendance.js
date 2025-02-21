const Attendance = require('../model/Attendance')
const Master = require('../model/Master')
const Dojo = require('../model/Dojo')
const Student = require('../model/Student')


exports.Attendance = async(req,res)=>{
    try{
        const masterEmail = req.user.email;  
        const {studId} = req.body

        if (!studId) {
            return res.status(400).json({ message: ' Student ID is required' });
          }
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        console.log(masterData);
        
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        console.log(dojo.address.place);
        
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }
        const student = await Student.findOne({_id:studId, masterId: masterData._id, active: true })
        console.log(student);
        
        if (!student) {
            return res.status(404).json({ message: 'No student found.' });
        }
        const attendance = await Attendance({
            dojoId: dojo.id,
            date: new Date(),
            studentId:studId 
            
        })
        await attendance.save()
        res.status(201).json({
            success: true,
            data: attendance,
            message: `${student.Name}'s Attendance marked`
        });

    }catch(error){
        res.status(500).json({ message: error.message});
    }
}

// exports.viewAttendance = async(req,res)=>{
//     try{
//         const today = new Date()
//         const masterEmail = req.user.email;  
//         const masterData = await Master.findOne({ email: masterEmail, active: true });
        
//         if (!masterData) {
//             return res.status(404).json({ message: 'No master found.' });
//         }
//         const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });

//         if (!dojo) {
//             return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
//         }
//         const {attendDate} = req.body
//         console.log(attendDate);
        
//         if(attendDate == "00-00-0000"){
//             console.log(today);
            
//             const attendance = await Attendance.find({dojoId:masterData.assignedDojoId , date:today}).populate("studentId","Name")
        
//             if (attendance.length === 0) {
//                 return res.status(404).json({ message: 'No data found.' });
//             }
//             const formattedData = attendance.map(record => ({
//                 _id: record._id,
//                 dojoId: record.dojoId,
//                 date: record.date.toISOString().split('T')[0], 
//                 time: record.date.toTimeString().split(' ')[0],
//                 // date: record.date,
//                 studentId: record.studentId._id,  // Extract student's ID
//                 Name: record.studentId.Name       // Extract student's Name
//               }));
//             res.status(200).json({
//                 success: true,
//                 data: formattedData,
//                 message: 'Attendance retrieved successfully.'
//             });
//         }
        

       

//     }catch(error){
//         res.status(500).json({ message: error.message});
//     }
// }


exports.viewAttendance = async (req, res) => {
    try {
      const masterEmail = req.user.email;
      const masterData = await Master.findOne({ email: masterEmail, active: true });
  
      if (!masterData) {
        return res.status(404).json({ message: "No master found." });
      }
  
      const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
  
      if (!dojo) {
        return res.status(404).json({ message: "Assigned dojo does not exist or is inactive." });
      }
  
      // Get date, month, year from query params (optional)
      const { date, month, year } = req.query;
  
      let startDate, endDate;
  
      if (date && month && year) {
        // Specific day
        startDate = new Date(`${year}-${month}-${date}T00:00:00.000Z`);
        endDate = new Date(`${year}-${month}-${date}T23:59:59.999Z`);
      } else if (month && year) {
        // Full month
        startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
        endDate = new Date(`${year}-${month}-31T23:59:59.999Z`); // Works for all months, MongoDB adjusts invalid days
      } else {
        // Default: Today’s date
        const today = new Date();
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
      }
  
      const attendance = await Attendance.find({
        dojoId: masterData.assignedDojoId,
        date: { $gte: startDate, $lte: endDate },
      }).populate("studentId", "Name");
  
      if (attendance.length === 0) {
        return res.status(404).json({ message: "No attendance data found." });
      }
  
      const formattedData = attendance.map((record) => ({
        _id: record._id,
        dojoId: record.dojoId,
        date: record.date.toISOString().split("T")[0], // Format YYYY-MM-DD
        time: record.date.toTimeString().split(" ")[0], // Extract HH:MM:SS
        studentId: record.studentId._id,
        Name: record.studentId.Name,
      }));
  
      res.status(200).json({
        success: true,
        data: formattedData,
        message: "Attendance retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
exports.viewStudAttendance = async(req,res)=>{
    try{
        const masterEmail = req.user.email;  
        const {studId} = req.body

        if (!studId) {
            return res.status(400).json({ message: ' Student ID is required' });
          }
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }

        const attendance = await Attendance.find({dojoId:masterData.assignedDojoId,studentId:studId}).populate("studentId","Name")
        
        if (attendance.length === 0) {
            return res.status(404).json({ message: 'No data found.' });
        }

        const formattedData = attendance.map(record => ({
            _id: record._id,
            dojoId: record.dojoId,
            date: record.date.toISOString().split('T')[0], 
            time: record.date.toTimeString().split(' ')[0],
            // date: record.date,
            studentId: record.studentId._id,  // Extract student's ID
            Name: record.studentId.Name       // Extract student's Name
          }));
        res.status(200).json({
            success: true,
            data: formattedData,
            message: 'Attendance retrieved successfully.'
        });

    }catch(error){
        res.status(500).json({ message: error.message});
    }
}