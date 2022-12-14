// pages/faultInfo/faultInfo.js
const app = getApp();

//查询ID 获取电信号码 去查询
function searchId(dx_uid, that) {
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/dx/searchID',  //查询设备IP 设备端口 MAC
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      id: dx_uid,
      user: that.data.user
    },
    success: function (res) {
      console.log(res)
      if (res.data.user_number != '') {
        search8M(res.data.user_number, that)
      }

    },
    fail: function (err) {
      console.log(err)
    }
  })
}
//查询故障图片
function searchPic(that,fault_id){
  that.setData({
    loading:true
  })
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/searchPic',
    method: 'POST', //必须大写哦        
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
   },
    dataType: "json",
    data: {
      fault_id: fault_id
    },
    success: function (res) {
      // console.log(res)
      if(res.data.status){
        if (res.data.msg.pic == null){
          that.setData({
            images: '',
            loading: false
          })
        }else{
          var arr = res.data.msg.pic.split(',');
          that.setData({
            images: arr,
            loading: false
          })
        }
        
      }else{
        that.setData({
          loading: false
        })
      }
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
// 查询在线
function searchUserOnline(that, userid) {
  that.setData({
    loading: true
  })
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/searchUserOnline',
    method: 'POST', //必须大写哦        
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    dataType: "json",
    data: {
      userid: userid
    },
    success: function (res) {
      if (res.data.status) {
        that.setData({
          ['user.status']: res.data.ip,
          loading:false
        })
      }else{
        that.setData({
          loading: false
        })
      }
    },
    fail: function (res) {
      console.log(res)
      that.setData({
        loading: false
      })
    }
  })
}
// 查询是否被接了
function searchIfC(that, fault_id) {
  that.setData({
    loading: true
  })
  var postman = wx.getStorageSync('user_number')
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/searchIfC',
    method: 'POST', //必须大写哦        
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    dataType: "json",
    data: {
      fault_id: fault_id
    },
    success: function (res) {
      if (res.data.status) {
        that.setData({  //判断是否被接
          tip: true
        })
        if (res.data.msg[0].fixperson == postman) { //判断是当前用户所接
          that.setData({
            newuser: true,
            loading:false
          })
        }
      }else{
        that.setData({
          loading: false
        })
      }
    },
    fail: function (res) {
      console.log(res)
      that.setData({
        loading: false
      })
    }
  })
}
// 查询是否当前用户完成了
function searchIfsuccess(that, fault_id) {
  that.setData({
    loading: true
  })
  var postman = wx.getStorageSync('user_number')
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/searchIfsuccess',
    method: 'POST', //必须大写哦        
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    dataType: "json",
    data: {
      postman: postman,
      fault_id: fault_id
    },
    success: function (res) {
      if (res.data.status) {
        that.setData({
          checksuccess: true,
          loading:false
        })
      }
    },
    fail: function (res) {
      console.log(res)
      that.setData({
        loading: false
      })
    }
  })
}


//8M 查名字 ID
function searchName(stu_name, that) {
  console.log(that.data)

  that.setData({
    loading: true
  })
  var dx = that.data.dx
  var username = wx.getStorageSync('user_name')
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchName',  //
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      info: stu_name,
      user: username
    },
    //20175533426 冯锶琪
    success: function (res) {
      if (res.data.uid != null){
        searchId(res.data.uid,that)
      }
      
    },
    // fail:function(){
    //   that.handleError()
    // }
  })
}

//学号 电信8M
function search8M(user_number, that) {
  console.log(that.data)
  that.setData({
    loading: true
  })
  var dx1 = that.data.dx1
  var username = wx.getStorageSync('user_name')
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchDx',  //查询设备IP 设备端口 MAC
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      info: user_number,
      user: username
    },
    //20175533426
    success: function (res) {
      console.log(res)
      if (res.data.userid != "查询结果为空") { // 判断是否查询到
        that.setData({
          dx: res.data
        })
      }
      that.setData({
        loading: false
      })
      // console.log(dx1)
    }
  })
}
//学号 电信2M
function searchNumber(user_number, that) {
  that.setData({
    loading: true
  })
  var dx1 = that.data.dx1
  var username = wx.getStorageSync('user_name')
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchDx',  //查询设备IP 设备端口 MAC
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
   },
    method: 'POST',
    data: {
      info: user_number,
      user: username
    },
    //20175533426
    success: function (res) {
      if (res.data.userid != "查询结果为空") { // 判断是否查询到
        that.setData({
          dx1: res.data
        })
      }
      that.setData({
        loading: false
      })
      // console.log(dx1)
    }
  })
}

