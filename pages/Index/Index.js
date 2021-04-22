Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  GoPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
  camera(){
    wx.chooseImage({
      count: 1,
      success (res) {
       
            wx.navigateTo({
              url: '../report/report',
            })
          }
        
      
    })
  },
})
