import express from "express";
import { RetailerLogin } from "../../../controllers/Retailers/Auth/Auth.controller";
const RetailerAuthRouter = express.Router();

RetailerAuthRouter.post("/login",RetailerLogin)

export default RetailerAuthRouter;