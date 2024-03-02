import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
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
import addressDropdownRouter from "./routes/Admin/AddressDropdown/addressDropdownRoutes.js";
import METAuthRouter from "./routes/METAuthRoutes/Auth/metAuthRoutes";
import approvalRouter from "./routes/Approval/getPendingApprovalList.route.js";
import offlinePORouter from "./routes/OfflineStore/PurchaseOrder/offlinePORoute.js";
import offlineSalesRouter from "./routes/OfflineStore/ConfirmSalesOrder/offlineConfirmSalesRoute.js";
import retailerPORouter from "./routes/Retailer/PurchaseOrder/retailerPortalPORoute.js";
import retailerSalesRouter from "./routes/Retailer/ConfirmSalesOrder/retailerConfirmSalesRoutes.js";
import RetailerAuthRouter from "./routes/Retailer/Auth/Auth.route.js";
import offlineAuthRouter from "./routes/OfflineStore/Auth/Auth.route.js";
import RetailerPRoutes from "./routes/Retailer/Billing/BillingRoutes.js";
import RetailerInventory from "./routes/Retailer/Inventory/RetailerInventoryRoutes.js";
import offlineProductRouter from "./routes/OfflineStore/Products/productRoutes.js";
import retailerProductRouter from "./routes/Retailer/Products/productRoutes.js";
import retailerPortalRouter from "./routes/Retailer/Retailers/Retailer.routes.js";
import offlinePortalRouter from "./routes/OfflineStore/OfflineStore/OfflineStore.routes.js";
import offlineSSKRouter from "./routes/OfflineStore/SSK/SSkCompany.routes.js";
import retailerSSKRouter from "./routes/Retailer/SSK/SSkCompany.routes.js";
import offlineAddressRouter from "./routes/OfflineStore/AddressDropdown/addressDropdownRoutes.js";
import retailerAddressRouter from "./routes/Retailer/AddressDropdown/addressDropdownRoutes.js";
import metStoreRouter from "./routes/METAuthRoutes/Store/index.js";
import metTransactionHistoryRouter from "./routes/METAuthRoutes/Transaction/transaction.route.js";
import http from "http";
import { Server } from "socket.io";
import {
  AddActiveUser,
  RemoveActiveUser,
  isTokenExpired,
} from "./controllers/Admin/Users/userController.js";
const app = express();
const port = process.env.PORT || 4001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","https://sskbharat.kdcstaging.in"],
    methods: ["GET", "POST"],
  },
});

//Middlewares
app.use(express.static(__dirname));
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://sskbharat.kdcstaging.in",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    optionsSuccessStatus: 200,
  })
);

//database
connect();

//socket

io.on("connection", (socket) => {
  isTokenExpired();
  console.log("A new User Has connected", socket.id);
  socket.on("activeUser", (userID,token) => {
    try {
      AddActiveUser(userID, token, socket.id);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("logoutactiveUser", (userID) => {
    try {
      RemoveActiveUser(userID, socket.id);
    } catch (error) {
      console.log(error);
    }
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    // console.log("User disconnected", socket.id);
    try {
      RemoveActiveUser(null, socket.id);
    } catch (error) {
      console.log(error);
    }
    // You can perform additional cleanup or tasks here if needed
  });
});
// Routes for Admin Portal
app.group("/api/v1/admin", (router) => {
  router.use("/auth", authRouter);
  router.use("/users", usersRouter);
  router.use("/roles", rolesRouter);
  router.use("/supplier", SupplierRouter);
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
  router.use("/ssk/inventory", InventoryRouter);
  router.use("/sample", SampleRouter);
  router.use("/approval", approvalRouter);
  router.use("/faq", FaqRouter);
  router.use("/ticket", TicketRouter);
  router.use("/address/dropdown", addressDropdownRouter);
});

//MET
app.group("/api/v1/met-portal", (router) => {
  router.use("/auth", METAuthRouter);
  router.use("/metStore", metStoreRouter);
  router.use("/transactionHistory", metTransactionHistoryRouter);
});

//retailers
app.group("/api/v1/retailer-portal", (router) => {
  router.use("/auth", RetailerAuthRouter);
  router.use("/retailerp", RetailerPRoutes);
  router.use("/purchase-order", retailerPORouter);
  router.use("/confirm-sales", retailerSalesRouter);
  router.use("/inventory", RetailerInventory);
  router.use("/product", retailerProductRouter);
  router.use("/retailer", retailerPortalRouter);
  router.use("/sskcompany", retailerSSKRouter);
  router.use("/address/dropdown", retailerAddressRouter);
});

//offline store
app.group("/api/v1/offline-store-portal", (router) => {
  router.use("/auth", offlineAuthRouter);
  router.use("/purchase-order", offlinePORouter);
  router.use("/confirm-sales", offlineSalesRouter);
  router.use("/product", offlineProductRouter);
  router.use("/offlineStore", offlinePortalRouter);
  router.use("/sskcompany", offlineSSKRouter);
  router.use("/address/dropdown", offlineAddressRouter);
});

app.all("*", (req, res, next) => {
  next(new ApiError("Routes Not Found", 404));
});

app.use(globalErrorHandler);

server.listen(port, () => {
  console.log(`listning on Port ${port}`);
});
