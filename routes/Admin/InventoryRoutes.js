import  express  from "express";
import { UserLogs } from "../../controllers/Admin/userController";
import { AddSampleInward, AddStock, EditInventory, InventoryList } from "../../controllers/Admin/inventoryController";



const router = express.Router();

router.post("/addstock", AddStock);
router.patch("/:id", EditInventory);
router.post("/sampleInward", AddSampleInward);
router.get("/list", InventoryList);

export default router;
 