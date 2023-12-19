import express from "express";
import { AddUser, LoginUser } from "../../controllers/Admin/userController";
const router = express.Router();


router.get('/login',LoginUser);
router.post("/adduser", AddUser);

export default router;