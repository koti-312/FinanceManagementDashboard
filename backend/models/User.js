import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    plaidAccessToken: {
        type: String,
        default: null
    },
    plaidItemId: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User