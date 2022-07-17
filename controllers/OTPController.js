const OTPModule = require('../modules/OTPModule')
const {helper, utils, messages} = require('../common')
const {Err, Response} = require('../models')

const otp = {}

otp.createOTP = async (req, res, next) => {
  let {phone} = req.body
  try {
    if (!phone) return next(new Err(messages.otp.phone_required, 400, null))
    if (!helper.isValidatePhone(phone))
      return next(new Err(messages.otp.phone_invalid, 400, null))

    let obj = await OTPModule.getOTP(phone)
    if (!obj) return next({data: await OTPModule.updateOTP(phone)})
    return next({data: await OTPModule.createOTP(phone)})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

otp.verifyOTP = async (req, res, next) => {
  let {phone, otp_code} = req.body
  try {
    if (!phone) return next(new Err(messages.otp.phone_required, 400, null))
    if (!helper.isValidatePhone(phone))
      return next(new Err(messages.otp.phone_invalid, 400, null))
    if (!otp_code) return next(new Err(messages.otp.otp_required, 400, null))
    if (!helper.isValidOTP(otp_code))
      return next(new Err(messages.otp.otp_invalid, 400, null))

    let obj = await OTPModule.verifyOTP(phone, otp_code)
    if (!obj) return next({data: obj, message: messages.otp.otp_expired})
    await OTPModule.deleteOTP(phone)
    return next({data: obj, message: messages.otp.otp_verified})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

module.exports = otp
