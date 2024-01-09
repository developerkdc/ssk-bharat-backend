export const isAdminFunction = function (user) {
  return user.current_data.role_id.role_name === "Admin" ? true : false;
};
