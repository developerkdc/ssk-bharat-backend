export const approvalData = function (user, admin) {
  if (admin == "Admin")
    return  {created_by: {
        user_id: user.current_data._id,
        name: `${user.current_data.first_name} ${user.current_data.last_name}`,
        email_id: user.current_data.primary_email_id,
        employee_id: user.current_data.employee_id,
      }};
  const {
    _id,
    first_name,
    last_name,
    primary_email_id,
    employee_id,
    approver_one: {
      user_id: A1_user_id,
      name: A1_name,
      email_id: A1_email_id,
      employee_id: A1_employee_id,
    },
    approver_two: {
      user_id: A2_user_id,
      name: A2_name,
      email_id: A2_email_id,
      employee_id: A2_employee_id,
    },
  } = user;
  return {
    created_by: {
      user_id: _id,
      name: `${first_name} ${last_name}`,
      email_id: primary_email_id,
      employee_id: employee_id,
    },
    approver_one: {
      user_id: A1_user_id,
      name: A1_name,
      email_id: A1_email_id,
      isApprove: false,
      employee_id: A1_employee_id,
    },
    approver_two: {
      user_id: A2_user_id,
      name: A2_name,
      email_id: A2_email_id,
      isApprove: false,
      employee_id: A2_employee_id,
    },
  };
};
