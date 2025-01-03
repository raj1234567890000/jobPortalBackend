import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from 'dotenv';
import connectDB from "./utils/db.js";
import userRoute from './Routes/UsersRoute.js';
import CompanyRoute from './Routes/companyroute.js';
import JobRoute from "./Routes/jobroute.js";
import ApplicationRoute from "./Routes/applicationroute.js";
import path from 'path';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const corsOptions = {
    origin: process.env.CLIENT_URL || "https://jobportalclient-3hoh.onrender.com",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set('view engine', 'ejs');
app.set("views", path.resolve("project/src/views")); 
app.use(express.static("public"));

// Routes
// Render the `index.ejs` file
app.get('/', (req, res) => {
    res.render('index', { status: "<%- JSON.stringify(status) %>",email:"<%= email %>" });
});

// All APIs here
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', CompanyRoute);
app.use('/a1/v1/job', JobRoute);
app.use('/a1/v1/application', ApplicationRoute);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
