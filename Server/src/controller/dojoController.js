const Dojo = require('../model/Dojo')

exports.createDojo = async(req,res)=>{
    try{
        const role = req.user.role
        console.log(role);
        if(role == "Admin"){
        const adminId = req.user._id
        const {name, address: { place, city, state, pincode },
        contact: { phone, email }}=req.body
        if (!name || !place || !city || !state || !pincode || !phone || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. It must be exactly 10 digits." });
        }
    
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        const dojo = new Dojo({
            name,
            address: {
                place,
                city,
                state,
                pincode
            },
            contact: {
                phone,
                email
            }, createdBy: adminId
            
        });
        await dojo.save()
        
        res.status(201).json({
            success: true,
            data: dojo,
            message: 'Dojo created successfully'
        });
    }
    else{
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }
    } catch(error) {
        res.status(500).json({message: error.message})
    }
} 

exports.viewDojo = async(req,res)=>{
    try{
        const role = req.user.role
        if(role == "Admin"){
        const adminId = req.user._id
        const dojos = await Dojo.find({createdBy : adminId, active:true});
        if (dojos.length === 0) {
            return res.status(404).json({ message: 'No dojos found for this admin.' });
        }
        res.status(200).json({
            success: true,
            data: dojos,
            message: 'Dojos retrieved successfully.'
        });
    }
    else{
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }
    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.assignDojo = async(req,res)=>{
    try{
        const role = req.user.role
        if(role == "Admin"){
        const adminId = req.user._id
        const dojos = await Dojo.find({createdBy :adminId, active:true, assign:false}).select('_id address.place');;
        if (dojos.length === 0) {
            return res.status(404).json({ message: 'All dojos assgined.' });
        }
        res.status(200).json({
            success: true,
            data: dojos,
            message: 'Dojos retrieved successfully.'
        });
    }
    else{
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }
    }catch(error) {
        res.status(500).json({message: error.message})
    }
}


exports.viewDojoById = async (req, res) => {
    try {
        const role = req.user.role;
        const adminId = req.user._id;  
        const dojoId = req.params.id;  

        // if (role !== "Admin") {
        //     return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
        // }
        const dojo = await Dojo.findOne({ _id: dojoId, createdBy: adminId, active:true});
        if (!dojo) {
            return res.status(404).json({ message: 'Dojo not found' });
        }

        res.status(200).json({
            success: true,
            data: dojo,
            message: 'Dojo retrieved successfully.'
        });

    } catch (error) {
        
        res.status(500).json({ message: error.message});
    }
};

exports.updateDojo = async(req,res)=>{
    try{
    const role= req.user.role
    const adminId = req.user._id
    const dojoId = req.params.id;  
    const { phone, place, email } = req.body; 

    if (role !== "Admin") {
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }
    // if (!phone && !place && !email) {
    //     return res.status(400).json({ message: "At least one field (phone, place, or email) is required for update." });
    // }
    if (phone && !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number. It must be exactly 10 digits." });
    }

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const dojo = await Dojo.findOne({ _id: dojoId, createdBy: adminId, active:true});
    if (!dojo) {
        return res.status(404).json({ message: 'Dojo not found' });
    }

    const updatedDojo = await Dojo.findByIdAndUpdate(
        dojoId,
        {
            $set: {
                'contact.phone': phone || dojo.phone,
                'contact.email': email || dojo.email,
                'address.place': place || dojo.place
            }
        },
        { new: true, runValidators: true } 
    );
    res.status(200).json({
        message: "Dojo details updated successfully.",
        dojo: updatedDojo
    });

}catch (error) {
    res.status(500).json({ message: error.message});
}
}

exports.deleteDojo = async(req,res)=>{
    try{
    const role= req.user.role
    const adminId = req.user._id
    const dojoId = req.params.id;  

    if (role !== "Admin") {
        return res.status(403).json({ message: 'Only admins have access to view dojo details.' });
    }

    const dojo = await Dojo.findOne({ _id: dojoId, createdBy: adminId, active:true});
    if (!dojo) {
        return res.status(404).json({ message: 'Dojo not found' });
    }

    const updatedDojo = await Dojo.findByIdAndUpdate(
        dojoId,
        {
            $set: {
                active:false
            }
        },
        { new: true, runValidators: true } 
    );
    res.status(200).json({
        message: "Dojo deleted.",
        dojo: updatedDojo
    });

}catch (error) {
    res.status(500).json({ message: error.message});
}
}
