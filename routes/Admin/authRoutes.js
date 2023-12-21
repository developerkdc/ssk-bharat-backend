import express from "express";
import { LoginUser } from "../../controllers/Admin/authController";


const router = express.Router();

router.post("/login", LoginUser);

export default router;