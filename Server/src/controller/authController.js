
const User = require('../model/user')
const Master = require('../model/master');
const Student = require('../model/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Login for all users (Admin, Master, Parent)
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email,active:true });

            if (!user || !user.active) {
                return res.status(401).json({ error: 'Invalid login credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid login credentials' });
            }

            // Check if admin needs to change password
            if (user.role === 'Admin' && user.mustChangePassword) {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn: '3m' });
                // res.cookie('token', token, {httpOnly: true})
                return res.status(200).json({
                    message: 'Password change required',
                    requirePasswordChange: true,
                    token
                });
            }
            
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
            // res.cookie('token', token, {httpOnly: true})
            // If user is a Master, fetch additional master details
            let additionalData = {};
            if (user.role === 'Master') {
                const masterDetails = await Master.findOne({ email: user.email });
                additionalData = { masterDetails };
            }

            res.json({
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    ...additionalData
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Register Master
    // registerMaster: async (req, res) => {
    //     try {
    //         const { email, password } = req.body;
    //         // Check if email exists in User collection
    //         const existingUser = await User.findOne({ email, active:true });
    //         if (existingUser) {
    //             return res.status(400).json({ error: 'Email already registered in users' });
    //         }

    //         // Check if email exists in Master collection
    //         const existingMaster = await Master.findOne({ email ,active:true});
    //         if (!existingMaster) {
    //             return res.status(400).json({ error: 'Not exist master' });
    //         }

    //         // Create user with Master role
    //         const hashedPassword = await bcrypt.hash(password, 8);
    //         const user = new User({
    //             email,
    //             password: hashedPassword,
    //             role: 'Master'
    //         });

    //         try {
    //             await user.save() 
    //         } catch (error) {
    //             return res.status(500).json({message: error.message})
    //         }
            
    //         await user.save();

    //         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //         res.status(201).json({ user, token ,masterId : existingMaster._id});
    //     } catch (error) {
    //         res.status(400).json({ error: error.message });
    //     }
    // },

    // // Register Parent
    // registerParent: async (req, res) => {
    //     try {
    //         const { email, password } = req.body;

    //         // Check if email exists in Student collection (parent's email)
    //         const existingStudent = await Student.findOne({ 'contact.email': email });
    //         if (!existingStudent) {
    //             return res.status(400).json({ 
    //                 error: 'Email not found in student records. Only parents of registered students can create an account.' 
    //             });
    //         }

    //         // Check if email exists in User collection
    //         const existingUser = await User.findOne({ email });
    //         if (existingUser) {
    //             return res.status(400).json({ error: 'Email already registered in users' });
    //         }

    //         // Create user with Parent role
    //         const hashedPassword = await bcrypt.hash(password, 8);
    //         const user = new User({
    //             email,
    //             password: hashedPassword,
    //             role: 'Parent'
    //         });
    //         await user.save();

    //         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //         res.status(201).json({ 
    //             user, 
    //             token,
    //             studentId: existingStudent._id // Returning student ID for reference
    //         });
    //     } catch (error) {
    //         res.status(400).json({ error: error.message });
    //     }
    // },


    register: async (req, res) => {
        try {
            const { email, password ,role} = req.body;

            if(!email||!password||!role){
                return res.status(400).json({ error: 'All field required' });
            }
            const existingUser = await User.findOne({ email, active:true });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already registered in users' });
                }
            if (role == "Master"){
                
                const existingMaster = await Master.findOne({ email ,active:true});
                if (!existingMaster) {
                    return res.status(400).json({ error: 'Not exist master' });
                }

                const hashedPassword = await bcrypt.hash(password, 8);
                const user = new User({
                    email,
                    password: hashedPassword,
                    role:role
                });

                    await user.save() 
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                res.status(201).json({ user, token ,masterId : existingMaster._id});
            }
            else if(role=="Parent"){
                const existingStudent = await Student.findOne({ 'contact.email': email });
                if (!existingStudent) {
                    return res.status(400).json({ 
                        error: 'Email not found in student records. Only parents of registered students can create an account.' 
                    });
                }
                const hashedPassword = await bcrypt.hash(password, 8);
                const user = new User({
                    email,
                    password: hashedPassword,
                    role: role
                });
                await user.save();

                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                res.status(201).json({ 
                    user, 
                    token,
                    studentId: existingStudent._id // Returning student ID for reference
                });

            }
            else{
                return res.status(400).json({ error: 'Not allowed' });
            }

     }catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

   
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user._id; // From auth middleware
            // const role = req.user.role

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify user role
            // if (role !== 'Admin' && role !== 'Master' !=='Parent') {
            //     return res.status(403).json({ error: 'Only Admin and Master users can change their password' });
            // }
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
            // Password validation (you can adjust these requirements)
            if (newPassword.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }

            // Hash and update new password
            const hashedPassword = await bcrypt.hash(newPassword, 8);
            user.password = hashedPassword;
            
            // If this is an admin's first login, update mustChangePassword flag
            if (user.role === 'Admin' && user.mustChangePassword) {
                user.mustChangePassword = false;
            }

            await user.save();

            // Generate new token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // res.cookie('token', token, { httpOnly: true });

            res.json({ 
                message: 'Password successfully updated',
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;