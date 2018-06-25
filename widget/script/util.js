var domain = "http://192.168.1.110/";

//  appId，判断APP的唯一标识
var appId = "lfm_score_001";
// 监听语音保存路径
var listenPath = "fs://listen.amr";
// 机器人回复语音保存路径
var answerPath = "fs://answer.mp3";

//关闭窗口
function closeWin() {
    api.closeWin({});
}

//打开窗口
function openWin(name,url){
  api.openWin({
      name: name,
      url: url
  });
}

//打开窗口，携带参数
function openWinWithParam(name,url,param){
  api.openWin({
      name: name,
      url: url,
      pageParam: param
  });
}

//拍照
function takePicture(callback) {
    api.getPicture({
        sourceType: 'camera',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'base64',
        allowEdit: true,
        quality: 100,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: false
    }, function(ret, err) {
        if (ret) {
            callback(ret);
        } else {
            // alert(JSON.stringify(err));
            alert("获取照片失败");
        }
    });
}

//网络请求 json格式
function httpJson(url, method, data, callback) {

    // 提交JSON数据
    console.log(domain + url);
    api.ajax({
        url: domain + url,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            body: data
        }
    }, function(ret, err) {
        if (ret) {
            // api.alert({ msg: JSON.stringify(ret) });
            console.log(JSON.stringify(ret));
        } else {
            // api.alert({ msg: JSON.stringify(err) });
            console.log(JSON.stringify(err));
        }
        callback(ret);
    });
}

function http(url, method, data, callback) {
    console.log(domain + url);
    api.ajax({
        url: domain + url,
        method: method,
        data: {
          values: data
        }
    }, function(ret, err) {
        if (ret) {
            // api.alert({ msg: JSON.stringify(ret) });
            console.log(JSON.stringify(ret));
        } else {
            // api.alert({ msg: JSON.stringify(err) });
            console.log(JSON.stringify(err));
        }
        callback(ret);
    });
}

//下载文件
function downloadFile(url, path, callback) {
    api.download({
        url: domain + url,
        savePath: path,
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        // console.log(ret);
        if (ret.state == 1) {
            //下载成功
            callback(ret);
        } else {
            // speech();
        }
    });
}

//语音播放
function speech(path) {
    api.startPlay({
        path: path
    }, function(ret, err) {});
}

//上传文件
function upload(url, filePath, callback) {
    // 提交JSON数据
    api.ajax({
        url: url,
        method: 'post',
        data: {
            files: {
                file: filePath
            }
        }
    }, function(ret, err) {
        if (ret) {
            // api.alert({
            //     msg: JSON.stringify(ret)
            // });
            callback(ret);
        } else {
            // api.alert({
            //     msg: JSON.stringify(err)
            // });
        }
    });
}

//语音交互
function listenAndAnswer() {
    console.log("listen");
    listen();
    setTimeout(function() {
        console.log("stop listen");
        answer();
    }, 5000);
}

function listen() {
    api.startRecord({
        path: listenPath
    });
}

//发送到云端解析,返回问答语句
function answer() {
    api.stopRecord(function(ret, err) {
        if (ret) {
            var url = domain + "lfm/speech/answer";
            var path = ret.path;
            var duration = ret.duration;
            console.log(path);
            console.log(duration);
            //上传音频解析并且返回 回答语音
            upload(url, path, function(ret) {
                console.log(JSON.stringify(ret));
                //先判断机器人是否有回
                if (ret.code == 0) {
                    var url = ret.answerPath;
                    console.log("answerPath:" + url)
                        //下载回答语音，播放
                    downloadFile(url, answerPath, function(ret) {
                        // speech(answerPath);
                        api.startPlay({
                            path: answerPath
                        }, function(ret, err) {
                            //无论是否有回应，继续监听语音
                            listenAndAnswer();
                        });
                    });
                } else {
                    //无论是否有回应，继续监听语音
                    listenAndAnswer();
                }
            });
        }
    });
}

// (function(window) {
//     'use strict';
//     var util = function(param) {
//       	this.extend(this.params, params);
//         this._init(param);
//     }
//     util.prototype = {
//         _init: function(param) {
//             this.domain = "http://192.168.1.110/";
//         },
//         postJson: function(url, method, jsonData, callback) {
//             // 提交JSON数据
//             api.ajax({
//                 url: url,
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 data: {
//                     body: jsonData
//                 }
//             }, function(ret, err) {
//                 if (ret) {
//                     // api.alert({ msg: JSON.stringify(ret) });
//                     console.log(JSON.stringify(ret));
//                 } else {
//                     // api.alert({ msg: JSON.stringify(err) });
//                     console.log(JSON.stringify(err));
//                 }
//                 callback(ret);
//             });
//         },
//         downloadFile: function(url, path, callback) {
//             api.download({
//                 url: url,
//                 savePath: path,
//                 report: true,
//                 cache: true,
//                 allowResume: true
//             }, function(ret, err) {
//                 console.log(ret);
//                 if (ret.state == 1) {
//                     //下载成功
//                     callback(ret);
//                 } else {
//                     // speech();
//                 }
//             });
//         },
//         speech: function(path) {
//             api.startPlay({
//                 path: path
//             }, function(ret, err) {});
//         },
//         extend: function(a, b) {
//             for (var key in b) {
//                 if (b.hasOwnProperty(key)) {
//                     a[key] = b[key];
//                 }
//             }
//             return a;
//         }
//     }
//     window.util = util;
// })(window);
