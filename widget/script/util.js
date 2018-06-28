var domain = "http://192.168.1.110/";
// var domain = "http://219.132.138.44:8085/flying-lfm-portal/";

//  appId，判断APP的唯一标识
var appId = "lfm_score_001";
// 监听语音保存路径
var listenPath = "fs://listen.amr";
// 机器人回复语音保存路径
var answerPath = "fs://answer.mp3";

var photoPath = "fs://scanFace.jpg";


//toast
function toast(msg, icon) {
    var toast = new auiToast();
    switch (icon) {
        case "success":
            toast.success({
                title: msg,
                duration: 2000
            });
            break;
        case "fail":
            toast.fail({
                title: msg,
                duration: 2000
            });
            break;
        case "custom":
            toast.custom({
                title: "提交成功",
                html: '<i class="aui-iconfont '+custom+'"></i>',
                duration: 2000
            });
            break;
        default:
            break;
    }
}

//loading
function loading(msg) {
    var toast = new auiToast({});
    toast.loading({
            title: msg,
            duration: 2000
        },
        function(ret) {
            console.log(ret);
            setTimeout(function() {
                toast.hide();
            }, 5000)
        });
}

//拍照
function takePhoto(quality, callback) {
    FNPhotograph.takePhoto({
        quality: quality,
        path: photoPath,
        album: false
    }, function(ret) {
        console.log(JSON.stringify(ret));
        callback(ret);
    });
}

//打开相机
// {
//    x: 0,
//    y: 0,
//    w: $api.offset($api.dom('body')).w,
//    h: $api.offset($api.dom('body')).h
// }
// orientation
function openCamera(rect, orientation) {
    FNPhotograph.openCameraView({
        rect: rect,
        orientation: orientation,
        fixedOn: api.frameName,
        fixed: true
    }, function(ret) {
        // console.log(JSON.stringify(ret));
    });
    FNPhotograph.setCamera({
        camera: 'front'
    });
}

//弹出框
function alert(title, msg) {
    var dialog = new auiDialog();
    dialog.alert({
        title: title,
        msg: msg,
        buttons: ['确定']
    }, function(ret) {});
}

//关闭窗口
function closeWin() {
    api.closeWin({});
}

//打开窗口
function openWin(name, url) {
    api.openWin({
        name: name,
        url: url
    });
}

//打开窗口，携带参数
function openWinWithParam(name, url, param) {
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
    console.log("upload");
    // 提交JSON数据
    api.ajax({
        url: domain + url,
        method: 'post',
        data: {
            files: {
                file: filePath
            }
        }
    }, function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret) {
            // api.alert({
            //     msg: JSON.stringify(ret)
            // });
            console.log(JSON.stringify(ret));
            callback(ret);
        } else {
            // api.alert({
            //     msg: JSON.stringify(err)
            // });
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
