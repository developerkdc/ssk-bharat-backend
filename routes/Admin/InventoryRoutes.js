import  express  from "express";
import { UserLogs } from "../../controllers/Admin/userController";
import { AddSampleInward, AddStock, EditInventory, InventoryList, ViewProductHistory } from "../../controllers/Admin/inventoryController";



const router = express.Router();

router.post("/addstock", AddStock);
router.post("/sampleInward", AddSampleInward);
router.get("/list", InventoryList);
router.post("/view/:id", ViewProductHistory);
router.patch("/:id", EditInventory);

export default router;
 