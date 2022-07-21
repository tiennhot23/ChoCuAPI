const {otpModule} = require('../modules')
const {helper, utils, messages} = require('../common')
const {BadRequest} = require('../utils/Errors')

const otp = {}

otp.createOTP = async (req, res, next) => {
  let {phone} = req.body
  try {
    if (!phone) throw new BadRequest(messages.otp.phone_required)
    if (!helper.isValidatePhone(phone))
      throw new BadRequest(messages.otp.phone_invalid)

    let otp = await otpModule.getOTP(phone)
    res.success({
      message: messages.otp.otp_created,
      data: otp
        ? await otpModule.resetOTP(phone)
        : await otpModule.createOTP(phone)
    })
  } catch (e) {
    next(e)
  }
}

otp.verifyOTP = async (req, res, next) => {
  let {phone, otp_code} = req.body
  try {
    if (!phone) throw new BadRequest(messages.otp.phone_required)
    if (!helper.isValidatePhone(phone))
      throw new BadRequest(messages.otp.phone_invalid)
    if (!otp_code) throw new BadRequest(messages.otp.otp_required)
    if (!helper.isValidOTP(otp_code))
      throw new BadRequest(messages.otp.otp_invalid)

    let otp = await otpModule.getOTP(phone)
    if (otp && otp.otp_code === otp_code && otp.time_expired >= new Date())
      return res.success({
        data: await otpModule.verifyOTP(phone),
        message: messages.otp.otp_verified
      })
    else return res.success({data: [], message: messages.otp.otp_expired})
  } catch (e) {
    next(e)
  }
}

otp.verifyAction = async (req, res, next) => {
  let {phone, verify_code} = req.body
  try {
    if (!phone) throw new BadRequest(messages.otp.phone_required)
    if (!helper.isValidatePhone(phone))
      throw new BadRequest(messages.otp.phone_invalid)
    if (!verify_code) throw new BadRequest(messages.otp.otp_required)
    if (!helper.isValidOTP(verify_code))
      throw new BadRequest(messages.otp.otp_invalid)

    let otp = await otpModule.getOTP(phone)
    if (otp && otp.verified && otp.verify_code === verify_code) {
      next()
    } else
      res.success({message: messages.otp.otp_expired, data: [{accept: false}]})
  } catch (e) {
    next(e)
  }
}

module.exports = otp
