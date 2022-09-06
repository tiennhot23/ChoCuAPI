const {helper, utils, messages, constants} = require('../common')
const {role, postState, dealState} = require('../common/constants')
const {
  otpModule,
  userModule,
  fileModule,
  adminModule,
  postModule,
  accountModule,
  dealModule,
  notifyModule
} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const dealController = {}

dealController.getSellHistory = async (req, res, next) => {
  let {user_id} = req.user
  try {
    res.success({
      data: await dealModule.getSellingDeals({seller_id: user_id})
    })
  } catch (e) {
    next(e)
  }
}

dealController.getBuyHistory = async (req, res, next) => {
  let {user_id} = req.user
  try {
    res.success({
      data: await dealModule.getBuyingDeals({buyer_id: user_id})
    })
  } catch (e) {
    next(e)
  }
}

dealController.getDeal = async (req, res, next) => {
  let {user_id} = req.user
  let {deal_id} = req.params
  try {
    let deal = await dealModule.getDeal({deal_id})
    if (!deal) throw new NotFound(messages.deal.not_found)
    if (user_id !== deal.buyer_id && user_id !== deal.seller_id)
      throw new Forbidden(messages.auth.forbidden)
    const buyer = await userModule.getUserInfo({user_id: deal.buyer_id})
    const seller = await userModule.getUserInfo({user_id: deal.seller_id})
    const rating = await dealModule.getRate({deal_id})
    res.success({
      data: {
        deal,
        buyer,
        seller,
        rating
      }
    })
  } catch (e) {
    next(e)
  }
}

dealController.createDeal = async (req, res, next) => {
  let {post_id} = req.params
  let {user_id} = req.user
  let {receive_address, online_deal = false} = req.body
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    if (!receive_address) throw new BadRequest(messages.deal.address_required)
    if (post.post_state === postState.SOLD)
      throw new GeneralError('Mặt hàng này vừa được bán cho người khác')
    if (post.seller_id === user_id) {
      res.success({
        message: messages.deal.can_not_deal_self,
        data: []
      })
    } else {
      res.success({
        message: messages.deal.deal_pending,
        data: await dealModule.createDeal({
          buyer_id: user_id,
          post_id,
          receive_address,
          online_deal
        })
      })
    }
  } catch (e) {
    next(e)
  }
}

