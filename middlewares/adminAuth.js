// const users = require('../database/schema/admin_users.schema');
// const ResponseMsg = require('../lables/response');
// const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");
// var PermissionSchema = require("../database/schema/permission.schema");
// var RolePermissionSchema = require("../database/schema/role_permissions.schema");
// let Permission = mongoose.model("PermissionModel");
// let RolePermission = mongoose.model("RolePermissionModel");
// var RoleSchema = require("../database/schema/roles.schema");

// let Role = mongoose.model("RoleModel");

export default async (req, res, next) => {
    try {
        // const token = req.headers.authorization;
        // if (!token) {
        //     return res.status(400).json({ data: null, response_msg: ResponseMsg.TokenNotPassed });
        // }
        // const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // if (!verifyUser) {
        //     return res.status(400).json({ data: null, response_msg: err });
        // }
        // const user = await users.findOne({ _id: verifyUser._id });

        // if (!user) {
        //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
        // }
        // var role = await Role.findOne({ _id: user.role_id, deleted_at: null });

        // if (role.role_slug != 'super-admin' && user.status != '1') {
        //     return res.status(400).json({ data: null, response_msg: ResponseMsg.AccountSusppend.replace('inactive', user.status == 2 ? 'Suspended' : 'Inactive') });
        // }
        // req.user = user;

        // var role = await Role.findOne({ _id: user.role_id });

        // if (!role) {
        //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
        // }
        // if (role.role_slug == 'super-admin') {
        //     return next();
        // }

        // let url = req.originalUrl.split('?')[0];
        // let uri = url.split('/');
        // let permission_name = uri.slice(-2)[0] + '-' + uri.slice(-1)[0];
        // let permission = await Permission.findOne({ name: permission_name });
        // if (!permission) {
        //     return next();
        // }
        // var role_permission = await RolePermission.findOne({ role_id: user.role_id, permission_id: permission._id });

        // if (!role_permission) {
        //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
        // }
        return next();
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ data: null, response_msg: err.message, is_logout: 1 });
    }
}