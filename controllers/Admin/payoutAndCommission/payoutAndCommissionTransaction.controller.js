import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import payoutAndCommissionTransModel from "../../../database/schema/payoutsAndCommissionTransaction.schema";
import MarketExecutiveModel from "../../../database/schema/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";

export const addPayout = catchAsync(async (req, res, next) => {
    const { marketExecutiveId, payouts: { payoutType, transactionId, payoutAmount, tdsPercentage } } = req.body
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const addPayout = await payoutAndCommissionTransModel.create([{
            marketExecutiveId,
            payouts: {
                payoutType,
                transactionId,
                payoutAmount,
                tdsPercentage
            }
        }], { session });

        const marketExectiveBalance = await MarketExecutiveModel.updateOne({ _id: marketExecutiveId }, {
            $inc: {
                account_balance: -Number(addPayout[0].payouts.amountPaid)
            }
        }, { runValidators:true,session })

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({
            statusCode: 201,
            status: "created",
            data: {
                payout: addPayout
            }
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession();
        next(new ApiError(error.message, 400))
    }
})