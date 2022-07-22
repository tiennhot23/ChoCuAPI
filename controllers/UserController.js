const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {otpModule, userModule} = require('../modules')
const {BadRequest, GeneralError, Forbidden} = require('../utils/Errors')

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

userController.login = async (req, res, next) => {
  let {username, password} = req.body
  try {
    if (!username) throw new BadRequest(messages.user.username_required)
    if (!password) throw new BadRequest(messages.user.password_required)

    let account = await userModule.login({
      username,
      password
    })
    if (!account) res.success({message: messages.user.incorrect_account})
    let {account_id, role_id} = account
    if (role_id !== role.customer) throw new Forbidden()
    let {user_id} = await userModule.findUserByAccount({account_id})
    let access_token = utils.generateAccessToken({user_id, account_id})
    if (await userModule.addAccessToken({account_id, access_token})) {
      res.success({
        message: messages.user.login_success,
        data: [{access_token}]
      })
    }
  } catch (e) {
    next(e)
  }
}

userController.updateInfo = async (req, res, next) => {
  let {name, avatar, email, address} = req.body
  let {user_id} = req.user
  try {
    res.success({
      message: messages.user.update_success,
      data: await userModule.updateInfo({user_id, name, avatar, email, address})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = userController
