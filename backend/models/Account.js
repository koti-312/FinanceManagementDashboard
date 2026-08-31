import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    accountName: {
        type: String,
        required: true,
        trim: true
    },

    accountType: {
        type: String,
        enum: ["bank", "credit_card", "investment"],
        required: true
    },

    bankName: {
        type: String,
        required: true,
        trim: true
    },

    balance: {
        type: Number,
        default: 0
    },

    plaidAccountId: {
        type: String,
        default: null
    }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model("Account", accountSchema);

export default Account