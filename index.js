import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressGroupRoutes from "express-group-routes";
import connect from "./database/mongo.service.js";
import usersRouter from "./routes/Admin/Users/UserRoutes.js";
import rolesRouter from "./routes/Admin/Master/Roles/RolesRoutes.js";
import categoryRouter from "./routes/Admin/Master/Category/categoryRoutes.js";
import unitRouter from "./routes/Admin/Master/Units/unitsRoutes.js";
import gstRouter from "./routes/Admin/Master/GST/gstRoutes.js";
import tdsRouter from "./routes/Admin/Master/TDS/tdsRoutes.js";
import hsnRouter from "./routes/Admin/Master/HSN/hsnRoutes.js";
import productRouter from "./routes/Admin/Master/Products/productRoutes.js";
import authRouter from "./routes/Admin/Auth/authRoutes.js";
import ApiError from "./Utils/ApiError.js";
import { globalErrorHandler } from "./Utils/GlobalErrorHandler.js";
import SupplierRouter from "./routes/Admin/Master/Suppliers/Supplier.routes.js";
import marketExecutiveRouter from "./routes/Admin/MET/marketExecutive.routes.js";
import sskCompanyRouter from "./routes/Admin/Master/SSK/SSkCompany.routes.js";
import sskPoRouter from "./routes/Admin/SSKPO/sskPurchaseOrderRoutes.js";
import ordersRouter from "./routes/Admin/Orders/ordersRoute.js";
import storeRouter from "./routes/Admin/OfflineStore/OfflineStore.routes.js";
import salesRouter from "./routes/Admin/SalesOrders/salesRoutes.js";
import refundRoute from "./routes/Admin/SalesOrders/refundRoutes.js";
import dispatchRoute from "./routes/Admin/Dispatch/dispatchRoutes.js";
import offlineStoreRouter from "./routes/Admin/OfflineStore/OfflineStore.routes.js";
import retailerRouter from "./routes/Admin/Master/Retailers/Retailer.routes.js";
import marketExecutiveCommissionRouter from "./routes/Admin/MET/marketExectiveCommission.route.js";
import payoutAndCommissionRouter from "./routes/Admin/PayoutAndCommission/payoutAndCommission.route.js";
import paymentTermDays from "./routes/Admin/Master/PaymentTerms/paymentTermDaysRoutes.js";
import offlinePaymentRouter from "./routes/Admin/OfflinePayment/offlinePayment.route.js";
import InventoryRouter from "./routes/Admin/Inventory/InventoryRoutes.js";
import SampleRouter from "./routes/Admin/Samples/sampleRoutes.js";
import FaqRouter from "./routes/Admin/FAQs/faqRoutes.js";
import TicketRouter from "./routes/Admin/Tickets/ticketRoutes.js";
import metAuthRouter from "./routes/METAuthRoutes/metAuthRoutes.js";
import approvalRouter from "./routes/Approval/getPendingApprovalList.route.js"
import retailerPortalRouter from "./routes/Retailer/retailerPortalRoute.js"
import offlinePortalRouter from "./routes/OfflineStore/offlinePortalRoute.js"


import RetailerPRoutes from "./routes/Retailer/retailerRoutes.js";
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
  router.use("/offlinePayment", offlinePaymentRouter);
  router.use('/ssk/inventory', InventoryRouter);
  router.use('/sample', SampleRouter);
  router.use('/approval',approvalRouter);
  router.use('/faq',FaqRouter);
  router.use('/met',metAuthRouter);
  router.use('/ticket',TicketRouter);
  router.use('/retailer-portal',retailerPortalRouter);
  router.use('/offlinestore-portal',offlinePortalRouter);
  router.use("/retailerp", RetailerPRoutes);
});

app.all("*", (req, res, next) => {
  next(new ApiError("Routes Not Found", 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`listning on Port ${port}`);
});
