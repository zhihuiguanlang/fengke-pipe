const videoModel = require('./../models/video-info')

const video = {

  /**
   * 查询list
   * @param  {object}      video信息
   * @return {object}      创建结果
   */
  async getListByIsRecord() {
    let result = await videoModel.getListByIsRecord()
    return result
  },

    /**
   * 设置视频状态
   * @param  {object}      
   * @return {object}      设置结果
   */
  async setVideoRecordStatusById(id) {
    let result = await videoModel.setVideoRecordStatusById(id)
    return result
  },

//   /**
//    * 查找存在用户信息
//    * @param  {object} formData 查找的表单数据
//    * @return {object|null}      查找结果
//    */
//   async getExistOne( formData ) {
//     let resultData = await videoModel.getExistOne({
//       'email': formData.email,
//       'name': formData.userName
//     })
//     return resultData
//   },

  
}

module.exports = video