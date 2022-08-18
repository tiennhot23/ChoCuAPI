const {helper, utils, messages} = require('../common')
const {notifyModule} = require('../modules')
const {BadRequest} = require('../utils/Errors')

const notify = {}

notify.sendSingle = async (req, res, next) => {
  let {notify_detail_id, notify_type, title, message, user_fcm_token} = req.body
  // notify_detail_id = '9edc3410-e26c-4925-8209-c65e2744995e'
  // notify_type = 'new_post'
  // title = 'Thông báo từ server'
  // message = 'Người bạn đang theo dõi vừa đăng bài mới'
  // user_fcm_token =
  //   'fZU_HtyBTK6q0TxcYCLB25:APA91bGKgtOQveCn_aaSo1Gr5O3Q4lcpFcxCYSCqOQjXCPqptsedpO2JaQDowZyP_wvt0EO3FHG40HwrT3YYLNJgUHbPzcvz_cFzk6gn7RyXUA9inJooDrRa_tsU_LE8C85kvteFbYGa'
  try {
    if (!notify_detail_id)
      throw new BadRequest(messages.notify.notify_detail_id_required)
    if (!notify_type) throw new BadRequest(messages.notify.notify_type_required)
    if (!title) throw new BadRequest(messages.notify.title_required)
    if (!message) throw new BadRequest(messages.notify.message_required)
    if (!user_fcm_token)
      throw new BadRequest(messages.notify.user_fcm_token_required)

    await notifyModule.send({
      notify_detail_id,
      notify_type,
      title,
      message,
      user_fcm_token
    })
    res.success({
      message: 'Gửi thông báo thành công',
      data: []
    })
  } catch (e) {
    next(e)
  }
}

module.exports = notify
