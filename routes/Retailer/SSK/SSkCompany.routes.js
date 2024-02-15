import express from "express";
import { sskCompany } from "../../Admin/Master/SSK/SSkCompany.routes";

const route = express.Router();

route.get("/dropdown/list", sskCompany.GetCompanyList);
route.route("/:id").get(sskCompany.GetCompanyById);

export default route;
