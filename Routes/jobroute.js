import express from"express";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../Controllers/jobcontoller.js";
//import isAuthenticate from "../Middleware/isAuthenticate.js";



const router =express.Router();

router.route('/postjob').post(postJob);
router.route('/getallpostjob').get(getAllJobs);
router.route('/getadminjob').get(getAdminJobs);
router.route('/getuserjob/:id').get(getJobById);






export default router;