//查询学生信息，姓名，学号，班级，身份证
function searchInfo(user_number, that){
  that.setData({
    loading: true
  })
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/StudentInfo',  //查询设备IP 设备端口 MAC
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      content: user_number,
      user: wx.getStorageSync('user_name')
    },
    //20175533426
    success: function (res) {
      // console.log(res)
      if (res.data == false) {
        that.setData({
          loading: false
        })
        return false;
      } else {
        that.setData({
          "user.idcard": res.data.stu_idcard.slice(10, 19),
          // stu_idcard1: res.data.stu_idcard.slice(10, 19),
          // stu_major: res.data.stu_major,
          // stu_name: res.data.stu_name,
          // stu_number: res.data.stu_number,
          // stu_end_time: res.data.stu_end_time,
          // stu_room: res.data.stu_room,
          loading:false
        })

        // wx.hideLoading()
        searchName(res.data.stu_name, that)
        searchNumber(res.data.stu_number, that)
        // searchAbms(res.data.stu_number, that)
        // searchRoom(res.data.stu_number, that)
      }
      // console.log(that.data.user)
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: '',
    user: {
      name: '',
      student: '',
      idcard: '',
      ip: '',
      status: false
    },
    // flag:false, //是否被接单了
    tip:false, //提示已经被接
    newuser:false, //提示是否为当前人所接
    checksuccess:false,//是否完成了
    loading:false,
    images:[],
    userNoExist: '',

    dx:[],
    dx1:[]
  },

  // // 清除用户在线与绑定信息
  // clearUserInfo: function (e) {
  //   const that = this;
  //   console.log(e.target.dataset.student);
  //   wx.showLoading({
  //     title: '清除中....',
  //     mask: true
  //   })
  //   wx.request({
  //     url: 'https://nic.fhyiii.cn/NIC/app_api/net_test/restful/ruijies/' + e.target.dataset.student,
  //     method: 'PUT',
  //     success: function (res) {
  //       wx.hideLoading()
  //       wx.showToast({
  //         title: '清除成功'
  //       })
  //       console.log(res)
  //       that.setData({
  //         ['user.mac']: '',
  //         ['user.ip']: '',
  //         ['user.status']: false
  //       })
  //     }
  //   })
  // }, 

  //接单 xuehao id postman
  getFault(e){
    wx.showLoading({
      title: '抢单中',
    })
    const that = this;
    
    var xuehao = e.target.dataset.student;
    var id = e.target.dataset.fault;
    var postman = wx.getStorageSync('user_number')

    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/buyFault',
      method: 'POST', //必须大写哦        
      header: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
      },
      dataType: "json",
      data: {
        xuehao: xuehao,
        id:id,
        postman: postman
      },
      success: function (res) {
        if(res.data.status){
          wx.hideLoading()
          wx.showToast({
            title: '抢单成功',//提示文字
            duration: 2000,//显示时长
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon: 'success', //图标，支持"success"、"loading"  
            success: function () {
              wx.switchTab({
                url: '../fault/fault',
              })
            },//接口调用成功
            fail: function () { },  //接口调用失败的回调函数  
            complete: function () { } //接口调用结束的回调函数  
          })

        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function () {
              
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //完成故障
  successFault(e){
    wx.showLoading({
      title: '加载中',
    })
    const that = this;

    var xuehao = e.target.dataset.student;
    var id = e.target.dataset.fault;
    var postman = wx.getStorageSync('user_number')

    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/success',
      method: 'POST', //必须大写哦        
      header: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
      },
      dataType: "json",
      data: {
        xuehao: xuehao,
        id: id,
        postman: postman
      },
      success: function (res) {
        if (res.data.status) {
          wx.hideLoading()
          wx.showToast({
            title: '完成故障，辛苦了',//提示文字
            duration: 2000,//显示时长
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon: 'success', //图标，支持"success"、"loading"  
            success: function () { 
              wx.switchTab({
                url: '../fault/fault',
              })
            },//接口调用成功
            fail: function () { },  //接口调用失败的回调函数  
            complete: function () { } //接口调用结束的回调函数  
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function () {

            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //显示图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options);
    
    that.setData({
      student: options.student,
      name: options.name,
      fault_id: options.fault_id,
      time: options.fault_time,
    })

    //查询个人信息
    searchInfo(options.student, that)

    //查询是否在线
    searchUserOnline(that, options.student)
    //查询故障图片
    searchPic(that, options.fault_id)
    //查询是否被接
    searchIfC(that, options.fault_id) 
    //查询是否当前故障人所接
    // searchIf(that, options.fault_id) 
    
    //查询是否当前故障人完成
    // searchIfsuccess(that, options.fault_id) 
    
    //查询用户的故障 判断是否被人接单了
    // wx.request({
    //   url: 'https://nic.fhyiii.cn/wxcx/public/searchFault',
    //   dataType: "json",
    //   method:'POST',
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   data:{
    //     xuehao: that.data.student
    //   },
    //   success:function(res){
    //     var content = res.data.msg.回复内容
    //     if(res.data.status){
    //       if (content.indexOf(",") == -1) { //等于-1表示这个字符串中没有o这个字符
    //         //do something
    //         that.setData({
    //           ['user.student']: res.data.msg.登记人,
    //           images: content
    //         });
    //       } else {
    //         //do something
    //         var arr = content.split(',');
    //         that.setData({
    //           ['user.student']: res.data.msg.登记人,
    //           images: arr
    //         });
    //       }
    //     }else{
    //       that.setData({
    //         flag:true
    //       });
         
    //     }
    //     console.log(that.data)
    //   },
    //   fail:function(error){
    //     console.log(error)
    //   }
    // })
    // wx.request({
    //   url: 'https://nic.fhyiii.cn/NIC/app_api/net_test/restful/ruijies/' + that.data.student,
    //   success: function (res) {
    //     // console.log(res);
    //     if (res.data.error) {
    //       wx.hideLoading()
    //       that.setData({
    //         userNoExist: '用户未开通锐捷'
    //       })
    //       app.errorMessge(res.data.error);
    //     } else {
    //       that.setData({
    //         ['user.name']: res.data[0].USERNAME,
    //         ['user.student']: res.data[0].USERID,
    //       });
    //       if (res.data[0].NASIP != '') {
    //         that.postGetUser();
    //       } else {
    //         wx.hideLoading()
    //       }
    //     }
    //   }
    // })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // app.checkLogin()
    wx.setNavigationBarTitle({
      title: '详情信息'
    })
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
  
})