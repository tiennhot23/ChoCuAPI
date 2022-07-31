const {helper, utils, messages} = require('../common')
const {role, postState} = require('../common/constants')
const {
  otpModule,
  userModule,
  fileModule,
  adminModule,
  postModule,
  accountModule
} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const adminController = {}

adminController.login = async (req, res, next) => {
  let {username, password, fcm_token} = req.body
  try {
    if (!username) throw new BadRequest(messages.user.username_required)
    if (!password) throw new BadRequest(messages.user.password_required)

    let account = await userModule.login({
      username,
      password
    })
    if (!account) res.success({message: messages.user.incorrect_account})
    let {account_id, role_id} = account
    if (role_id !== role.admin) throw new Forbidden()
    console.log(await adminModule.findAdminByAccount({account_id}))
    let {admin_id} = await adminModule.findAdminByAccount({account_id})
    let access_token = utils.generateAccessToken({admin_id, account_id})
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

adminController.approvePost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    if (post.post_state !== postState.PENDING)
      return res.success({
        message: messages.post.post_not_pending
      })
    res.success({
      message: messages.post.post_approved,
      data: await postModule.update({post_id, post_state: postState.ACTIVE})
    })
  } catch (e) {
    next(e)
  }
}

adminController.denyPost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    if (post.post_state !== postState.PENDING)
      return res.success({
        message: messages.post.post_not_pending
      })
    res.success({
      message: messages.post.post_denied,
      data: await postModule.delete({post_id})
    })
  } catch (e) {
    next(e)
  }
}

adminController.deletePost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    res.success({
      message: messages.post.post_deleted,
      data: await postModule.update({post_id, post_state: postState.DELETED})
    })
  } catch (e) {
    next(e)
  }
}

adminController.lockAccount = async (req, res, next) => {
  let {username} = req.params
  try {
    let account = await accountModule.findAccountByUsername({username})
    if (!account) throw new NotFound(messages.user.account_not_found)
    res.success({
      message: messages.user.account_locked,
      data: await accountModule.lockAccount({account_id: account.account_id})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = adminController
