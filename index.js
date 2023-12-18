import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressGroupRoutes from 'express-group-routes';
import connect from "./database/mongo.service.js";
import usersRouter from "./routes/Admin/UserRoutes.js";
import rolesRouter from "./routes/Admin/RolesRoutes.js";
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


// Routes for Retail Store Portal
// app.route('/retail-store',UserRoutes)


// // Routes for Market Executive Portal
// app.route('/market-executive',UserRoutes)


// // Routes for SSK Offline Store Portal
// app.route('/offline-store',UserRoutes)


// // Routes for Website
// app.route('/website',UserRoutes)
  

app.listen(port,()=>{
    console.log(`listning on Port ${port}`)
})