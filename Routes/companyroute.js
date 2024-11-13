import express from"express";
import { getCompany, getCompanyId, registerCompany, updateCompany } from "../Controllers/companycontroller.js";
//import isAuthenticate from "../Middleware/isAuthenticate.js";
import { singleUpload } from "../Middleware/multer.js";



const router =express.Router();

router.route('/registercompany').post(registerCompany)
router.route('/getcomapny').get(getCompany)
router.route("/getcompanybyid/:id").get(getCompanyId)
router.route('/upadtecompanybyid/:id').put(singleUpload,updateCompany)

export default router;