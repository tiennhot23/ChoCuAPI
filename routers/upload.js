const express = require('express')
const multer = require('multer')

const {messages} = require('../common')
const {fileModule} = require('../modules')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage()
})

router.post('/single', upload.any('file'), async (req, res, next) => {
  if (
    !req.files ||
    req.files.length == 0 ||
    req.files[0].fieldname !== 'file'
  ) {
    return res.status(400).json({
      status: 'fail',
      code: 400,
      message: messages.file.not_exist,
      data: []
    })
  }

  const url = await fileModule.upload_single(req.files[0], '')

  res.send(url)
})

module.exports = router
