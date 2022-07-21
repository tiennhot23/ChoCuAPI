const {helper, utils, messages} = require('../common')
const {otpModule, userModule} = require('../modules')
const {BadRequest, GeneralError} = require('../utils/Errors')

const userController = {}

userController.createAccount = async (req, res, next) => {
  let {phone, password} = req.body
  try {
    if (!phone) throw new BadRequest(messages.user.phone_required)
    if (!helper.isValidatePhone(phone))
      throw new BadRequest(messages.user.phone_invalid)

    let {account_id} = await userModule.createAccount({phone, password})
    if (account_id) {
      await otpModule.deleteOTP(phone)
      res.success({
        message: messages.user.create_account_success,
        data: await userModule.createUser({account_id, phone})
      })
    } else throw new GeneralError(messages.user.create_account_failed)
  } catch (e) {
    next(e)
  }
}

module.exports = userController
