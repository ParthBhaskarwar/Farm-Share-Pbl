const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require("bcryptjs");

const farmerSchema = mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.signupCompleted;
        }
    },

    email: {
        type: String,
        required: function () {
            return this.signupCompleted;
        },
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide correct email"
        }
    },

    phone_number: {
        type: String,
        validate: {
            validator: function (phone_number) {
                return phone_number.length === 10;
            },
            message: "Please provide 10-digit phone number"
        }
    },

    password: {
        type: String,
        minLength: 4
    },

    passwordConfirm: {
        type: String,
        minLength: 4,
    },

    photo: {
        type: String,
        default: "/default.jpg",
    },

    village: {
        type: String,
        required: function () {
            return this.signupCompleted;
        }
    },

    district: {
        type: String,
        required: function () {
            return this.signupCompleted;
        }
    },


    earnings: {
        type: Number,
        default: 0
    },

    preferredLanguage: {
        type: String,
        required: function () {
            return this.signupCompleted;
        }
    },

    preferredCrops: {
        type: [String],
        required: function () {
            return this.signupCompleted;
        }
    },

    notificationPreference: {
        type: String,
        required: function () {
            return this.signupCompleted;
        },
        enum: ["app", "sms", "call"]
    },

    registerOtp: String,
    registerOtpExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,

    isEmailVerified: {
        type: Boolean,
        default: false
    },
    signupCompleted: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: function () {
                return this.signupCompleted;
            }
        },
        coordinates: {
            type: [Number],
            required: function () {
                return this.signupCompleted;
            }
        },

    }
});

farmerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    console.log(this.password);

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

});


farmerSchema.pre('save', function () {
    if (!this.isModified('password') || this.isNew) {
        return;
    }
    this.passwordChangedAt = Date.now();

});

farmerSchema.methods.checkPassword = function (candidatePassword, farmerPassword) {
    return bcrypt.compare(candidatePassword, farmerPassword);
}

farmerSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

farmerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

farmerSchema.index({ location: '2dsphere' });


const FarmerModel = new mongoose.model("Farmer", farmerSchema);

module.exports = FarmerModel;