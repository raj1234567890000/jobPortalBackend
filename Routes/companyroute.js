import express from"express";
import { deleteCompanyController, getCompany, getCompanyId, registerCompany, updateCompany } from "../Controllers/companycontroller.js";
import isAuthenticate from "../Middleware/isAuthenticate.js";
import { singleUpload } from "../Middleware/multer.js";



const router =express.Router();

router.route('/registercompany').post(isAuthenticate,registerCompany)
router.route('/getcomapny').get(isAuthenticate,getCompany)
router.route("/getcompanybyid/:id").get(isAuthenticate,getCompanyId)
router.route('/upadtecompanybyid/:id').put(isAuthenticate,singleUpload,updateCompany)
router.route('/companydelete/:id').delete(deleteCompanyController)

export default router;