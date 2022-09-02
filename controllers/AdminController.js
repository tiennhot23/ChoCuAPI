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
  servicesModule,
  reportModule
} = require('../modules')
const mail = require('../middlewares/mail')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const adminController = {}

adminController.getAllPost = async (req, res, next) => {
  try {
    return res.success({
      data: await adminModule.getAllPost()
    })
  } catch (e) {
    next(e)
  }
}

adminController.getPendingPost = async (req, res, next) => {
  try {
    return res.success({
      data: await adminModule.getPendingPost()
    })
  } catch (e) {
    next(e)
  }
}

adminController.getAllUser = async (req, res, next) => {
  try {
    return res.success({
      data: await adminModule.getAllUser()
    })
  } catch (e) {
    next(e)
  }
}

adminController.getServicesRevenue = async (req, res, next) => {
  const {month, year} = req.body
  try {
    console.log(await servicesModule.getUserBuyServices({month, year}))
    return res.success({
      data: await servicesModule.getUserBuyServices({month, year})
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
      user_id: admin.user_id,
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
    let data = await postModule.update({post_id, post_state: postState.ACTIVE})
    if (data) {
      let seller = await userModule.getUserInfo({user_id: post.seller_id})
      if (seller?.fcm_tokens && seller?.fcm_tokens.length > 0) {
        await notifyModule.send({
          notify_detail_id: post_id,
          notify_type: 'post',
          title: 'Tin đã được duyệt',
          message: `Tin "${post.title}" đã được duyệt`,
          user_fcm_token: seller.fcm_tokens
        })
      }
    }

    res.success({
      message: messages.post.post_approved,
      data: data
    })

    // let followers = await userModule.getUserFollower({user_id: post.seller_id})
    // let followers_token = []
    // followers.map((e) => {
    //   followers_token.concat(e.fcm_tokens)
    // })
    // await notifyModule.send({
    //   notify_detail_id: post_id,
    //   notify_type: 'post',
    //   title: 'Tin đăng mới từ người bạn đang theo dõi',
    //   message: `Người mà bạn đang theo dõi vừa đăng tin mới. Vào xem ngay nào`,
    //   user_fcm_token: followers_token
    // })
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
    let data = await postModule.update({post_id, post_state: postState.DENIED})
    if (data) {
      let seller = await userModule.getUserInfo({user_id: post.seller_id})
      if (seller?.fcm_tokens && seller?.fcm_tokens.length > 0) {
        await notifyModule.send({
          notify_detail_id: post_id,
          notify_type: 'post',
          title: 'Tin đã bị từ chối',
          message: `Tin "${post.title}" đã bị từ chối.\n${reason}`,
          user_fcm_token: seller.fcm_tokens
        })
      }
      if (seller?.email && seller?.email !== 'Chưa cung cấp')
        mail.sendMail(seller?.email, '[TIN ĐĂNG BỊ TỪ CHỐI PHÊ DUYỆT]', reason)
    }
    res.success({
      message: messages.post.post_denied,
      data: data
    })
  } catch (e) {
    next(e)
  }
}

adminController.lockPost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    let data = await postModule.update({post_id, post_state: postState.LOCKED})
    if (data) {
      await reportModule.removePostReports({post_id})
      let user = await userModule.getUserInfo({user_id: post.seller_id})
      if (user?.fcm_tokens && user?.fcm_tokens.length > 0) {
        await notifyModule.send({
          notify_detail_id: user.user_id,
          notify_type: 'user',
          title: 'Bài đăng đã bị khoá',
          message: `Bài đăng ${post.title} đã bị quản trị viên xoá khỏi bảng tin vì nhận được khiếu nại. Vui lòng kiểm tra mail hoặc liên hệ số điện thoại 0703122871 để biết thêm chi tiết`,
          user_fcm_token: user.fcm_tokens
        })
      }
    }
    res.success({
      message: messages.post.post_deleted,
      data: data
    })

    return
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

    let data = await accountModule.lockAccount({account_id: account.account_id})
    if (data) {
      let user = await userModule.findUserByAccount({
        account_id: account.account_id
      })
      if (user) {
        // await adminModule.closeAllUserPost({user_id: user.user_id})

        if (user?.fcm_tokens && user?.fcm_tokens.length > 0) {
          await notifyModule.send({
            notify_detail_id: user.user_id,
            notify_type: 'user',
            title: 'Tài khoản đã bị khoá',
            message: `Tài khoản của bạn đã bị khoá chức năng đăng bài, kể từ giờ bạn không thể đăng bất kì bài nào. Vui lòng kiểm tra mail hoặc liên hệ số điện thoại 0703122871 để biết thêm chi tiết`,
            user_fcm_token: user.fcm_tokens
          })
        }
        if (user?.email && user?.email !== 'Chưa cung cấp')
          mail.sendMail(user?.email, '[THÔNG BÁO KHOÁ TÀI KHOẢN]', reason)
      }
    }

    res.success({
      message: messages.user.account_locked,
      data: data
    })

    return
  } catch (e) {
    next(e)
  }
}

adminController.unlockAccount = async (req, res, next) => {
  let {username} = req.params
  try {
    let account = await accountModule.findAccountByUsername({username})
    if (!account) throw new NotFound(messages.user.account_not_found)

    let data = await accountModule.unlockAccount({
      account_id: account.account_id
    })
    if (data) {
      let user = await userModule.findUserByAccount({
        account_id: account.account_id
      })
      if (user) {
        // await adminModule.closeAllUserPost({user_id: user.user_id})

        if (user?.fcm_tokens && user?.fcm_tokens.length > 0) {
          await notifyModule.send({
            notify_detail_id: user.user_id,
            notify_type: 'user',
            title: 'Tài khoản đã được mở khoá',
            message: `Tài khoản của bạn đã được mở khoá, bây giờ bạn có thể đăng bài. Vui lòng kiểm tra mail hoặc liên hệ số điện thoại 0703122871 để biết thêm chi tiết`,
            user_fcm_token: user.fcm_tokens
          })
        }
        if (user?.email && user?.email !== 'Chưa cung cấp')
          mail.sendMail(
            user?.email,
            '[THÔNG BÁO MỞ KHOÁ TÀI KHOẢN]',
            'Tài khoản của bạn đã được mở khoá, bây giờ bạn có thể đăng bài. Vui lòng kiểm tra mail hoặc liên hệ số điện thoại 0703122871 để biết thêm chi tiết'
          )
      }
    }

    res.success({
      message: messages.user.account_locked,
      data: data
    })

    return
  } catch (e) {
    next(e)
  }
}

adminController.getReports = async (req, res, next) => {
  try {
    let r = await reportModule.getAll()
    let cur_post_id = ''
    let data = []
    let post = {}
    let reports = []
    let index = -1
    r.map((e) => {
      const {
        post_id,
        report_id,
        contact_info,
        content,
        time_created,
        title,
        default_price,
        sell_address,
        post_state,
        picture
      } = e
      if (e.post_id !== cur_post_id) {
        cur_post_id = e.post_id
        data.push({
          post_id,
          title,
          default_price,
          sell_address,
          post_state,
          picture,
          reports: []
        })
        index += 1
      }
      data[index].reports.push({report_id, contact_info, content, time_created})
    })
    res.success({
      data: data
    })
  } catch (e) {
    next(e)
  }
}

adminController.clearPostReports = async (req, res, next) => {
  let {post_id} = req.params
  try {
    res.success({
      data: await reportModule.removePostReports({post_id})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = adminController
