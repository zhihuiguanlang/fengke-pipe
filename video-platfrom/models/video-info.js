const dbUtils = require('./../utils/db-utils')
const videoInfo = {

    /**
     * 数据库创建用户
     * @param  {object} model 用户数据模型
     * @return {object}       mysql执行结果
     */
    async create ( model ) {
      let result = await dbUtils.insertData('video_info', model )
      return result
    },
  
    /**
     * 查找一个存在用户的数据
     * @param  {obejct} options 查找条件参数
     * @return {object|null}        查找结果
     */
    async getExistOne(options ) {
      let _sql = `
      SELECT * from video_info
        where id="${options.id}" or ip_address="${options.ipAddress}"
        limit 1`
      let result = await dbUtils.query( _sql )
      if ( Array.isArray(result) && result.length > 0 ) {
        result = result[0]
      } else {
        result = null
      }
      return result
    },
  
      /**
     * 查询视频需要记录的列表
     * @return {object}       mysql执行结果
     */
    async getListByIsRecord () {
      let _sql = `
      SELECT * from video_info where is_record = 1  and status = 0`
  
      let result = await dbUtils.query( _sql )
      if ( Array.isArray(result) && result.length > 0 ) {
        result = result
      } else {
        result = null
      }
      return result
      },


         /**
     * 设置视频需要记录的的状态为正在记录
     * @return {object}       mysql执行结果
     */
    async setVideoRecordStatusById (id) {
      let _sql = `UPDATE video_info SET status= 1 WHERE id=`+id
      let result = await dbUtils.query( _sql)
      return result
      },

  }
  
  
  module.exports = videoInfo