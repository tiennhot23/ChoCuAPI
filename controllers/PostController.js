const {helper, utils, messages} = require('../common')
const {role, postState} = require('../common/constants')
const {
  postModule,
  userModule,
  categoryModule,
  fileModule,
  notifyModule,
  reportModule
} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const controller = {}

controller.getPosts = async (req, res, next) => {
  let {page, location, key_search, category} = req.body
  if (key_search) key_search = helper.removeAccent(key_search).toLowerCase()
  try {
    res.success({
      data: await postModule.get({key_search, location, category})
    })
  } catch (e) {
    next(e)
  }
}

controller.getUserPosts = async (req, res, next) => {
  let {user_id} = req.user
  try {
    res.success({
      data: await postModule.getUserPosts({user_id})
    })
  } catch (e) {
    next(e)
  }
}

controller.getPost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    // if (post.post_state === 'deleted')
    //   throw new NotFound(messages.post.not_found)
    let user = await userModule.getUserInfo({user_id: post.seller_id})
    let category = await postModule.getPostCate({category_id: post.category_id})
    let details = await postModule.getPostCateDetails({post_id})
    res.success({
      data: {
        post,
        user,
        category,
        details
      }
    })
  } catch (e) {
    next(e)
  }
}

controller.getAllRating = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    let r = await postModule.getAllRating({post_id})
    r = r.map((e) => {
      return {
        user: {
          user_id: e.user_id,
          name: e.name,
          avatar: e.avatar,
          phone: e.phone
        },
        rating: {
          deal_id: e.deal_id,
          rate_numb: e.rate_numb,
          time_created: e.time_created,
          rate_content: e.rate_content
        }
      }
    })
    res.success({
      data: r
    })
  } catch (e) {
    next(e)
  }
}

