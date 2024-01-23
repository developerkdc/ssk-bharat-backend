import express from "express";
import {
  createAddressDropdown,
  getAddressDropdown,
  updateAddressDropdown,
} from "../../../controllers/Admin/AddressDropdown/addressDropdownController";
import authMiddleware from "../../../middlewares/adminAuth";

const router = express.Router();

router.post("/create/:type", authMiddleware, createAddressDropdown);
router.get("/get/:type", authMiddleware, getAddressDropdown);
router.patch("/update/:type/:id", authMiddleware, updateAddressDropdown);

export default router;
