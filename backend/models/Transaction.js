import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["income", "expense", "investment"],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    merchantName: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    date: {
        type: Date,
        required: true
    },

    plaidTransactionId: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction