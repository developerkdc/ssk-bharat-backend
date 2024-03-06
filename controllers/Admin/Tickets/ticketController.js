import ApiError from "../../../Utils/ApiError";
import catchAsync from "../../../Utils/catchAsync";
import { dynamicSearch } from "../../../Utils/dynamicSearch";
import TicketModel from "../../../database/schema/Tickets/tickets.schema";

export const replyTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const ticket = await TicketModel.findByIdAndUpdate(
    id,
    {
      $push: {
        replies: req.body,
      },
    },
    { new: true, runValidators: true }
  );
  if (!ticket) {
    return next(new ApiError("Ticket not found", 404));
  }
  return res.status(201).json({
    statusCode: 201,
    status: "success",
    data: ticket,
    message: "Message Send",
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
  const { string, boolean, numbers } = req?.body?.searchFields || {};
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;
  const search = req.query.search || "";
  const sortField = req.query.sortBy || "created_at";

  let searchQuery = {};
  if (search != "" && req?.body?.searchFields) {
    const searchdata = dynamicSearch(search, boolean, numbers, string);
    if (searchdata?.length == 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "failed",
        data: {
          faqs: [],
        },
        message: "Results Not Found",
      });
    }
    searchQuery = searchdata;
  }

  const totalFaq = await TicketModel.countDocuments({
    ...searchQuery,
  });
  const totalPages = Math.ceil(totalFaq / limit);
  const validPage = Math.min(Math.max(page, 1), totalPages);
  const skip = Math.max((validPage - 1) * limit, 0);

  const tickets = await TicketModel.aggregate([
    {
      $lookup: {
        from: "retailers",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id",
      },
    },
    { $unwind: "$user_id" },
    {
      $project: {
        user_id: {
          proposed_changes: 0,
          approver: 0,
        },
      },
    },
    
    { $match: { ...searchQuery } },
    { $sort: { [sortField]: sortDirection } },
    { $skip: skip },
    { $limit: limit },
  ]);
  return res.status(201).json({
    statusCode: 201,
    status: "success",
    data: {
      tickets: tickets,
      totalPages: totalPages,
    },
    message: "Ticket List",
  });
});
