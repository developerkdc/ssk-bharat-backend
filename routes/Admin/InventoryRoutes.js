import  express  from "express";
import { UserLogs } from "../../controllers/Admin/userController";
import { AddStock } from "../../controllers/Admin/inventoryController";



const router = express.Router();

router.get("/addstock", AddStock);


export default router;
