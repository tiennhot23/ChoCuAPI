const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {
  otpModule,
  userModule,
  fileModule,
  servicesModule,
  dealModule
} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const userController = {}

userController.getCurrentUserInfo = async (req, res, next) => {
  let {user_id} = req.user
  try {
    res.success({
      data: await userModule.getUserInfo({user_id})
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserInfo = async (req, res, next) => {
  let {user_id} = req.params
  try {
    res.success({
      data: await userModule.getUserInfo({user_id})
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserFollowStatistic = async (req, res, next) => {
  let {user_id} = req.params
  try {
    res.success({
      data: await userModule.getUserFollows({user_id})
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserPosts = async (req, res, next) => {
  let {user_id} = req.params
  try {
    res.success({
      data: await userModule.getUserPosts({user_id})
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserPayments = async (req, res, next) => {
  let {user_id} = req.params
  try {
    res.success({
      data: await userModule.getUserPayments({user_id})
    })
  } catch (e) {
    next(e)
  }
}

userController.createAccount = async (req, res, next) => {
  let {phone, password} = req.body
  try {
    if (!phone) throw new BadRequest(messages.user.phone_required)
    if (!helper.isValidatePhone(phone))
      throw new BadRequest(messages.user.phone_invalid)

    let {account_id} = await userModule.createAccount({phone, password})
    if (account_id) {
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
  let {username, password, fcm_token = ''} = req.body
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
    // if (!account.active) throw new Forbidden(messages.user.account_locked)
    let {user_id} = await userModule.findUserByAccount({account_id})
    let access_token = utils.generateAccessToken({user_id, account_id})
    if (
      await userModule.addAccountToken({account_id, access_token, fcm_token})
    ) {
      res.success({
        message: messages.user.login_success,
        data: [{access_token}]
      })
    }
  } catch (e) {
    next(e)
  }
}

userController.logout = async (req, res, next) => {
  let {account_id, access_token} = req.user
  let {fcm_token} = req.body
  try {
    res.success({
      message: messages.user.logout_success,
      data: await userModule.removeAccountToken({
        account_id,
        access_token,
        fcm_token
      })
    })
  } catch (e) {
    next(e)
  }
}

userController.resetPassword = async (req, res, next) => {
  let {password, phone} = req.body
  let {account_id} = req.user || {}
  try {
    if (!account_id) {
      let u = await userModule.findAccountByUsername({username: phone})
      account_id = u?.account_id
    }

    if (!account_id) throw new NotFound(messages.user.not_found)

    if (await userModule.updatePassword({account_id, password})) {
      res.success({
        message: messages.user.password_updated,
        data: [{updated: true}]
      })
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

userController.updateInfo = async (req, res, next) => {
  let {name, avatar, email, address} = req.body
  let {user_id} = req.user
  let isUploadFile =
    req.files && req.files.length > 0 && req.files[0].fieldname === 'avatar'
  try {
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
      avatar = await fileModule.upload_single(
        req.files[0],
        `user/${user_id}/`,
        'avatar'
      )
    }

    res.success({
      message: messages.user.update_success,
      data: await userModule.updateInfo({user_id, name, avatar, email, address})
    })
  } catch (e) {
    next(e)
  }
}

userController.addUserPayment = async (req, res, next) => {
  let {user_id} = req.user
  let {payment_id, user_payment_info} = req.body
  try {
    if (
      await userModule.addUserPayment({user_id, payment_id, user_payment_info})
    )
      res.success({
        message: messages.user.add_success,
        data: [{added: true}]
      })
    else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

userController.removeUserPayment = async (req, res, next) => {
  let {user_id} = req.user
  let {payment_id} = req.body
  try {
    if (await userModule.removeUserPayment({user_id, payment_id}))
      res.success({
        message: messages.user.delete_success,
        data: [{deleted: true}]
      })
    else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

userController.addUserServices = async (req, res, next) => {
  let {user_id} = req.user
  let {price, post_turn} = req.body
  try {
    if (await servicesModule.addUserServices({user_id, price})) {
      await userModule.increasePostTurn({user_id, extra_post_turn: post_turn})
      res.success({
        message: messages.user.add_success,
        data: [{added: true}]
      })
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

userController.subcribeNotify = async (req, res, next) => {
  let {account_id} = req.user
  let {fcm_token} = req.body
  try {
    if (!fcm_token) throw new BadRequest(messages.user.token_required)
    res.success({
      data: [
        {subcribed: await userModule.addAccountToken({account_id, fcm_token})}
      ]
    })
  } catch (e) {
    next(e)
  }
}

userController.unsubcribeNotify = async (req, res, next) => {
  let {account_id} = req.user
  let {fcm_token} = req.body
  try {
    if (!fcm_token) throw new BadRequest(messages.user.token_required)
    res.success({
      data: [
        {
          unsubcribed: await userModule.removeAccountToken({
            account_id,
            fcm_token
          })
        }
      ]
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserRevenueStat = async (req, res, next) => {
  let {user_id} = req.user
  let {fromDate, toDate} = req.body
  try {
    res.success({
      data: await userModule.getUserRevenueStat({user_id, fromDate, toDate})
    })
  } catch (e) {
    next(e)
  }
}

userController.getUserStat = async (req, res, next) => {
  let {user_id} = req.params
  try {
    let rateStat = await dealModule.getUserRateStat({user_id})
    let sellDealStat = await dealModule.getUserSellDealStat({user_id})
    let successSellDealCount = 0
    sellDealStat.map((e) => {
      if (['done', 'delivered'].includes(e.deal_state))
        successSellDealCount += Number(e.count)
    })

    let buyDealStat = await dealModule.getUserBuyDealStat({user_id})
    let successBuyDealCount = 0
    let deniedBuyDealCount = 0
    buyDealStat.map((e) => {
      if (['done', 'delivered'].includes(e.deal_state))
        successBuyDealCount += Number(e.count)
      if (['denied'].includes(e.deal_state))
        deniedBuyDealCount += Number(e.count)
    })

    res.success({
      data: {
        rating: Number(
          (Number(rateStat.rate_count) !== 0
            ? Number(rateStat.rate_sum) / Number(rateStat.rate_count)
            : 0
          ).toFixed(1)
        ),
        rate_count: Number(rateStat.rate_count),
        success_sell_deal_count: successSellDealCount,
        success_buy_deal_count: successBuyDealCount,
        denied_buy_deal_count: deniedBuyDealCount
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports = userController
