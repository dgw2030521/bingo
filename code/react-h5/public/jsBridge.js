/*
 *jssdk jsapi所在服务器域名，无需追加'http://'或'https://'
 */
var urldomain = "tftb.sczwfw.gov.cn:8085/jmopen";
// var urldomain = '172.16.9.111:8848';
// var urldomain = '192.168.150.117:5501';

var urldomaincreatesign =
  "tftb.sczwfw.gov.cn:8085/jags-server/interface/createsign.do";
var urldomaingateway =
  "tftb.sczwfw.gov.cn:8085/jags-server/interface/gateway.do";

function containerType() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  var bIsApp = sUserAgent.indexOf("hanweb") > -1;
  var bIsdingding = sUserAgent.indexOf("dingtalk") > -1;
  var bIsWechat = sUserAgent.indexOf("micromessenger") > -1;
  var bIsAlipay = sUserAgent.indexOf("alipayclient") > -1;
  if (bIsApp) {
    return "hanweb";
  } else if (bIsWechat) {
    return "wechat";
  } else if (bIsAlipay) {
    return "Alipay";
  } else if (bIsdingding) {
    return "dingtalk";
  } else {
    return "web";
  }
}
var container = containerType();
//var tmpTag = 'https:' == document.location.protocol ? true : false;
var tmpTag = false;
if (urldomain == "tftb.sczwfw.gov.cn:8085/jmopen") {
  tmpTag = true;
}
//var tmpTag = false;

if (container == "hanweb") {
  if (tmpTag == true) {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="https://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/js/indexnew.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/jmportal_SDK.js"></script>'
    );
  } else {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="http://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/js/indexnew.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/jmportal_SDK.js"></script>'
    );
  }
} else if (container == "wechat") {
  if (tmpTag == true) {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="https://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.3/qs.min.js"></script>'
    );

    document.write(
      '<script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/alipayjs/aes.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/alipayjs/pad-nopadding.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/wechatjs/indexnew.js"></script>'
    );
  } else {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="http://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script src="http://cdnjs.cloudflare.com/ajax/libs/qs/6.9.3/qs.min.js"></script>'
    );
    document.write(
      '<script src="http://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/aes.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/pad-nopadding.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/wechatjs/indexnew.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/md5.js"></script>'
    );
  }
} else if (container == "dingtalk") {
  if (tmpTag == true) {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="https://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script src="https://g.alicdn.com/dingding/open-develop/1.6.9/dingtalk.js"></script>'
    );
    // document.write('<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/dingtalkjs/indexnew.js"></script>'
    );
  } else {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="http://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    // document.write('<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.write(
      '<script src="http://g.alicdn.com/dingding/open-develop/1.6.9/dingtalk.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/dingtalkjs/indexnew.js"></script>'
    );
  }
} else if (container == "Alipay") {
  if (tmpTag == true) {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="https://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js"></script>'
    );
    // document.write('<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/alipayjs/aes.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.writeln(
      '<script src="https://appx/web-view.min.js"' + ">" + "<" + "/" + "script>"
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/alipayjs/pad-nopadding.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/alipayjs/indexnew.js"></script>'
    );
  } else {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="http://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    document.write(
      '<script type="text/javascript" src="http://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js"></script>'
    );
    // document.write('<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.writeln(
      '<script src="https://appx/web-view.min.js"' + ">" + "<" + "/" + "script>"
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/aes.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/pad-nopadding.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/alipayjs/indexnew.js"></script>'
    );
  }
} else {
  if (tmpTag == true) {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="https://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    // document.write('<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/wechatjs/brower.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="https://' +
      urldomain +
      '/jssdk/baidu/indexnew.js"></script>'
    );
  } else {
    if (typeof $ == "undefined") {
      document.write(
        '<script type="text/javascript" src="http://' +
        urldomain +
        '/jssdk/jquery-1.8.3.min.js"></script>'
      );
    }
    // document.write('<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=xOWZlWcTZPK84VcK3Ixzqq9wQ6arTUry"></script>');
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/md5.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/sha1.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/wechatjs/brower.js"></script>'
    );
    document.write(
      '<script type="text/javascript" src="http://' +
      urldomain +
      '/jssdk/baidu/indexnew.js"></script>'
    );
  }
}

/*
 * 网关验签接口
 * appid应用唯一标识
 * interfaceid接口唯一标识
 * interfacecontent接口参数,请使用json格式, 例如:{"siteid":"2","cateid":"1"}
 * fromport端口来源"0"：PC；"1"：APP；"2"：支付宝；"3"：微信
 * signurl签名接口地址
 * gatewayurl网关接口地址
 */
function vaildInterface(
  appid,
  interfaceid,
  interfacecontent,
  fromport,
  signurl,
  gatewayurl
) {
  return new Promise(function (resolve, reject) {
    var datestr = new Date().valueOf();
    var param = {
      app_id: appid,
      interface_id: interfaceid,
      version: "1.0",
      biz_content: interfacecontent,
      charset: "utf-8",
      timestamp: datestr,
      origin: fromport,
    };
    $.ajax({
      url: signurl,
      type: "post",
      dataType: "json",
      data: param,
      success: function (data) {
        if (data == null || data == undefined || data == "") {
          //alert("网关验签失败！请检查配置参数！")
          reject(false);
        } else {
          var signResult = data.data.sign;
          var param = {
            app_id: appid,
            interface_id: interfaceid,
            version: "1.0",
            biz_content: interfacecontent,
            charset: "utf-8",
            timestamp: datestr,
            origin: fromport,
            sign: signResult,
          };
          $.ajax({
            url: gatewayurl,
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
              if (data == null || data == undefined || data == "") {
                //alert("网关验证失败！请检查配置参数！")
                reject(false);
              } else {
                var gateWayResult = data.data;
                resolve(gateWayResult);
              }
            },
            error: function (data) {
              //alert("网关验证失败！请检查接口是否正确！");
              reject(false);
            },
          });
        }
      },
      error: function (data) {
        //alert("网关验签失败！请检查接口是否正确！");
        reject(false);
      },
    });
  });
}

async function vaildInterfacefn(
  appid,
  interfaceid,
  interfacecontent,
  fromport,
  signurl,
  gatewayurl
) {
  var returnData = await vaildInterface(
    appid,
    interfaceid,
    interfacecontent,
    fromport,
    signurl,
    gatewayurl
  );
  return returnData;
}

//调用方式验证网关接口
//vaildInterfacefn().then(value => {
//	var data = value
//})

if (tmpTag == true) {
  document.write(
    '<script type="text/javascript" src="https://' +
    urldomain +
    '/jssdk/statistics.js"></script>'
  );
} else {
  document.write(
    '<script type="text/javascript" src="http://' +
    urldomain +
    '/jssdk/statistics.js"></script>'
  );
}

console.log('####',window.lightAppJssdk)
