import express from "express";
import { METMyStore } from "../../../controllers/MET/MyStore/MyStore.Controller";
import METauthMiddleware from "../../../middlewares/metAuth";
const metStoreRouter = express.Router();

metStoreRouter.post("/",METauthMiddleware,METMyStore)


export default metStoreRouter;