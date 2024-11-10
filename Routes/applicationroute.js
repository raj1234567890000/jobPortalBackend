import express from"express";
import isAuthenticate from "../Middleware/isAuthenticate.js";
import { applyJobs, getApplicants, getAppliedJobs, updateStatus } from "../Controllers/applicationcontroller.js";



const router =express.Router();

router.route('/apply/:id').get(isAuthenticate,applyJobs)
router.route('/getapplyjob').get(isAuthenticate,getAppliedJobs)
router.route('/:id/applicant').get(isAuthenticate,getApplicants)
router.route('/status/:id/update').post(isAuthenticate,updateStatus)



export default router;