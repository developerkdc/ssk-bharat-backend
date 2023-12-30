import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";

// export default async (req, res, next) => {
//     try {
//         // const token = req.headers.authorization;
//         // if (!token) {
//         //     return res.status(400).json({ data: null, response_msg: ResponseMsg.TokenNotPassed });
//         // }
//         // const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
//         // if (!verifyUser) {
//         //     return res.status(400).json({ data: null, response_msg: err });
//         // }
//         // const user = await users.findOne({ _id: verifyUser._id });

//         // if (!user) {
//         //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
//         // }
//         // var role = await Role.findOne({ _id: user.role_id, deleted_at: null });

//         // if (role.role_slug != 'super-admin' && user.status != '1') {
//         //     return res.status(400).json({ data: null, response_msg: ResponseMsg.AccountSusppend.replace('inactive', user.status == 2 ? 'Suspended' : 'Inactive') });
//         // }
//         // req.user = user;

//         // var role = await Role.findOne({ _id: user.role_id });

//         // if (!role) {
//         //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
//         // }
//         // if (role.role_slug == 'super-admin') {
//         //     return next();
//         // }

//         // let url = req.originalUrl.split('?')[0];
//         // let uri = url.split('/');
//         // let permission_name = uri.slice(-2)[0] + '-' + uri.slice(-1)[0];
//         // let permission = await Permission.findOne({ name: permission_name });
//         // if (!permission) {
//         //     return next();
//         // }
//         // var role_permission = await RolePermission.findOne({ role_id: user.role_id, permission_id: permission._id });

//         // if (!role_permission) {
//         //     return res.status(401).json({ data: null, response_msg: ResponseMsg.UnAuthorized });
//         // }
//         const { token } = req.headers.authorization;
//         console.log(token)
//         return next();
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json({ data: null, response_msg: err.message, is_logout: 1 });
//     }
// }

// const authMiddleware = (req, res, next) => {
//   const token =req.headers.authorization;
//   if (!token) {
//     return next(new ApiError("Token not provided",401))
//   }
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Unauthorized - Invalid token" });
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// };
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new ApiError("Token not provided", 401));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError("Unauthorized - Invalid token", 401));
    }
    
    req.userId = decoded.userId;
    next();
  });
};


export default authMiddleware;
