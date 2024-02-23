import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "address is required"]
    },
    location: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "location is required"]
    },
    area: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "area is required"]
    },
    district: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "district is required"]
    },
    taluka: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "taluka is required"]
    },
    state: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "state is required"]
    },
    city: {
        type: String,
        trim:true,
        lowercase: true,
        required: [true, "city is required"]
    },
    country: {
        type: String,
        trim:true,
        lowercase: true,
        // required: [true, "country is required"],
        default:"india"
    },
    pincode: {
        type: String,
        trim:true,
        required: [true, "pincode is required"]
    }
})

export default addressSchema;