controller.createPost = async (req, res, next) => {
  console.log(req.body)
  let {
    title,
    default_price,
    sell_address,
    description,
    picture = [],
    online_payment,
    category_id,
    details = []
  } = req.body
  let isUploadFile =
    req.files && req.files.length > 0 && req.files[0].fieldname === 'picture'
  let {user_id} = req.user
  try {
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
    }
    if (!helper.isValidObject(title))
      throw new BadRequest(messages.post.title_required)
    if (!helper.isValidObject(default_price))
      throw new BadRequest(messages.post.price_required)
    if (!helper.isValidObject(sell_address))
      throw new BadRequest(messages.post.address_required)
    if (!helper.isValidObject(category_id))
      throw new BadRequest(messages.post.category_required)
    if (!helper.isArray(details))
      throw new BadRequest(messages.post.details_required)

    let {post_turn} = await userModule.getUserPostTurn({user_id})
    if (post_turn <= 0) {
      res.success({message: messages.user.post_turn_out})
    }

    let post = await postModule.add({
      seller_id: user_id,
      title,
      default_price,
      sell_address,
      description,
      picture,
      category_id,
      online_payment
    })

    if (post) {
      await userModule.decreasePostTurn({user_id})
      await postModule.addPostCateDetails({
        post_id: post.post_id,
        category_id,
        details
      })
      if (isUploadFile) {
        picture = await fileModule.upload_multi_with_index(
          req.files,
          `post/${post.post_id}/`
        )
        post = await postModule.update({
          post_id: post.post_id,
          picture
        })
      }

      res.success({
        data: post
      })
      // let followers = await userModule.getUserFollower({user_id: user_id})
      // let followers_token = []
      // followers.map((e) => {
      //   followers_token.concat(e.fcm_tokens)
      // })
      // await notifyModule.send({
      //   notify_detail_id: post.post_id,
      //   notify_type: 'post',
      //   title: 'Tin đăng mới',
      //   message: `Người mà bạn đang theo dõi vừa đăng tin mới. Vào xem ngay nào`,
      //   user_fcm_token: followers_token
      // })
      return
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

controller.editPost = async (req, res, next) => {
  console.log(req.body)
  let {
    title,
    default_price,
    sell_address,
    description,
    default_picture = [],
    online_payment,
    category_id,
    details = []
  } = req.body
  if (helper.isString(default_picture)) default_picture = [default_picture]
  let {post_id} = req.params
  let isUploadFile =
    req.files && req.files.length > 0 && req.files[0].fieldname === 'picture'
  let {user_id} = req.user
  try {
    let post = await postModule.getPost({post_id})
    let isPostActive =
      post.post_state !== postState.DENIED ||
      post.post_state !== postState.PENDING
    if (!post) throw new NotFound(messages.post.not_found)
    if (post.post_state === postState.LOCKED)
      throw new GeneralError(messages.post.post_deleted)
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
    }
    if (!helper.isValidObject(title) && !isPostActive)
      throw new BadRequest(messages.post.title_required)
    if (!helper.isValidObject(default_price))
      throw new BadRequest(messages.post.price_required)
    if (!helper.isValidObject(sell_address))
      throw new BadRequest(messages.post.address_required)
    if (!helper.isValidObject(category_id) && !isPostActive)
      throw new BadRequest(messages.post.category_required)
    if (!helper.isArray(details))
      throw new BadRequest(messages.post.details_required)

    let {post_turn} = await userModule.getUserPostTurn({user_id})
    if (post_turn <= 0) {
      res.success({message: messages.user.post_turn_out})
    }

    post = await postModule.update({
      post_id,
      title: isPostActive ? null : title,
      default_price,
      sell_address,
      description,
      picture: default_picture,
      online_payment,
      category_id: isPostActive ? null : category_id,
      post_state: postState.PENDING
    })

    if (post) {
      if (isPostActive) await userModule.decreasePostTurn({user_id})
      await postModule.removePostCateDetails({post_id: post.post_id})
      await postModule.addPostCateDetails({
        post_id: post.post_id,
        category_id,
        details
      })
      if (isUploadFile) {
        let picture = await fileModule.upload_multi_with_index(
          req.files,
          `post/${post.post_id}/`
        )
        console.log([...default_picture, picture])
        post = await postModule.update({
          post_id: post.post_id,
          picture: [...default_picture, ...picture]
        })
      }

      res.success({
        data: post
      })

      return
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

controller.endPost = async (req, res, next) => {
  let {post_id} = req.params
  let {user_id} = req.user
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    // if (post.post_state === postState.LOCKED)
    //   throw new GeneralError(messages.post.post_deleted)
    // if (post.post_state === postState.PENDING)
    //   throw new GeneralError(messages.post.post_pending)
    if (post.post_state !== postState.ACTIVE)
      throw new GeneralError(messages.post.post_not_active)
    if (user_id !== post.seller_id) throw new Forbidden()
    res.success({
      message: messages.post.post_expired,
      data: await postModule.update({post_id, post_state: postState.HIDDEN})
    })
  } catch (e) {
    next(e)
  }
}

controller.repostPost = async (req, res, next) => {
  let {post_id} = req.params
  let {user_id} = req.user
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    // if (post.post_state === postState.LOCKED)
    //   throw new GeneralError(messages.post.post_deleted)
    // if (post.post_state === postState.PENDING)
    //   throw new GeneralError(messages.post.post_pending)
    if (post.post_state !== postState.HIDDEN)
      throw new GeneralError(messages.post.post_not_hide)
    if (user_id !== post.seller_id) throw new Forbidden()

    let {post_turn} = await userModule.getUserPostTurn({user_id})
    if (post_turn <= 0) {
      res.success({message: messages.user.post_turn_out})
    }

    let data = await postModule.update({post_id, post_state: postState.ACTIVE})
    if (data) {
      await userModule.decreasePostTurn({user_id})
    }

    res.success({
      message: messages.post.post_actived,
      data: data
    })
  } catch (e) {
    next(e)
  }
}

controller.reportPost = async (req, res, next) => {
  let {post_id} = req.params
  let {contact_info = '', content = ''} = req.body
  try {
    res.success({
      data: await reportModule.createReport({post_id, contact_info, content})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = controller
