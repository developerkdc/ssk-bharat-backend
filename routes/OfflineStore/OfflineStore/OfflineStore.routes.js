import express from "express";
import { branch } from "../../Admin/OfflineStore/OfflineStore.routes";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const route = express.Router();

route.get("/branch/dropdown/list/:companyId",offlineStoreAuthMiddleware, branch.GetBranchList);

export default route;
