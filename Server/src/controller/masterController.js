const Master = require('../model/master')
const Dojo = require('../model/Dojo')
const User = require('../model/user')
const upload = require("../config/multerConfig");


exports.createMaster = async (req,res)=>{
    try{
        const role = req.user.role;
        const adminId = req.user._id;  
        if (role !== "Admin") {
            return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        }

        upload.single("storeImage")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
        const {name,email,number,belt:{color,degree},assignedDojoId}=req.body
        
        if (!name || !email || !assignedDojoId  || !number ) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingMaster = await Master.findOne({ email, active:true });
            if (existingMaster) {
                return res.status(400).json({ message: 'Master already exists' });
            }
        const dojo = await Dojo.findOne({ _id:assignedDojoId, createdBy: adminId, active:true , assign:false});
        if (!dojo) {
            return res.status(404).json({ message: 'Dojo not found' });
        }
        // const dojoAssigned = await Master.findOne({assignedDojoId:assignedDojoId});
        // if (dojoAssigned){
        //     return res.status(404).json({ message: `${dojo.name} ${dojo.address.place} Dojo already assigned to ${dojoAssigned.name}. Assign other Dojo ` });
        // }

        const imageUrl = req.file ? req.file.path : undefined; 

        const master = new Master({
            name,
            email,
            number,
            belt: {
                color,
                degree,
            },
            image :imageUrl,
            assignedDojoId,
            createdBy: adminId
            
        });

        dojo.assign = true

        try {
            await master.save();  // Validation should occur here
            await dojo.save()
        } catch (error) {
            return res.status(500).json({message: error.message})
        }


        // await master.save()
        res.status(201).json({
            success: true,
            data: master,
            message: 'Master created successfully'
        });
    });
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.viewMaster = async(req,res)=>{
    try{
        const role = req.user.role;
        const adminId = req.user._id;  
        if (role !== "Admin") {
            return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        }
        const masters = await Master.find({createdBy: adminId,active:true})
        if (masters.length === 0){
            return res.status(404).json({message: 'No data found for this admin.' });
        }


        res.status(200).json({
            success: true,
            data: masters,
            message: 'Master retrieved successfully'
        });

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.viewMasterById = async(req,res)=>{
    try{
        const role = req.user.role;
        const adminId = req.user._id; 
        const Id =req.params.id
        if (role !== "Admin") {
            return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        }
        const master = await Master.findOne({ _id: Id,createdBy: adminId,active:true}).populate('assignedDojoId', 'name address.place')
        if (!master){
            return res.status(404).json({message: 'No master found.' });
        }
        const dojo = await Dojo.findOne({ _id: master.assignedDojoId, createdBy: adminId, active: true });

        if (!dojo) {
            return res.status(404).json({ message: 'Assigned dojo not found.' });
        }

        res.status(200).json({
            success: true,
            data: master,
            message: 'Master retrieved successfully'
        });

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// exports.viewMaster = async(req,res)=>{
//     try{
//         const role = req.user.role;
//         const adminId = req.user._id;  
//         if (role !== "Admin") {
//             return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
//         }
//         const masters = await Master.find({createdBy: adminId,active:true})
//         if (masters.length === 0){
//             return res.status(404).json({message: 'No data found for this admin.' });
//         }
//         res.status(200).json({
//             success: true,
//             data: masters,
//             message: 'Master retrieved successfully'
//         });

//     }catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


// exports.viewMasterById = async(req,res)=>{
//     try{
//         const role = req.user.role;
//         const adminId = req.user._id; 
//         const Id =req.params.id
//         if (role !== "Admin") {
//             return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
//         }
//         const master = await Master.findOne({ _id: Id,createdBy: adminId,active:true})
//         if (!master){
//             return res.status(404).json({message: 'No master found.' });
//         }
//         res.status(200).json({
//             success: true,
//             data: master,
//             message: 'Master retrieved successfully'
//         });

//     }catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


exports.updateMaster= async(req,res)=>{
    try{
        const role = req.user.role;
        const adminId = req.user._id; 
        const Id =req.params.id
        const {number,belt} = req.body
        if (role !== "Admin") {
            return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        }
        const master = await Master.findOne({ _id: Id,createdBy: adminId,active:true})
        if (!master){
            return res.status(404).json({message: 'No master found.' });
        }
        const updateFields = {};

        if (number) updateFields.number = number;
        if (belt) {
            if (belt.color) updateFields['belt.color'] = belt.color;
            if (belt.degree) updateFields['belt.degree'] = belt.degree;
        }

        const updatedMaster = await Master.findByIdAndUpdate(
            Id,
            { $set: updateFields },  
            { new: true, runValidators: true }  // Return updated document and run schema validators
            // new: true : updatedMaster will contain the UPDATED data
            //runValidators:true : Throws a validation error: "Phone number must be 10 digits"
        );
        res.status(201).json({
            success: true,
            data: updatedMaster,
            message: 'Master updated successfully'
        });


    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteMaster = async(req,res)=>{
    try{
        const role = req.user.role;
        const adminId = req.user._id; 
        const Id =req.params.id
        if (role !== "Admin") {
            return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        }
        const master = await Master.findOne({ _id: Id,createdBy: adminId,active:true})
        if (!master){
            return res.status(404).json({message: 'No master found.' });
        }
        // const user = await User.findOne({email:master.email})
        // if(user){
        //     user.active=false
        //     await user.save()
        // }
        const user = await User.findOneAndDelete({ email: master.email }); // if master sofydelete delete the data of that master register at user collection 

        master.active = false;
        await master.save();
        res.status(201).json({
            success: true,
            data: master,
            message: 'Master deleted successfully'
        });

    }catch (error) {
        res.status(500).json({ error: error.message });
    }

}