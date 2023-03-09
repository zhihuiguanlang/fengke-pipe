const Recorder = require('node-rtsp-recorder').Recorder
const videoInfoService = require('./../services/video-info')
const Stream = require('node-rtsp-stream')
var _ = require('lodash');

module.exports = {

  /**
   * 传入rtsp地址
   * @param  {obejct} ctx 上下文对象
   */
  async getVideoStream(ctx) {
    let params = ctx.request.body;
    stream = new Stream({
      name: 'name',
      streamUrl: params.streamUrl,
      wsPort: params.port,
      ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
      }
    })
  },

  //问题2：系统得到视频解析观看不了
  /**
   * 记录视频流
   * @param  {obejct} ctx 上下文对象
   */
  async getVideoRecord(ctx) {
    let videos = await videoInfoService.getListByIsRecord();
    if (_.size(videos) > 0) {
      videos.forEach(async v => {
        let result = await videoInfoService.setVideoRecordStatusById(v.id);
        if (result.changedRows == 1) {
          var rec = new Recorder({
            url: v.rtsp_address,
            timeLimit: 60, // time in seconds for each segmented video file
            folder: 'E:/video',
            name: 'cam1',
          })
          // Starts Recording
          rec.startRecording();
          setTimeout(() => {
            console.log('Stopping Recording',rec)
            //rec.stopRecording()
            //rec = null
          }, 3000000)
        }
      }
      );
    }
    else{
      ctx.body="暂无可录制的视频"
      return
    }
    ctx.body = "成功"
    return;
  }

}