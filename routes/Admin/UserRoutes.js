import express from "express";
import { LoginUser } from "../../controllers/Admin/userController";
const router = express.Router();


router.get('/login',LoginUser);

export default router;