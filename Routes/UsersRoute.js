import express from"express";
import { login, logout, register, updateProfile } from "../Controllers/usercontroller.js";
import isAuthenticate from "../Middleware/isAuthenticate.js";
import { singleUpload } from "../Middleware/multer.js";



const router =express.Router();

router.route('/register').post(singleUpload,register)
router.route('/login').post(login)
router.route("/logout").get(logout)
router.route('/profile/update').post(isAuthenticate,singleUpload,updateProfile)

export default router;