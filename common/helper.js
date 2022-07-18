module.exports = {
  /* data type */
  isObject: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Object
  },

  isArray: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Array
  },

  isBoolean: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Boolean
  },

  isFunction: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Function
  },

  isError: (obj) => {
    return obj && obj.stack && obj.message && obj.constructor === Error
  },

  isNumber: (obj) => {
    return (
      obj !== undefined &&
      obj !== null &&
      !Number.isNaN(obj) &&
      obj.constructor === Number
    )
  },

  isString: (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === String
  },

  isJSON: (str) => {
    try {
      return JSON.parse(str) && !!str
    } catch (e) {
      return false
    }
  },

  clone: (obj) => {
    const objStr = JSON.stringify(obj)
    return JSON.parse(objStr)
  },

  isInstanced: (obj) => {
    if (obj === undefined || obj === null) {
      return false
    }
    if (isArray(obj)) {
      return false
    }
    if (isBoolean(obj)) {
      return false
    }
    if (isFunction(obj)) {
      return false
    }
    if (isNumber(obj)) {
      return false
    }
    if (isObject(obj)) {
      return false
    }
    if (isString(obj)) {
      return false
    }
    return true
  },

  isEmpty: (obj) => {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  },

  isEmptyObject: (obj) => isEmpty(obj),
  isEmptyString: (str) => isString(str) && str.length === 0,
  isEmptyArray: (arr) => isArray(arr) && arr.length === 0,
  isNonEmptyString: (str) => isString(str) && str.length > 0,
  isNonEmptyArray: (arr) => isArray(arr) && arr.length > 0,

  isValidObject: (object) => {
    return object !== undefined && object !== null
  },

  hasProperty: (object, property) => {
    return isValidObject(object) && object.hasOwnProperty(property)
  },

  /* timer */

  sleep: (ms) => {
    return new Promise((r) => setTimeout(r, ms))
  },

  /* format */

  /* uuid */

  /* image */

  scaleImage: (image) => {
    // eslint-disable-next-line no-shadow
    const {width, height} = image
    const max = 2048
    let w = width
    let h = height
    if (width > height) {
      // 'landscape'
      if (w > max) {
        w = max
        h = (max * height) / width
      }
    } else if (width < height) {
      // 'portrait';
      if (h > max) {
        h = max
        w = (max * width) / height
      }
    } else {
      // orientation = 'event';
      w = max
      h = (max * height) / width
    }
    return Object.assign(image, {width: w, height: h})
  },

  resizeImage: ({width, height, uri}) => {},

  /* string */

  removeAccent: (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    str = str.replace(/Đ/g, 'D')
    return str
  },

  /* date */

  /* regex & validate */

  isValidatePhonePrefix: (phone) => {
    const regExpPhoneRefix =
      /^010|011|012|0120|0121|0122|0123|0124|0125|0126|0127|0128|0129|015|016|0161|0162|0163|0164|0165|0166|0167|0168|0169|017|018|0186|0188|0197|0198|0199|020|0208|0210|0214|0220|0225|0228|0232|0236|0238|0243|0248|025|0251|0252|0254|0255|0258|0260|0262|0263|0269|027|0270|0271|0272|0275|0277|028|0282|0283|0285|0286|0291|0296|030|031|032|033|034|0342|035|036|037|038|039|051|052|0522|053|055|0552|056|057|058|059|060|061|066|067|0673|068|069|070|071|074|075|076|077|078|079|080|081|082|083|084|085|086|087|088|089|090|091|092|093|094|095|096|097|098|099|190|9282/
    return regExpPhoneRefix.test(phone)
  },

  isValidatePhone: (phone) => {
    const regexPhone = /^[0][\d]{9}$/
    return regexPhone.test(phone)
  },

  isValidOTP: (otp) => {
    const regexOTP = /[0-9]{6}$/
    return regexOTP.test(otp)
  },

  isValidPassword: (password) => {
    /**Minimum eight characters, at least one letter, one number and one special character */
    const regexPassword = /^(?=.{10,}$)(?=.*[A-Za-z])(?=.*[0-9])(?=.*\W).*$/
    return regexPassword.test(password)
  }

  /* convert */
}
