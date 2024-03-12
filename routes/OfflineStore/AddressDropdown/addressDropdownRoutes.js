import express from "express";
import {
  createAddressDropdown,
  getAddressDropdown,
  updateAddressDropdown,
} from "../../../controllers/Admin/AddressDropdown/addressDropdownController";
import offlineStoreAuthMiddleware from "../../../middlewares/offlineStoreAuth";

const router = express.Router();

router.post("/create/:type", offlineStoreAuthMiddleware, createAddressDropdown);
router.get("/get/:type", offlineStoreAuthMiddleware, getAddressDropdown);
router.patch("/update/:type/:id", offlineStoreAuthMiddleware, updateAddressDropdown);

export default router;
