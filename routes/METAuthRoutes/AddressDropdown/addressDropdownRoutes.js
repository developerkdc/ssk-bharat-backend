import express from "express";
import {
  createAddressDropdown,
  getAddressDropdown,
  updateAddressDropdown,
} from "../../../controllers/Admin/AddressDropdown/addressDropdownController";
import METauthMiddleware from "../../../middlewares/metAuth";

const router = express.Router();

router.post("/create/:type", METauthMiddleware, createAddressDropdown);
router.get("/get/:type", METauthMiddleware, getAddressDropdown);
router.patch("/update/:type/:id", METauthMiddleware, updateAddressDropdown);

export default router;
