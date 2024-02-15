import express from "express";
import { getAddressDropdown } from "../../../controllers/Admin/AddressDropdown/addressDropdownController";

const router = express.Router();
router.get("/get/:type", getAddressDropdown);

export default router;
