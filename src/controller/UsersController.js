const OtpModel = require("../models/OtpModels");
const UserModel = require("../models/UsersModel");
var jwt = require("jsonwebtoken");
const SendEmailUtility = require("../utility/SendEmailUtility");

// registration start

exports.Registration = async (req, res) => {
  try {
    const reqBody = req.body;
    const user = await UserModel.create(reqBody);
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    res.status(200).json({ status: "failed", data: err });
  }
};

// registration end

// login start
exports.Login = async (req, res) => {
  try {
    const reqBody = req.body;
    let user = await UserModel.findOne({ email: reqBody.email });
    if (!user) {
      res.status(200).json({ status: "failed", data: "User not found" });
    }
    if (user.password !== reqBody.password) {
      res.status(200).json({ status: "failed", data: "Invalid password" });
    } else {
      let payload = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user["email"],
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET);
      res.status(200).json({ status: "success", data: user, token: token });
    }
  } catch (err) {
    res.status(200).json({ status: "Failed", data: err });
  }
};
// login end

// profile update start
exports.ProfileUpdate = async (req, res) => {
  try {
    let email = req.headers.email;
    let body = req.body;
    let query = { email: email };
    let user = await UserModel.updateOne(query, body);
    res.status(200).json({ status: "success", data: user });
  } catch {
    res.status(200).json({ status: "failed", data: err });
  }
};
// profile update end

// profile details start
exports.ProfileDetails = async (req, res) => {
  try {
    let email = req.headers.email;
    let user = await UserModel.findOne({ email: email });
    res.status(200).json({ status: "success", data: user });
  } catch {
    res.status(200).json({ status: "failed", data: err });
  }
};
// profile details end

// Recover and verify send email otp start
exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let otp = Math.floor(Math.random() * 1000000);
  try {
    let user = await UserModel.findOne({ email: email })
    if (!user) {
      return res.status(200).json(({ status: "failed", data: "User not found" }));
    }
    else {
      // 1 send otp in database
      let createOtp = await OtpModel.create({ email: email, otp: otp })
      // 2 send otp in email
      let sendEmail = SendEmailUtility(email, "Todo Planner Password Verification", `Your OTP is ${otp}`,)
      return res.status(200).json(({ status: "success", data: "OTP sent successfully" }))
    }
  } catch (err) {
    res.status(200).json({ status: "Failed", data: err });
  }
};
// Recover and verify send email otp end

// verify otp start
exports.OtpVerify = async (req, res) => {

  let email = req.params.email;
  let status = 0;
  let otp = req.params.otp;
  let updateStatus = 1

  try {
    let otpCheck = await OtpModel.aggregate(
      [
        { $match: { email: email, otp: otp, status: status } },
        { $count: "total" }
      ]
    )
    if (otpCheck.length > 0) {
      let otpUpdate = await OtpModel.updateOne({ email: email, otp: otp }, { status: updateStatus })
      return res.status(200).json(({ status: "success", data: otpUpdate }));
    }
    else {
      return res.status(200).json(({ status: "failed", data: "Invalid OTP" }));
    }
  }
  catch (err) {
    res.status(200).json({ status: "Failed", data: err });
  }
}
// verify otp end

// reset password start
exports.ResetPassword = async (req, res) => {
  let email = req.body.email;
  let otp = req.body.otp
  let updateStatus = 1;
  let newPassword = req.body.password;

  try {
    let otpCheck = await OtpModel.aggregate(
      [
        { $match: { email: email, otp: otp, status: updateStatus } },
        { $count: "total" }
      ]
    )
    if (otpCheck.length > 0) {
      let updatePassword = await UserModel.updateOne({ email: email }, { password: newPassword });
      return res.status(200).json(({ status: "success", data: updatePassword }));
    }
    else {
      res.status(200).json(({ status: "Failed", data: "Invalid OTP" }))
    }
  }
  catch (err) {
    res.status(200).json(({ status: "Failed", data: err }))
  }
}
// reset password end