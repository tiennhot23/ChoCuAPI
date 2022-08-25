const {helper, utils, messages} = require('../common')
const {role, postState} = require('../common/constants')
const {
  otpModule,
  userModule,
  fileModule,
  adminModule,
  postModule,
  accountModule,
  notifyModule,
  servicesModule
} = require('../modules')
const mail = require('../middlewares/mail')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const adminController = {}

adminController.getPendingPost = async (req, res, next) => {
  try {
    return res.success({
      data: await adminModule.getPendingPost()
    })
  } catch (e) {
    next(e)
  }
}

adminController.getServicesRevenue = async (req, res, next) => {
  const {fromTime, toTime} = req.body
  try {
    return res.success({
      data: await servicesModule.getUserBuyServices({fromTime, toTime})
    })
  } catch (e) {
    next(e)
  }
}

adminController.login = async (req, res, next) => {
  let {username, password, fcm_token} = req.body
  try {
    if (!username) throw new BadRequest(messages.user.username_required)
    if (!password) throw new BadRequest(messages.user.password_required)

    let account = await userModule.login({
      username,
      password
    })
    if (!account) throw new BadRequest(messages.user.incorrect_account)
    let {account_id, role_id} = account
    if (role_id !== role.admin) throw new Forbidden()
    console.log(await adminModule.findAdminByAccount({account_id}))
    let admin = await adminModule.findAdminByAccount({account_id})
    let access_token = utils.generateAccessToken({
      admin_id: admin.admin_id,
      account_id
    })
    if (
      await userModule.addAccountToken({account_id, access_token, fcm_token})
    ) {
      res.success({
        message: messages.user.login_success,
        data: [{access_token, admin}]
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

    let seller = await userModule.getUserInfo({user_id: post.seller_id})
    await notifyModule.send({
      notify_detail_id: post_id,
      notify_type: 'post',
      title: 'Tin đã được duyệt',
      message: `Tin "${post.title}" đã được duyệt`,
      user_fcm_token: seller.fcm_tokens
    })

    let followers = await userModule.getUserFollower({user_id: post.seller_id})
    let followers_token = []
    followers.map((e) => {
      followers_token.concat(e.fcm_tokens)
    })
    await notifyModule.send({
      notify_detail_id: post_id,
      notify_type: 'post',
      title: 'Tin đăng mới từ người bạn đang theo dõi',
      message: `Người mà bạn đang theo dõi vừa đăng tin mới. Vào xem ngay nào`,
      user_fcm_token: followers_token
    })
  } catch (e) {
    next(e)
  }
}

adminController.denyPost = async (req, res, next) => {
  let {post_id} = req.params
  let {reason} = req.body
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

    let seller = await userModule.getUserInfo({user_id: post.seller_id})
    await notifyModule.send({
      notify_detail_id: post_id,
      notify_type: 'post',
      title: 'Tin đã bị từ chối',
      message: `Tin "${post.title}" đã bị từ chối`,
      user_fcm_token: seller.fcm_tokens
    })
    if (seller?.email && seller?.email !== 'Chưa cung cấp')
      mail.sendMail(seller?.email, '[TIN ĐĂNG BỊ TỪ CHỐI PHÊ DUYỆT]', reason)
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
  let {reason} = req.body
  try {
    let account = await accountModule.findAccountByUsername({username})
    if (!account) throw new NotFound(messages.user.account_not_found)
    res.success({
      message: messages.user.account_locked,
      data: await accountModule.lockAccount({account_id: account.account_id})
    })
    let user = await userModule.findUserByAccount({
      account_id: account.account_id
    })
    if (user) {
      await notifyModule.send({
        notify_detail_id: user.user_id,
        notify_type: 'user',
        title: 'Tài khoản đã bị khoá',
        message: `Tài khoản của bạn đã bị khoá. Vui lòng kiểm tra mail hoặc liên hệ số điện thoại 0703122871 để biết thêm chi tiết`,
        user_fcm_token: user.fcm_tokens
      })
      if (user?.email && user?.email !== 'Chưa cung cấp')
        mail.sendMail(user?.email, '[THÔNG BÁO KHOÁ TÀI KHOẢN]', reason)
    }
    return
  } catch (e) {
    next(e)
  }
}

module.exports = adminController
