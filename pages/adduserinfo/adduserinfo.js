const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    isfingerPrint: false,    //可否使用指纹识别  默认false
    isfacial: false,          //可否使用人脸识别  默认false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        for (var i in res.supportMode) {
          if (res.supportMode[i] == 'fingerPrint') {
            console.log("支持指纹识别", res.supportMode[i]);
            that.setData({
              isfingerPrint: true
            })
          } else if (res.supportMode[i] == 'facial') {
            console.log("支持人脸识别", res.supportMode[i]);
          }
        }
      }
    })
  },
  //是否可以指纹识别
  checkIsFingerPrint: function () {
    var boole = this.data.isfingerPrint
    var txt = "不可以使用指纹识别"
    if (boole) {
      txt = "可以使用指纹识别"
    }
    show("提示", txt, false);
  },
  //是否可以人脸识别
  checkIsFacial: function () {
    var boole = this.data.isfacial
    var txt = "不可以使用人脸识别"
    if (boole) {
      txt = "可以使用人脸识别"
    }
    function SUCC() {
      console.log("用户点击确定")
    }

    function FAIL() {
      console.log("用户点击取消")
    }

    show("提示", txt, true, SUCC, FAIL);
  },

  //进行指纹识别 录入
  FingerPrint: function () {
    console.log(this.data)
    var that = this;
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: 'boringiii',
      authContent: '请用指纹',
      success(res) {
        // console.log("识别成功", json.cpu_id)
        var json = JSON.parse(res.resultJSON)
        console.log("识别成功", json)
        wx.request({
          url: 'https://nic.fhyiii.cn/nic/xiaocx/addfingerprint.php',
          method:'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data:{
            'user_number': that.data.user.student,
            'fingerprint': json.cpu_id,
          },
          success:function(data){
            console.log(data.data)
            if(data.data.status){
              show("提示", data.data.msg , false);
            }
            // var dataa = JSON.parse(data.data)
          },
          error:function(error){
            console.log(error)
          }
        })
        
      },
      fail(res) {
        console.log("识别失败", res)
        show("提示", "识别失败", false);
      }
    })


  },
  //是否有指纹
  HaveFingerPrint: function () {
    wx.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint',
      success(res) {
        if (res.isEnrolled == 1) {
          show("提示", "有指纹", false);
        } else if (res.isEnrolled == 0) {
          show("提示", "无指纹", false);
        }
      },
      fail(res) {
        show("提示", "异常", fail);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 校验是否登录
    if (app.checkLogin()) {
      // 将缓存里的信息放在data数据里
      this.setData({
        user: app.getLocaStroage()
      })
    }

  }
})


/**
 * 显示提示信息
 * tit 提示的标题
 * msg 提示的内容
 * q   是否有取消按钮（布尔值）
 * succ 用户点击确定的回调（非必须）
 * fail 用户点击取消的回调（非必须）
 *
 */
function show(tit, msg, q, succ, fail) {
  wx.showModal({
    title: tit,
    content: msg,
    showCancel: q,
    success: function (res) {
      if (res.confirm) {
        if (succ) {
          succ();
        }
      } else if (res.cancel) {
        if (fail) {
          fail();
        }
      }
    }
  })
}
