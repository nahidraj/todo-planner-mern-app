const mongoose = require('mongoose')
const otpSchema = new mongoose.Schema({
  email: {
    type: 'string'
  },
  otp: {
    type: 'string'
  },
  status: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now()
  }
}, {
  versionKey: false
})

const OtpModel = mongoose.model('otp', otpSchema);
module.exports = OtpModel