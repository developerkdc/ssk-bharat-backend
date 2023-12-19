import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressGroupRoutes from 'express-group-routes';
import connect from "./database/mongo.service.js";
import usersRouter from "./routes/Admin/UserRoutes.js";
import rolesRouter from "./routes/Admin/RolesRoutes.js";
import ApiError from "./Utils/ApiError.js";
import { globalErrorHandler } from "./Utils/GlobalErrorHandler.js";
import fs from "fs";
const app = express();

const port = process.env.PORT || 4001

//Middlewares
app.use(express.json());




connect()
// Routes for Admin Portal
app.group("/api/v1/admin", (router) => {
   router.use('/users', usersRouter);
   router.use('/roles', rolesRouter);
});

app.all("*",(req,res,next)=>{
    next(new ApiError("Routes Not Found",404));
})

app.use(globalErrorHandler);

app.listen(port,()=>{
    console.log(`listning on Port ${port}`)
})