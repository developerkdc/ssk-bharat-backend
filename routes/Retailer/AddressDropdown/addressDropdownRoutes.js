import express from "express";
import {
  createAddressDropdown,
  getAddressDropdown,
  updateAddressDropdown,
} from "../../../controllers/Admin/AddressDropdown/addressDropdownController";
import retailersAuthMiddleware from "../../../middlewares/retailersAuthMiddleware";

const router = express.Router();

router.post("/create/:type", retailersAuthMiddleware, createAddressDropdown);
router.get("/get/:type", retailersAuthMiddleware, getAddressDropdown);
router.patch("/update/:type/:id", retailersAuthMiddleware, updateAddressDropdown);

export default router;
