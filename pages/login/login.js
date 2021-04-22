var util = require('../../utils/util');
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLoginSuccess:true
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://192.168.1.111:8080/user/index',
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            data: {
              code: res.code
            },
            success(res) {
              that.setData({
                isLoginSuccess:true
              })
              console.log(res)
              getApp().globalData.openid = res.data;
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  login1(){
    wx.navigateTo({
      url: '../Index/Index',
    })
  },
  login2(){
    wx.showToast({
      title: '微信授权失败！！！！',
      icon:'none'
    })
  },
  saveHeadImg(){
  console.log('存储头像')
  let token=wx.getStorageSync('userToken')
  let userInfo=wx.getStorageSync('userInfo')
  console.log(userInfo)
  let para={
    token:token,
    headerUrl:userInfo.avatarUrl
  }
  request.send('POST', 'user/headerUrl', para, false, '', (res) => {
    if(res==200){
      console.log('存储头像成功')
    }else{
      console.log('存储头像失败')
    }
    
  }, (fail) => { })
},
  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.saveHeadImg()
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})
