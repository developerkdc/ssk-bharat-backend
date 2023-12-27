import mongoose from "mongoose"
import addressSchema from "../utils/address.schema";
import userAndApprovals from "../utils/approval.schema";


const ItemsSchema = new mongoose.Schema({
  itemName: {type:String,required:true,trim:true},
  category: {type:String,required:true,trim:true},
  sku: {type:String,required:true,trim:true},
  hsn_code: {type:String,required:true,trim:true},
  itemsWeight: {type:Number,required:true,trim:true},
  unit: {type:String,required:true,trim:true},
  ratePerUnit: {type:Number,required:true,trim:true},
  quantity: {type:Number,required:true,trim:true},
  itemAmount: {type:Number,required:true,trim:true},
  gstpercentage:{type:Number,required:true,trim:true},
  gstAmount: {type:Number,required:true,trim:true},
  totalAmount: {type:Number,required:true,trim:true},
  receivedQuantity: {type:Number,required:true,trim:true},
  balanceQuantity: {type:Number,trim:true},
  
});

const TransportDetailsSchema = new mongoose.Schema({
  deliveryChallanNo: { type: String, trim: true, required: true },
  transportType: {
   
      handDelivery: {
        personName: { type: String, trim: true },
        personNumber: { type: String, trim: true },
      },
      courier: {
        companyName: { type: String, trim: true },
        docketNumber: { type: String, trim: true },
      },
      road: {
        transporterName: { type: String, trim: true },
        vehicleNumber: { type: String, trim: true },
        driverName: { type: String, trim: true },
        driverNumber: { type: String, trim: true },
      },
      airRail: {
        transporterName: { type: String, trim: true },
        airRail: { type: String, trim: true },
        awbNumber: { type: String, trim: true },
      },

    deliveryChallanNo_image:{type:String,default:null}
  },
});

const SupplierDetailsSchema = new mongoose.Schema({
  billto: {
    companyName: { type: String, trim: true },
    gstNo: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    primaryEmailID: { type: String, trim: true },
    secondaryEmailID: { type: String, trim: true },
    primaryMobileNo: { type: String, trim: true },
    secondaryMobileNo: { type: String, trim: true },
    address: addressSchema,
  },
  shipto: {
    companyName: { type: String, trim: true },
    gstNo: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    primaryEmailID: { type: String, trim: true },
    secondaryEmailID: { type: String, trim: true },
    primaryMobileNo: { type: String, trim: true },
    secondaryMobileNo: { type: String, trim: true },
    address: addressSchema,
  },
});

const InvoiceDetailsSchema = new mongoose.Schema({
  invoiceNo: {type:String,trim:true},
  invoiceDate: {type:Date,trim:true},
  itemsAmount: {type:Number,trim:true},
  discountPercentage: {type:Number,trim:true},
  discountAmount: {type:Number,trim:true},
  gstPercentage: {type:Number,trim:true},
  gstAmount: {type:Number,trim:true},
  totalAmount: {type:Number,trim:true},
  uploadInviocePDF: {type:String,default:null},
  
});

const InventorySchema = new mongoose.Schema({
  purchaseOrderNo: { type: String,trim:true,unique:true },
  supplierCompanyName: String,
  receivedDate: Date,
  supplierDetails: SupplierDetailsSchema,
  itemsDetails: [ItemsSchema],
  transportDetails: TransportDetailsSchema,
  invoiceDetails: InvoiceDetailsSchema,
  approvals: userAndApprovals,
});

const inventoryModel = mongoose.model("Inventory", InventorySchema);
export default inventoryModel;
