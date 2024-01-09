export const approvalData = function (user) {
    const {current_data: {_id,first_name,last_name,primary_email_id,employee_id,approver_one,approver_two}} = user;
    const approverObj = {
        updated_by: {
            user_id: _id,
            name: `${first_name} ${last_name}`,
            email_id: primary_email_id,
            employee_id: employee_id,
        }
    };

    if(approver_one){
        approverObj["approver_one"] = {
            user_id: approver_one?.user_id,
            name: approver_one?.name,
            email_id: approver_one?.email_id,
            isApprove: false,
            employee_id: approver_one?.employee_id,
        }
    }

    if(approver_two){
        approverObj["approver_two"] = {
            user_id: approver_two?.user_id,
            name: approver_two?.name,
            email_id: approver_two?.email_id,
            isApprove: false,
            employee_id: approver_two?.employee_id,
        }
    }

    return approverObj;
};
