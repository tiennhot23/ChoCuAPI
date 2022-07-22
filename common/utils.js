const jwt = require('jsonwebtoken')
const helper = require('./helper')

module.exports = {
  generateAccessToken: (user) => {
    /**
     * ... jwt.sign(user, ...
     * ERROR: Expected \"payload\" to be a plain object.
     * SOLVE: change oject user to json
     * ... jwt.sign({user}, ...
     */
    return jwt.sign({user}, process.env.ACCESSTOKEN, {expiresIn: '365d'})
  },
  generateRefreshToken: (user) => {
    return jwt.sign({user}, process.env.REFRESHTOKEN)
  },
  generateEndpoint: (title) => {
    try {
      return slugify(title, {lower: true, strict: true})
    } catch (e) {
      return null
    }
  },
  parseQueryParamObjToJson(obj) {
    try {
      return JSON.parse(obj)
    } catch (ignored) {
      return {}
    }
  },
  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  },
  addHours(numOfHours, date = new Date()) {
    /**
     * // 👇️ Add 1 hour to current date
      const result = addHours(1);

      // 👇️ Add 2 hours to another date
      const date = new Date('2022-03-14T09:25:30.820');
      // 👇️ Mon Mar 14 2022 11:25:30
      console.log(addHours(2, date));
     */
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)
    return date
  },
  addMinutes(numOfMinute, date = new Date()) {
    date.setTime(date.getTime() + numOfMinute * 60 * 1000)
    return date
  },
  removeCharAt(str, position) {
    return str.slice(0, position) + str.slice(position + 1)
  }
}
