/**
 * restful video 子路由
 */

const router = require('koa-router')()
const video =require('./../controller/index')

router.post('/getVideoStream', video.getVideoStream)
router.post('/getVideoRecord', video.getVideoRecord)



 
  
module.exports = router