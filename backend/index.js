const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
// const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler= require("./Middleware/error.js");
const connectCloudinary = require("./Config/cloudinary.js");
const notesRouter = require("./Staff/Routers/notesRouter");
const auth=require("./Admin/Routers/auth.js");
const admins= require("./Admin/Routers/admin.js");
dotenv.config();
const app = express();
// Logging middleware
app.use(cookieParser()); // Cookie parsing middleware
const port = process.env.PORT || 4000;
app.use(errorHandler)



app.use(cors({
  origin: 'https://educatesync.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // Fixed the typo (comma -> period)
}
app.use("/admin/students", require("./Admin/Routers/Students"));
app.use("/admin/staff", require("./Admin/Routers/Staff"));
app.use("/admin/events", require("./Admin/Routers/Events"));
app.use("/admin/timetable", require("./Admin/Routers/Cs")); 
app.use("/admin/attendance",require("./Admin/Routers/Attendence")); 
app.use("/admin/gallery",require("./Admin/Routers/Gallery.js"))
app.use("/admin/classTeacher",require("./Admin/Routers/classTeacher.js"))



// app.use("/staff/attendance", require("./Staff/Routers/Attendance"));

app.use("/staff/notes",notesRouter);
app.use("/staff/assignments", require("./Staff/Routers/asssignmentRouter.js"));
app.use("/staff/feedback",require("./Staff/Routers/feedback.js"))
app.use("/staff/class",require("./Staff/Routers/classes.js"))

// student routes
app.use("/student/assignment", require("./Students/Routers/studentsAssignmentsSubmitions.js")); 




//admin register
// app.use("/admin/auth", require("./Admin/Routers/Register.js"));
app.use("/admin/auth", auth);
app.use("/admin/register", admins);


// MongoDB Connection
mongoose.connect(process.env.MONGOURI)
.then(() => 
   {
    console.log("MongoDB connected")
    app.listen(port, () => {
    
        console.log(`Server running at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
    });
   
   })
.catch(err => console.error("MongoDB connection error:", err));




// Handle unhandled promise rejections

connectCloudinary()

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});