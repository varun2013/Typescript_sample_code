/**
 * User Schema Defined here
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    isActive: { type: Boolean, default: true },
    loginToken: [{
        _id: 0,
        token: { type: String }
    }
    ],
    email: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    role: { type: Number }, // 1=> Admin, 2=> User
    deviceConfig: [{
        _id: 0,
        deviceToken: { type: String },
        deviceType: { type: String },
    }],

    provider: { type: String },
    profilePic: { type: Schema.ObjectId, ref: "files" },
    emailToken: { type: String },
    resetPasswordToken: { type: String },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
});

module.exports = {
    userModel: mongoose.model("Users", UserSchema)
}