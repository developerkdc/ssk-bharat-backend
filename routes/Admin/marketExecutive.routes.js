import express from "express";
import { addMarketExec } from "../../controllers/Admin/MarketExecutive/MarketExecutive.controller";
const marketExecutiveRouter = express.Router();

marketExecutiveRouter.route('/')
    .post(addMarketExec)


    
export default marketExecutiveRouter