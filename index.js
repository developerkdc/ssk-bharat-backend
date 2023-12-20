import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressGroupRoutes from 'express-group-routes';
import connect from "./database/mongo.service.js";
import usersRouter from "./routes/Admin/UserRoutes.js";
import rolesRouter from "./routes/Admin/RolesRoutes.js";
import categoryRouter from "./routes/Admin/categoryRoutes.js"
import unitRouter from "./routes/Admin/unitsRoutes.js"
import gstRouter from "./routes/Admin/gstRoutes.js"
import hsnRouter from "./routes/Admin/hsnRoutes.js"
import productRouter from "./routes/Admin/productRoutes.js"
import ApiError from "./Utils/ApiError.js";
import { globalErrorHandler } from "./Utils/GlobalErrorHandler.js";
import fs from "fs";
const app = express();

const port = process.env.PORT || 4001

//Middlewares
app.use(express.static(__dirname))
app.use(express.json());




connect()
// Routes for Admin Portal
app.group("/api/v1/admin", (router) => {
   router.use('/users', usersRouter);
   router.use('/roles', rolesRouter);
   router.use('/category', categoryRouter);
   router.use('/unit', unitRouter);
   router.use('/gst', gstRouter);
   router.use('/hsn', hsnRouter);
   router.use('/product', productRouter);
});

app.all("*",(req,res,next)=>{
    next(new ApiError("Routes Not Found",404));
})

app.use(globalErrorHandler);

app.listen(port,()=>{
    console.log(`listning on Port ${port}`)
})