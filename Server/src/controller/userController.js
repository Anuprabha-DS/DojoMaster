const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user')


exports.createAdmin = async (req, res) => {
    try {
            const {email, password} = req.body
            if(!email||!password){
                return res.status(400).json({error:"required all field"})
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const user = new User({
                email,
                password: hashedPassword,
                role: 'Admin',
                mustChangePassword: true
            })
            await user.save()

            const token = jwt.sign(
                {id: user._id, email: user.email, role: user.role},
                process.env.JWT_SECRET
            )
            res.cookie('token', token, {httpOnly: true})
            res.json({
                message: "Admin created successfully",
                token,
            })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}


// const Dojo = require('../model/Dojo')
// const multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/store-images/') // Make sure this directory exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB limit
//     },
//     fileFilter: function (req, file, cb) {
//         const filetypes = /jpeg|jpg|png|webp/
//         const mimetype = filetypes.test(file.mimetype)
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        
//         if (mimetype && extname) {
//             return cb(null, true)
//         }
//         cb(new Error('Only image files are allowed!'))
//     }
// }).single('storeImage')

// // exports.createAdmin = async (req,res)=>{
// //     try{
// //         upload(req, res, async function(err) {
// //             if (err instanceof multer.MulterError) {
// //                 return res.status(400).json({ message: 'File upload error: ' + err.message })
// //             } else if (err) {
// //                 return res.status(400).json({ message: err.message })
// //             }

// //         const {name,username,email,password,phoneNumber,role}= req.body
// //         console.log(name,username);

// //         const hashedPassword = await bcrypt.hash(password,10)
// //         const master = new Master({
// //             name,
// //             username,
// //             email,
// //             password: hashedPassword,
// //             phoneNumber,
// //             role,
// //             storeImage: req.file ? `/uploads/store-images/${req.file.filename}` : undefined
// //         })
// //         await master.save()

// //         const token = jwt.sign(
// //             {id:master._id,username:master.username,role:master.role},process.env.SECRET_KEY
// //         )
// //         res.cookie('token',token,{httpOnly:true})
// //         res.json({message:"Master created successfully ",token})

// //     }catch(error){
// //         res.status(500).json({message: error.message})
// //     }
// // }




// exports.getMasterById = async (req, res) => {
//     try {
//         const master = await Master.findById(req.params.id).select('-password')
//         if (!master) {
//             return res.status(404).json({ message: 'Master not found' })
//         }
//         res.json(master)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }


// // exports.createDojo = async(req,res)=>{
// //     try{
// //         console.log("Hello this is Dojo");
        
// //     } catch (error) {
// //         res.status(500).json({ message: error.message })
// //     }
// // }

// exports.login = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await Master.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid username or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid username or password' });
//         }

//         if (user.isDeleted) {
//             return res.status(403).json({ message: 'Account is deactivated' });
//         }
//         const token = jwt.sign(
//             {id:user._id,username:user.username,role:user.role},process.env.SECRET_KEY,{ expiresIn: '1d' }
//         )
//         res.cookie('token',token,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

//         // Create JWT token
//         // const token = jwt.sign(
//         //     { id: user._id, role: user.role },
//         //     SECRET_KEY,
//         //     { expiresIn: '1d' }  // Token expires in 1 day
//         // );

//         // // Store the token in cookies
//         // res.cookie('token', token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//         //     maxAge: 24 * 60 * 60 * 1000  // 1 day
//         // });

//         res.status(200).json({ message: 'Login successful', role: user.role });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// }

// // Example Protected Route for Admin
// app.get('/admin', require('./middleware').auth, require('./middleware').adminOnly, (req, res) => {
//     res.status(200).json({ message: 'Welcome Admin!' });
// });

// // Example Protected Route for Both Admin and Master
// app.get('/dashboard', require('./middleware').auth, (req, res) => {
//     res.status(200).json({ message: `Welcome ${req.user.role}!` });
// });