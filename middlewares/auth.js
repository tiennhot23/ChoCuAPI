const jwt = require('jsonwebtoken')

const UserModule = require('../modules/UserModule')
const {messages, utils} = require('../common')
const {Unauthorized, InvalidToken, Forbidden} = require('../utils/Errors')
const {role} = require('../common/constants')
const {adminModule} = require('../modules')

const auth = {}

auth.verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const access_token = authHeader && authHeader.split(' ')[1]
    if (!access_token) throw new Unauthorized()

    jwt.verify(access_token, process.env.ACCESSTOKEN, async (err, data) => {
      try {
        if (err) throw new InvalidToken()

        var {user_id, account_id} = data.user

        if (!(await UserModule.isValidAccessToken({account_id, access_token})))
          throw new InvalidToken()
        if ((await UserModule.getUserInfo({user_id})).role_id !== role.customer)
          throw new Forbidden()

        req.user = {user_id, account_id, access_token}
        next()
      } catch (e) {
        next(e)
      }
    })
  } catch (e) {
    next(e)
  }
}

auth.verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const access_token = authHeader && authHeader.split(' ')[1]
    if (!access_token) throw new Unauthorized()

    jwt.verify(access_token, process.env.ACCESSTOKEN, async (err, data) => {
      try {
        if (err) throw new InvalidToken()

        var {user_id, account_id} = data.user

        if (!(await UserModule.isValidAccessToken({account_id, access_token})))
          throw new InvalidToken()
        if (
          (await adminModule.findAdminByAccount({account_id})).role_id !==
          role.admin
        )
          throw new Forbidden()

        req.user = {user_id, account_id, access_token}
        next()
      } catch (e) {
        next(e)
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports = auth
