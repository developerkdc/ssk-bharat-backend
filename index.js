import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressGroupRoutes from "express-group-routes";
import connect from "./database/mongo.service.js";
import usersRouter from "./routes/Admin/UserRoutes.js";
import rolesRouter from "./routes/Admin/RolesRoutes.js";
import categoryRouter from "./routes/Admin/categoryRoutes.js";
import unitRouter from "./routes/Admin/unitsRoutes.js";
import gstRouter from "./routes/Admin/gstRoutes.js";
import tdsRouter from "./routes/Admin/tdsRoutes.js";
import hsnRouter from "./routes/Admin/hsnRoutes.js";
import productRouter from "./routes/Admin/productRoutes.js";
import authRouter from "./routes/Admin/authRoutes.js";
import ApiError from "./Utils/ApiError.js";
import { globalErrorHandler } from "./Utils/GlobalErrorHandler.js";
import SupplierRouter from "./routes/Admin/Supplier.routes.js";
import marketExecutiveRouter from "./routes/Admin/marketExecutive.routes.js";
import sskCompanyRouter from "./routes/Admin/SSkCompany.routes.js";
import sskPoRouter from "./routes/Admin/sskPurchaseOrderRoutes.js";
import ordersRouter from "./routes/Admin/ordersRoute.js";
import storeRouter from "./routes/Admin/OfflineStore.routes.js";
import salesRouter from "./routes/Admin/salesRoutes.js";
import refundRoute from "./routes/Admin/refundRoutes.js";
import dispatchRoute from "./routes/Admin/dispatchRoutes.js";
import offlineStoreRouter from "./routes/Admin/OfflineStore.routes.js";
import retailerRouter from "./routes/Admin/Retailer.routes.js";
import marketExecutiveCommissionRouter from "./routes/Admin/marketExectiveCommission.route.js";
import payoutAndCommissionRouter from "./routes/Admin/payoutAndCommission.route.js";
import paymentTermDays from "./routes/Admin/paymentTermDaysRoutes.js";
const app = express();

const port = process.env.PORT || 4001;

//Middlewares
app.use(express.static(__dirname));
app.use(express.json());

connect();
// Routes for Admin Portal
app.group("/api/v1/admin", (router) => {
  router.use("/auth", authRouter);
  router.use("/users", usersRouter);
  router.use("/roles", rolesRouter);
  router.use("/suppliers", SupplierRouter);
  router.use("/sskcompany", sskCompanyRouter);
  router.use("/offlineStore", offlineStoreRouter);
  router.use("/retailer", retailerRouter);
  router.use("/category", categoryRouter);
  router.use("/unit", unitRouter);
  router.use("/gst", gstRouter);
  router.use("/hsn", hsnRouter);
  router.use("/product", productRouter);
  router.use("/market-executive", marketExecutiveRouter);
  router.use("/ssk/po", sskPoRouter);
  router.use("/orders", ordersRouter);
  router.use("/store", storeRouter);
  router.use("/sales", salesRouter);
  router.use("/refund", refundRoute);
  router.use("/dispatch", dispatchRoute);
  router.use("/MECommission", marketExecutiveCommissionRouter);
  router.use("/payoutAndCommission", payoutAndCommissionRouter);
  router.use("/tds", tdsRouter);
  router.use("/termDays", paymentTermDays);
});

app.all("*", (req, res, next) => {
  next(new ApiError("Routes Not Found", 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`listning on Port ${port}`);
});
