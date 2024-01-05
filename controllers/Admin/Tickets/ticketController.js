import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import TicketModel from "../../../database/schema/Tickets/tickets.schema";

export const createTicket = catchAsync(async (req, res, next) => {
  const ticketData = req.body;
  const newTicket = await TicketModel.create(ticketData);
  if (newTicket) {
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      data: newTicket,
      message: "Ticket Created",
    });
  }
});

export const replyTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const ticket=await TicketModel.findByIdAndUpdate(id,{
    $push:{
      replies:req.body
    }
  },{new:true,runValidators:true})
  if (!ticket) {
    return next(new ApiError("Ticket not found", 404));
  }
  return res.status(201).json({
    statusCode: 201,
    status: "success",
    data: ticket,
    message: "Message Send ",
  });
});

export const updateTicketStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { ticket_status } = req.body;

  const updatedTicket = await TicketModel.findByIdAndUpdate(
    id,
    { $set: { ticket_status: ticket_status } },
    { new: true }
  );

  if (!updatedTicket) {
    return next(new ApiError("Ticket not found", 404));
  }

  return res.status(201).json({
    statusCode: 201,
    status: "success",
    data: updatedTicket,
    message: "Ticket Status Updated",
  });
});

export const ticketList = catchAsync(async (req, res, next) => {
  const tickets = await TicketModel.find().populate({path :"user_id" ,select: "_id current_data.company_name" });
  return res.status(201).json({
    statusCode: 201,
    status: "success",
    data: tickets,
    message: "Ticket List",
  });
});
