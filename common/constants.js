const limit_element = 10
const saltRounds = 10
const fileBaseURL = 'http://localhost:3000/file/'
const baseURL = 'https://localhost:3000/'
const max_int = 2e9
const role = {
  deliver: 'deliver',
  customer: 'customer',
  admin: 'admin'
}
const postState = {
  PENDING: 'pending',
  ACTIVE: 'active',
  DELETED: 'deleted',
  EXPIRED: 'expired'
}
const dealState = {
  PENDING: 'pending',
  UNPAID: 'unpaid',
  CONFIRMED: 'confirmed',
  SENDING: 'sending',
  RECEIVED: 'received',
  CANCELED: 'canceled',
  UNRATED: 'unrated',
  DONE: 'done'
}
const notifyType = {
  POST_REMOVED: 'post_removed',
  USER_FOLLOW: 'user_follow',
  NEW_POST: 'new_post',
  DEAL_SUCCESS: 'deal_success',
  NEW_MESSAGE: 'new_message',
  LOCKED_ACCOUNT: 'locked_account',
  GENERAL_NOTFITY: 'general_notify'
}

module.exports = {
  limit_element: limit_element,
  saltRounds: saltRounds,
  fileBaseURL: fileBaseURL,
  baseURL: baseURL,
  max_int: max_int,
  role,
  postState,
  dealState,
  notifyType
}
