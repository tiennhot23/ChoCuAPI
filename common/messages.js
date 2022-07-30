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
    otp_verified: 'Xác thực OTP thành công',
    otp_created: 'Tạo mã OTP thành công'
  },
  category: {
    id_required: 'Yêu cầu cung cấp mã danh mục',
    title_required: 'Yêu cầu cung cấp tiểu đề danh mục',
    icon_required: 'Yêu cầu cung cáp icon danh mục',
    not_found: 'Không tìm thấy danh mục',
    details_id_required: 'Yêu cầu cung cấp mã chi tiết'
  },
  details: {
    id_required: 'Yêu cầu cung cấp mã chi tiết',
    title_required: 'Yêu cầu cung cấp nhãn chi tiết',
    icon_required: 'Yêu cầu cung cáp icon chi tiết',
    not_found: 'Không tìm thấy chi tiết'
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
    create_account_failed: 'Xảy ra lỗi không thể tạo tài khoản',
    create_account_success: 'Tạo tài khoản thành công',
    username_required: 'Yêu cầu cung cấp tên đăng nhập',
    password_reseted: 'Mật khẩu đã được cập nhật',

    post_turn_out: 'Hết lượt đăng bài',

    login_success: 'Đăng nhập thành công',
    logout_success: 'Đăng xuất thành công',
    add_success: 'Thêm thành công',
    update_success: 'Cập nhật thành công',
    delete_success: 'Xoá thành công',
    account_locked: 'Tài khoản này cùng toàn bộ dữ liệu liên qan đã bị xóa.',
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
  post: {
    title_required: 'Yêu cầu tiểu đề bài đăng',
    price_required: 'Yêu cầu giá sản phẩm',
    address_required: 'Yêu cầu địa chỉ bán',
    picture_required: 'Yêu cầu tối đa 1 ảnh',
    category_required: 'Yêu cầu mã danh mục',
    details_required: 'Yêu cầu danh sách thông tin chi tiết',
    missing_required_details: 'Thiếu các chi tiết bắt buộc',
    not_found: 'Không tìm thấy bài đăng này.'
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
    something_wrong: 'Lỗi không xác định',
    add_success: 'Thêm thành công',
    update_success: 'Cập nhật thành công',
    delete_success: 'Xoá thành công',
    image_invalid: 'File ảnh không hợp lệ'
  }
}
