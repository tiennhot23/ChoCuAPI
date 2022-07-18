module.exports = {
  location: {
    province_required: 'Yêu cầu cung cấp tên tỉnh/thành phố',
    district_required: 'Yêu cầu cung cấp tên quận/huyện',
    ward_required: 'Yêu cầu cung cấp tên phường/xã'
  },
  otp: {
    phone_required: 'Yêu cầu cung cấp số điện thoại',
    otp_required: 'Yêu cầu cung cấp mã otp',
    phone_invalid: 'Số điện thoại không phù hợp',
    otp_invalid: 'Mã OTP không đúng định dạng',
    otp_expired: 'Mã OTP không chính xác hoặc đã hết hiệu lực',
    otp_verified: 'Xác thực OTP thành công'
  },
  file: {
    not_exist: 'File không tồn tại',
    choose_file: 'Vui lòng chọn file'
  },
  user: {
    phone_required: 'Yêu cầu cung cấp số điện thoại',
    phone_invalid: 'Số điện thoại không phù hợp',
    password_required: 'Yêu cầu cung cấp mật khẩu',
    password_invalid:
      'Mật khẩu phải ít nhất 8 ký tự, một chữ cái, một số và một ký tự đặc biệt',

    login_success: 'Đăng nhập thành công',
    add_success: 'Thêm thành công',
    update_success: 'Cập nhật thành công',
    password_updated: 'Mật khẩ đã được cập nhật',
    delete_success: 'Tài khoản này cùng toàn bộ dữ liệu liên qan đã bị xóa.',
    registed_success: 'Đăng kí thành công',
    registed_fail: 'Đăng kí thất bại',
    not_found: 'User không tồn tại',
    no_history_found: 'Không tìm thấy lịch sử xem nào',
    missing_username: 'Thiếu username',
    missing_password: 'Thiếu password',
    missing_avatar: 'Thiếu avatar',
    missing_email: 'Thiếu email',
    missing_status: 'Thiếu status',
    missing_role: 'Thiếu role',
    avatar_invalid: 'Ảnh đại diện không đúng định dạng',
    incorrect_account: 'Username và password không trùng khớp',
    email_exist: 'Email đã được sử dụng',
    email_veified: 'Email đã được xác minh',
    followed_book: 'Đã follow sách',
    unfollowed_book: 'Đã unfollow sách',
    user_banned: 'User đã bị ban vô thời hạn',
    user_unbanned: 'User đã được ân xá',
    can_not_follow_book: 'Không thể follow sách',
    can_not_unfollow_book: 'Không thể unfollow sách',
    can_not_ban_user: 'Không thể ban user này',
    can_not_unban_user: 'Không thể unban user này',
    account_pk: 'Username đã được sử dụng',
    status_constraint: 'Trạng thái của user là -1: banned, 1: default',
    role_constraint: 'Quyền của user là 0: user hoặc 1: admin',
    book_follows_pk: 'Sách đã được follow bởi user này',
    book_fk: 'Sách không tồn tại',
    username_fk: 'User này không khả dụng'
  },
  history: {
    add_success: 'Thêm thành công',
    update_success: 'Cập nhật thành công',
    delete_all: 'Đã xoá toàn bộ lịch sử đọc',
    delete_success: 'Xoá thành công',
    not_found: 'Không tìm thấy lịch sử đọc nào'
  },
  auth: {
    unauthorized: 'Cần tài khoản để có thể thực hiện chức năng này',
    forbidden: 'Tài khoản không được phép thực hiện chức năng này',
    verify_email: 'Vui lòng vào email vừa đăng kí để xác minh',
    token_expired: 'Token này đã hết hạn sử dụng',
    token_invalid: 'Token không khả dụng'
  },
  encrypt: {
    password_required: 'Yêu cầu password'
  },
  constraint: {
    username_unique: 'Tên đăng nhập/số điên thoại đã tồn tại',
    account_role_fk: 'Không tìm thấy quyền tài khoản này'
  },
  common: {
    something_wrong: 'Lỗi không xác định'
  }
}
