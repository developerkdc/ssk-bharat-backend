import mongoose from "mongoose";
import catchAsync from "../../../Utils/catchAsync";
import payoutAndCommissionTransModel from "../../../database/schema/payoutsAndCommissionTransaction.schema";
import MarketExecutiveModel from "../../../database/schema/MarketExecutive.schema";
import ApiError from "../../../Utils/ApiError";

export const addPayout = catchAsync(async (req, res, next) => {
    const {payouts: { payoutType, transactionId, payoutAmount, tdsPercentage } } = req.body;
    const {marketExecutiveId} = req.params;
    let session;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const addPayout = await payoutAndCommissionTransModel.create(
            [{
                marketExecutiveId,
                payouts: {
                    payoutType,
                    transactionId,
                    payoutAmount,
                    tdsPercentage
                }
            }],
            { session }
        );

        const amountPaid = addPayout[0].payouts.amountPaid;

        const marketExecutiveBalance = await MarketExecutiveModel.findById(marketExecutiveId);

        if (!marketExecutiveBalance) {
            throw new ApiError('Market executive not found', 404);
        }

        const newBalance = marketExecutiveBalance.account_balance - Number(amountPaid);

        if (newBalance < 0) {
            throw new ApiError('Insufficient funds', 400);
        }

        await MarketExecutiveModel.updateOne(
            { _id: marketExecutiveId },
            {
                $inc: {
                    account_balance: -Number(amountPaid)
                }
            },
            { session }
        );

        await session.commitTransaction();
        await session.endSession();

        return res.status(201).json({
            statusCode: 201,
            status: "created",
            data: {
                payout: addPayout
            }
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
});

export const getPayoutAndCommissionTrans = catchAsync(async (req,res,next)=>{
    const {marketExecutiveId} = req.params
    const getTransaction = await payoutAndCommissionTransModel.aggregate([
        {
            $match:{marketExecutiveId:new mongoose.Types.ObjectId(marketExecutiveId)}
        },
        {
            $sort:{createdAt:-1}
        },
    ])

    return res.status(200).json({
        statusCode: 200,
        status: "success",
        length:getTransaction.length,
        data: {
            Transaction: getTransaction
        }
    });
})
