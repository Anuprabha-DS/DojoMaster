const Notification = require('../model/notification');
const Dojo = require("../model/Dojo")
const Master = require('../model/master')


exports.addNotification= async (req, res) => {
  try {
    const role = req.user.role;
    const adminId = req.user._id;  

    if (role !== "Admin") {
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }
    const {title,message,type,dojoId,forRoles} = req.body;
    if (!title || !message || !type || !forRoles || !Array.isArray(forRoles)) {
      return res.status(400).json({message: 'Please provide all required fields'});
    }
    if(dojoId){
    const dojo = await Dojo.findOne({ _id: dojoId, createdBy: adminId, active:true});
    if (!dojo) {
        return res.status(404).json({ message: 'Dojo not not actvie'});
    }}

    const notification = new Notification({
      title,
      message,
      type,
      dojoId: dojoId || null,  // If dojoId is not provided, it will be null (system-wide)
      createdBy: adminId, // Get admin ID from authenticated user
      forRoles
    });

    await notification.save();


    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    res.status(500).json({message: 'Error creating notification',error: error.message});
  }
}

    // const validRoles = ['Master', 'Parent'];
    // const areRolesValid = forRoles.every(role => validRoles.includes(role));
    // if (!areRolesValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid role provided'
    //   });
    // }
    
    // Populate createdBy and dojoId references
    // await notification.populate(['createdBy', 'dojoId']);

exports.viewNotification = async(req,res)=>{
  try{
    const masterEmail = req.user.email;  
    
        const masterData = await Master.findOne({ email: masterEmail, active: true });
        
        if (!masterData) {
            return res.status(404).json({ message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: masterData.assignedDojoId, active: true });
        
        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo does not exist or is inactive.' });
        }
    const notifications = await Notification.find({
      $or: [{ dojoId: null }, { dojoId: masterData.assignedDojoId }],
      forRoles: { $in: ["Master"] } // Check if "Master" is in forRoles array
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      data: notifications
    });
  }catch (error) {
    res.status(500).json({message: 'Error creating notification',error: error.message});
  }
}