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
import { URL } from "url";

const app = express();
dotenv.config({});
const __dirname = new URL('.', import.meta.url).pathname;

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

// View engine setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// API routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', CompanyRoute);
app.use('/api/v1/job', JobRoute);
app.use('/api/v1/application', ApplicationRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
