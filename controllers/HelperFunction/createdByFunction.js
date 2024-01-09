export const createdByFunction = function (user) {
    return {
        user_id: user._id,
        name: `${user.current_data.first_name} ${user.current_data.last_name}`,
        email_id: user.current_data.primary_email_id,
        employee_id: user.current_data.employee_id,
    }
}