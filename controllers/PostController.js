const {helper, utils, messages} = require('../common')
const {role, postState} = require('../common/constants')
const {
  postModule,
  userModule,
  categoryModule,
  fileModule
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

controller.getPost = async (req, res, next) => {
  let {post_id} = req.params
  try {
    let post = await postModule.getPost({post_id})
    if (!post) throw new NotFound(messages.post.not_found)
    let user = await userModule.getUserInfo({user_id: post.seller_id})
    let category = await postModule.getPostCate({post_id})
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

controller.createPost = async (req, res, next) => {
  let {
    title,
    default_price,
    sell_address,
    description,
    picture = [],
    online_payment,
    category_id,
    details
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

    if (
      !(await categoryModule.check_required_details({
        category_id,
        details
      }))
    )
      throw new BadRequest(messages.post.missing_required_details)

    let post = await postModule.add({
      seller_id: user_id,
      title,
      default_price,
      sell_address,
      description,
      picture,
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
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

module.exports = controller
