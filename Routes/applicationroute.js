import express from"express";
//import isAuthenticate from "../Middleware/isAuthenticate.js";
import { applyJobs, getApplicants, getAppliedJobs, updateStatus } from "../Controllers/applicationcontroller.js";



const router =express.Router();

router.route('/apply/:id').get(applyJobs)
router.route('/getapplyjob').get(getAppliedJobs)
router.route('/:id/applicant').get(getApplicants)
router.route('/status/:id/update').post(updateStatus)



export default router;