dealController.updateDealState = async (req, res, next) => {
  let {deal_id} = req.params
  let {user_id} = req.user
  let {deal_state} = req.body
  try {
    if (!deal_state) throw new BadRequest(messages.deal.state_required)
    let deal = await dealModule.getDeal({deal_id})
    if (!deal) throw new NotFound(messages.deal.not_found)
    switch (deal_state) {
      case dealState.CANCELED: {
        if (deal.deal_state === dealState.PENDING) {
          if (user_id !== deal.seller_id && user_id != deal.buyer_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          await postModule.update({
            post_id: deal.post_id,
            post_state: postState.ACTIVE
          })

          let buyer = await userModule.getUserInfo({user_id: deal.buyer_id})
          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token =
            user_id === deal.seller_id ? buyer.fcm_tokens : seller.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Giao dịch thất bại',
              message: `Giao dịch mặt hàng "${deal.title}" đã bị huỷ bởi ${
                user_id === deal.seller_id ? 'người bán' : 'người mua'
              }`,
              user_fcm_token:
                user_id === deal.seller_id
                  ? buyer.fcm_tokens
                  : seller.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_canceled,
            data: data
          })

          return
        } else if (deal.deal_state === dealState.DELIVERING) {
          if (user_id !== deal.seller_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          await postModule.update({
            post_id: deal.post_id,
            post_state: postState.ACTIVE
          })
          let buyer = await userModule.getUserInfo({user_id: deal.buyer_id})
          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token =
            user_id === deal.seller_id ? buyer.fcm_tokens : seller.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Giao dịch thất bại',
              message: `Giao dịch mặt hàng "${deal.title}" đã bị huỷ bởi ${
                user_id === deal.seller_id ? 'người bán' : 'người mua'
              }`,
              user_fcm_token:
                user_id === deal.seller_id
                  ? buyer.fcm_tokens
                  : seller.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_canceled,
            data: data
          })

          return
        } else {
          throw new GeneralError('Không thể huỷ giao dịch lúc này')
        }
      }
      case dealState.CONFIRMED: {
        if (deal.deal_state === dealState.PENDING) {
          if (user_id !== deal.seller_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          await postModule.update({
            post_id: deal.post_id,
            post_state: postState.SOLD
          })

          let buyer = await userModule.getUserInfo({user_id: deal.buyer_id})
          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token = buyer.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Giao dịch đã được xác nhận',
              message: `Giao dịch mặt hàng "${deal.title}" đã được xác nhận bởi người bán`,
              user_fcm_token: buyer.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_confirmed,
            data: data
          })

          return
        } else {
          throw new GeneralError(messages.deal.deal_not_pending)
        }
      }
      case dealState.DELIVERING: {
        if (deal.deal_state === dealState.CONFIRMED) {
          if (user_id !== deal.seller_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          let buyer = await userModule.getUserInfo({user_id: deal.buyer_id})
          let user_fcm_token = buyer.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Đang giao hàng',
              message: `Mặt hàng "${deal.title}" đang được giao đến người mua`,
              user_fcm_token: buyer.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_delivering,
            data: data
          })

          return
        } else {
          throw new GeneralError(messages.deal.deal_not_confirmed)
        }
      }
      case dealState.DELIVERED: {
        if (deal.deal_state === dealState.DELIVERING) {
          if (user_id !== deal.buyer_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token = seller.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Giao dịch thành công',
              message: `Mặt hàng "${deal.title}" đã được giao thành công tới người mua`,
              user_fcm_token: seller.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_delivered,
            data: data
          })

          return
        } else {
          throw new GeneralError(messages.deal.deal_not_delivering)
        }
      }
      case dealState.DENIED: {
        if (deal.deal_state === dealState.DELIVERING) {
          if (user_id !== deal.buyer_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          await postModule.update({
            post_id: deal.post_id,
            post_state: postState.ACTIVE
          })

          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token = seller.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Giao dịch thất bại',
              message: `Mặt hàng "${deal.title}" đã bị người mua từ chối nhận`,
              user_fcm_token: seller.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_denied,
            data: data
          })

          return
        } else {
          throw new GeneralError(messages.deal.deal_not_delivering)
        }
      }
      case dealState.DONE: {
        if (deal.deal_state === dealState.DELIVERED) {
          if (user_id !== deal.buyer_id)
            throw new Forbidden(messages.auth.forbidden)
          let data = await dealModule.update({deal_id, deal_state})
          let seller = await userModule.getUserInfo({user_id: deal.seller_id})
          let user_fcm_token = seller.fcm_tokens
          if (user_fcm_token && user_fcm_token.length > 0)
            await notifyModule.send({
              notify_detail_id: deal_id,
              notify_type: 'deal',
              title: 'Người mua đánh giá giao dịch',
              message: `Giao dịch mặt hàng "${deal.title}" đã được đánh giá bởi người mua`,
              user_fcm_token: seller.fcm_tokens
            })
          res.success({
            message: messages.deal.deal_done,
            data: data
          })

          return
        } else {
          throw new GeneralError(messages.deal.deal_not_received)
        }
      }
      default:
        throw new GeneralError(messages.deal.state_incorrect)
    }
  } catch (e) {
    console.log(e)
    next(e)
  }
}

dealController.rateDeal = async (req, res, next) => {
  let {deal_id} = req.params
  let {rate_numb, rate_content} = req.body
  let {user_id} = req.user
  try {
    let deal = await dealModule.getDeal({deal_id})
    if (!deal) throw new NotFound(messages.deal.not_found)
    if (user_id !== deal.buyer_id)
      throw new Forbidden(messages.deal.rate_forbidden)
    if (deal.deal_state === dealState.DONE)
      throw new GeneralError(messages.deal.deal_done)
    if (deal.deal_state !== dealState.DELIVERED)
      throw new GeneralError(messages.deal.can_not_rate)
    if (!rate_numb) throw new BadRequest(messages.deal.rate_numb_required)
    if (!rate_content) throw new BadRequest(messages.deal.rate_content_required)

    let rate = await dealModule.rateDeal({deal_id, rate_numb, rate_content})
    if (rate) await dealModule.update({deal_id, deal_state: dealState.DONE})

    let seller = await userModule.getUserInfo({user_id: deal.seller_id})

    let rateState = await dealModule.getUserRateStat({user_id: seller.user_id})
    if (seller) {
      let new_user_rating =
        rateState.rate_count !== 0
          ? rateState.rate_sum / rateState.rate_count
          : 0

      console.log([new_user_rating, rateState])
      new_user_rating = new_user_rating.toFixed(1)
      seller.rating = Number(new_user_rating)
      await userModule.updateRating({
        user_id: seller.user_id,
        rating: seller.rating
      })
      let user_fcm_token = seller.fcm_tokens
      if (user_fcm_token && user_fcm_token.length > 0)
        await notifyModule.send({
          notify_detail_id: deal_id,
          notify_type: 'deal',
          title: 'Người mua đánh giá giao dịch',
          message: `Giao dịch mặt hàng "${deal.title}" đã được đánh giá bởi người mua`,
          user_fcm_token: seller.fcm_tokens
        })
    }

    res.success({
      data: rate
    })
  } catch (e) {
    next(e)
  }
}

dealController.getRating = async (req, res, next) => {
  let {deal_id} = req.params
  try {
    res.success({
      data: await dealModule.getRate({deal_id})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = dealController
