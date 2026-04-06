const sgMail = require("./sendgrid");
const resetTemplate = require("./templates/resetPasswordTemplate");
const verifyEmailTemplate=require('./templates/verifyEmailTemplate');
const verifyPickupTemplate=require('./templates/verifyPickupTemplate');
const bookingConfirmTemplate=require('./templates/bookingConfirmedTemplate');
const rentalTemplate=require('./templates/rentalTemplate');

const sendResetEmail = async (email, resetUrl) => {
  await sgMail.send({
    to: email,
    from: `${process.env.EMAIL}`,
    subject: "Reset Your Password",
    html: resetTemplate(resetUrl),
  });
};

const sendVerifyEmail=async(email,otp)=>{
  await sgMail.send({
    to: email,
    from: `${process.env.EMAIL}`,
    subject: "Verify Your Email",
    html: verifyEmailTemplate(otp),
  });
}

const sendBookingConfirmation=async(booking)=>{
  await sgMail.send({
    to: booking.farmer.email,
    from: `${process.env.EMAIL}`,
    subject: "Booking Confirmation ",
    html: bookingConfirmTemplate(booking),
  })
}

const sendRentalJob=async(booking)=>{
  await sgMail.send({
    to: booking.equipment.farmer.email,
    from: `${process.env.EMAIL}`,
    subject: "New Equipment Booking Alert",
    html: rentalTemplate(booking),
  })
}

const sendVerifyPickup=async(email,otp)=>{
  await sgMail.send({
    to: email,
    from: `${process.env.EMAIL}`,
    subject: "Verify Your Email",
    html: verifyPickupTemplate(otp),
  });
}

const sendVerifyReturn=async(email,otp)=>{
  await sgMail.send({
    to: email,
    from: `${process.env.EMAIL}`,
    subject: "Verify Your Email",
    html: verifyReturnTemplate(otp),
  });
}

module.exports = { sendResetEmail,sendVerifyEmail,sendVerifyPickup,sendVerifyReturn,sendBookingConfirmation,sendRentalJob };
