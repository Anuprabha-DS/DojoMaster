const express = require('express')
// const cookieParser = require('cookie-parser')
// const DojoRoutes = require('./routes/userRoutes')
// const connectDB = require('./config/db')
const DojoRoutes = require('./src/routes/userRoutes')
const connectDB = require('./src/config/db')
const cors = require('cors')
require('dotenv').config()

// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes')
// const masterRoutes = require('./routes/masterRoutes')

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes')
const masterRoutes = require('./src/routes/masterRoutes')

const app = express()

app.use(
    cors({
        origin: "https://testfrontend-chi.vercel.app/", // Allow only frontend origin
        credentials: true, // Allow cookies and credentials
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
);
// app.use(cors())
app.use(express.json())
// app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
connectDB()

app.use('/',DojoRoutes)
app.use(`/auth`, authRoutes);
app.use('/admin',adminRoutes)
app.use('/master',masterRoutes)

PORT = process.env.PORT

app.listen(PORT,()=>console.log(`Listening at ${PORT} `)
)