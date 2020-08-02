// pages/cutFace/cutFace.js
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;
import WeCropper from '../../components/we-cropper/we-cropper.js';
let Ajax = require("../../ajax/index");
let Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width, // 画布宽度
      height, // 画布高度
      src: '',
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
          x: (width - 100) / 2, // 裁剪框x轴起点
          y: (width - 100) / 2, // 裁剪框y轴起点
          width: 100, // 裁剪框宽度
          height: 100 // 裁剪框高度
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      
      let cropperOpt = this.data.cropperOpt;
      cropperOpt.src = memberInfo.avatarPhoto;
      console.log(cropperOpt.src);
      if (cropperOpt.src) {
        this.cropper = new WeCropper(cropperOpt)
          .on('ready', (ctx) => {
            console.log(`wecropper is ready for work!`)
          })
          .on('beforeImageLoad', (ctx) => {
            wx.showToast({
              title: '上传中',
              icon: 'loading',
              duration: 3000
            })
          })
          .on('imageLoad', (ctx) => {
            wx.hideToast()
          });
        // this.cropper.pushOrign(cropperOpt.src);
      }

      return Promise.resolve(response);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 插件通过touchStart、touchMove、touchEnd方法来接收事件对象。
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
      this.cropper.touchMove(e)
  },
  touchEnd(e) {
      this.cropper.touchEnd(e)
  },
  // 自定义裁剪页面的布局中，可以重新选择图片
  uploadTap() {
      const self = this
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success(res) {
              const src = res.tempFilePaths[0]
              self.cropper.pushOrign(src);
          }
      })
  },
  // 生成图片
  getCropperImage(){
      this.cropper.getCropperImage(tempFilePath => {
          try{
            // tempFilePath 为裁剪后的图片临时路径
          if (tempFilePath) {
            // console.log("tempFilePath", tempFilePath);
              // 拿到裁剪后的图片路径的操作
              Fai.uploadFile({
                url:'/ajax/user/userInfo?cmd=uploadHeadImg',
                filePath: tempFilePath,
                name: 'avatarPhotoFile',
                beforeConsume:Toast.clear,
                success:(response)=>{
                  let result = response.data;
                  if(result.success){
                    this.cropper.pushOrign(result.data.avatarPhotoPath);
                    Toast.success(result.msg);
                  }else{
                    Toast.fail(result.msg);
                  }
                },
                onProgressUpdate: (progress)=>{
                  console.log('progress', progress);
                  Toast.loading({
                    message:`图片正在上传...${progress.progress}%`,
                    duration: 0
                  });
                }
              })
          }else{
              console.log('获取图片地址失败，请稍后重试')
          }
          }catch(e){
            console.log("cutFace error", e);
          }
      })
  }

})