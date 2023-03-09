const router = require('koa-router')()
const video = require('./video')

router.use('/video', video.routes(), video.allowedMethods())

module.exports = router
