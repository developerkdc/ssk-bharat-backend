import express from "express";
import METauthMiddleware from "../../../middlewares/metAuth";
import { metGetPayoutAndCommissionTrans } from "../../../controllers/MET/TransactionHistory/TransactionHistory.controller";
const metTransactionHistoryRouter = express.Router();

metTransactionHistoryRouter.post("/",METauthMiddleware,metGetPayoutAndCommissionTrans)


export default metTransactionHistoryRouter;