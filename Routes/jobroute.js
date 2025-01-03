import express from"express";
import { deleteJobController, getAdminJobs, getAllJobs, getJobById, postJob } from "../Controllers/jobcontoller.js";
import isAuthenticate from "../Middleware/isAuthenticate.js";



const router =express.Router();

router.route('/postjob').post(isAuthenticate,postJob);
router.route('/getallpostjob').get(isAuthenticate,getAllJobs);
router.route('/getadminjob').get(isAuthenticate,getAdminJobs);
router.route('/getuserjob/:id').get(isAuthenticate,getJobById);
router.route('/jobdelete/:id').delete(deleteJobController)






export default router;