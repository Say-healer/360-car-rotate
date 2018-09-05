function View360(imgData, options) {
    /*维护私有变量*/
    //是否支持webp
    var isWebp = options.isWebp || ""; //""
    console.log("isWebp:>" + JSON.stringify(isWebp));

    //渲染容器
    var container = options.container; //"#view360Wrap"

    //维度json{img-key1:{path:"",ext:"",zIndex:""}}
    var data = imgData.data;
    console.log("data:>" + JSON.stringify(data));
    /*data = {
        "base": {"path": "base/level1/", "ext": "png", "zIndex": "10"},
        "grille": {
            "path": "",
            "ext": "png",
            "zIndex": "15",
            "deadZones": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            "optimize": 2
        },
        "exteriorColor": {"path": "", "ext": "png", "zIndex": "25"},
        "roofColor": {"path": "", "ext": "png", "zIndex": "35"},
        "louver": {"path": "", "ext": "png", "zIndex": "40", "deadZones": [6, 7, 8, 9, 10, 11], "optimize": 20},
        "wheels": {"path": "", "ext": "png", "zIndex": "45", "deadZones": [0, 1, 23, 11, 12, 13], "optimize": 6},
        "headlamp": {
            "path": "",
            "ext": "png",
            "zIndex": "50",
            "deadZones": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            "optimize": 2
        },
        "glasses": {"path": "", "ext": "png", "zIndex": "55", "deadZones": [0, 1, 23, 11, 12, 13], "optimize": 6}
    };*/
    var orgData = imgData.data; // == data
    //console.log("orgData:>" + JSON.stringify(orgData));
    var config = imgData.config;
    console.log("config:>" + JSON.stringify(config));
    /*config = {
        "pathDomainDe": "../../lib/images/cs55/",
        "pathDomainMo": "../../lib/images/cs55/",
        "carName": "cs55",
        "urlArgs": "13",
        "packs": {
            "sets": {
                "roofColor": "车顶辅色",
                "wheels": "轮毂",
                "grille": "格栅",
                "louver": "天窗",
                "headlamp": "前大灯",
                "glasses": "车门玻璃"
            },
            "leastNum": 1,
            "noneCount": 6,
            "checkPackMeg": "请至少选择1项非基本款的车顶辅色、前大灯、格栅、轮毂、天窗或车门玻璃配置！",
            "specPacks": [],
            "aniPacks": []
        },
        "view360": {"initAngle": 2}
    };*/
    console.log("options:>" + JSON.stringify(options));
    /*options = {"container": "#view360Wrap", "minAngle": 0, "maxAngle": 23, "initAngle": 2};*/

    //json数据的key
    var config_pathDomain = "pathDomainDe";
    var config_carName = "carName";
    var data_key_path = "path";
    var data_key_ext = "ext";
    var data_key_zIndex = "zIndex";
    var data_key_deadZones = "deadZones";
    var data_key_optimize = "optimize";
    // 车型基础model的key
    var key_baseModel = "base";

    //车型
    var carName = config[config_carName]; //cs55
    console.log("carName:>" + carName);

    //图片文件路径基本部分
    var basePath = isWebp ? config[config_pathDomain] + "webp/" : config[config_pathDomain];
    console.log("basePath:>" + JSON.stringify(basePath));
    /*basePath = "../../lib/images/cs55/"*/

    var imgVer = config["urlArgs"]; //13
    console.log("imgVer:>" + imgVer);
    var el_id_prefix = carName + "Angle"; //cs55Angle
    console.log("el_id_prefix:>" + el_id_prefix);
    var el_id_suffix = "";

    //最小角度
    var minAngle = options.minAngle; //0
    //最大角度
    var maxAngle = options.maxAngle; //23
    //总角度数
    var imgAngle = maxAngle - minAngle + 1; //24
    //初始角度
    var initAngle = options.initAngle || 0; //2
    //當前角度
    var currentAngle = options.initAngle || 0; //2

    //存入图片的数组
    var aImg = [],
        aImgL = [];
    var lastImg = null;

    var tImgArr = [];
    //所有图片的数组（用于检查是否加载完成）
    var _tImgPart = _tImgCount = _onloadCount = 0;
    var callback, callback_loading360;
    var autoReload = reloadCount = 3;
    //var isOnLoaded = false;
    var tDiv;

    //拖动加锁
    var lock = true;

    //图片加载完成检测
    var Browser = {};
    Browser.userAgent = window.navigator.userAgent.toLowerCase();
    Browser.ie = /msie/.test(Browser.userAgent);
    Browser.Moz = /gecko/.test(Browser.userAgent);

    //加载图片
    // var imgLoaded = function (tImg) {
    //     console.log('=========== imgLoaded start ===========');
    //     console.log('tImgArr:>'+tImgArr);
    //     if (Browser.ie) { //ie
    //         tImg.onreadystatechange = function () {
    //             if (!(this.readyState == "complete" || this.readyState == "loaded")) {
    //                 console.log(tImg + "加载失败！");
    //                 !(_.contains(tImgArr, tImg)) && tImgArr.push(tImg);
    //             }
    //         };
    //     } else if (Browser.Moz) {
    //         if (!tImg.complete) {
    //             console.log(tImg + "加载失败！");
    //             !(_.contains(tImgArr, tImg)) && tImgArr.push(tImg);
    //         }
    //     }
    //
    //     //360资源全部加载完成
    //     if (_tImgCount === _onloadCount) {
    //         console.log("全部加载完成！");
    //         callback && callback();
    //     } else if (tImgArr.length > 0) {
    //         if (autoReload--) {
    //             console.log("数据加载失败，自动进行第" + (reloadCount - autoReload) + "次重试！");
    //             _.each(tImgArr, function (oImg) {
    //                 var oNewImg = new Image();
    //                 //onload方法写在图片地址加载之前，防止IE缓存
    //                 oNewImg.onload = function () {
    //                     oNewImg.onload = null;
    //                     oImg.src = this.src;
    //                     _onloadCount++;
    //                     //isImgLoaded(this);
    //                 };
    //                 oNewImg.src = oImg.src;
    //             });
    //         } else {
    //             alert("已超过最大重试次数，网络异常，请刷新再试！");
    //         }
    //     } else {
    //         console.log("正在加载：" + _onloadCount);
    //     }
    //
    //     console.log('=========== imgLoaded end ===========');
    // };

    //判断是否加载完成
    var loadCheck = function (tImgCount) {
        console.log('------------ loadCheck start ------------');
        console.log("tImgCount:>" + tImgCount);
        console.log("tImgArr:>" + JSON.stringify(tImgArr));
        console.log("autoReload:>" + autoReload);
        //360资源全部加载完成
        if (tImgCount && _onloadCount && tImgCount === _onloadCount) {
            //console.log("全部加载完成！");
            //console.log("tImgCount && _onloadCount:"+tImgCount+"-"+_onloadCount);
            _onloadCount = 0;
            callback && callback();
            callback_loading360 && callback_loading360();
            //isOnLoaded = true;
        } else if (tImgArr.length > 0) {
            if (autoReload--) {
                //console.log("数据加载失败，自动进行第" + (reloadCount - autoReload) + "次重试！");
                _.each(tImgArr, function (oImg) {
                    imgReady(oImg.src, oImg, true);
                });
            } else {
                //alert("已超过最大重试次数，网络异常，请刷新再试！");
            }
        } else {
            //console.log("正在加载：" + _onloadCount + " / " + tImgCount);
        }
        console.log('------------ loadCheck end ------------');
    };

    //imgReady(源src，目标元素)；返回值：更新后的目标元素；总图片数；是否有返回值：默认为false；onerror自定义回调
    var imgReady = function (tSrc, tImg, tImgCount, isReturn, err) {
        console.log('------------ imgReady start ------------');

        console.log("tSrc:>" + tSrc);
        console.log("tImg:>" + tImg);
        console.log("tImgCount:>" + tImgCount);
        console.log("isReturn:>" + isReturn);
        console.log("err:>" + err);

        isReturn = isReturn || false;
        var oNewImg = new Image();
        //onload方法写在图片地址加载之前，防止IE缓存
        oNewImg.onload = function () {
            tImg.src = this.src;
            _onloadCount++;
            oNewImg = this.onload = this.onerror = null;
            loadCheck(tImgCount);
        };
        // 如果因为网络或图片的原因发生异常，加载失败后的事件回收
        oNewImg.onerror = function () {
            err && err(this.src);
            //console.log("加载失败！");
            !(_.contains(tImgArr, tImg)) && tImgArr.push(tImg);
            oNewImg = this.onload = this.onerror = null;
        };
        oNewImg.src = tSrc;

        if (isReturn) {
            console.log('------------ imgReady end ------------');
            return tImg;
        }
        console.log('------------ imgReady end ------------');
    };

    //渲染所有图层下所有角度
    // var fn_render_all_parts = function (data, angle) {
    // };

    //渲染所有角度下所有图层
    // var fn_render_all_angles = function (data, angle) {
    // };

    //渲染当前角度所有图层
    var fn_render_part = function (angle) {
        console.log('------------ fn_render_part start ------------');
        console.log("angle:>" + angle);
        var iAngle = (minAngle == 0) ? angle : (angle - 1);
        console.log("iAngle:>" + iAngle);

        //新建角度div
        var oDiv = document.createElement('div');
        oDiv.id = el_id_prefix + iAngle;
        oDiv.style.visibility = "hidden";
        //oDiv.style.display = "none";
        aImg[iAngle] = oDiv;

        _.each(_.keys(data), function (key) {
            (function (i, key) {
                var diyData = data[key],
                    path = diyData[data_key_path],
                    ext = isWebp ? "webp" : diyData[data_key_ext],
                    zIndex = diyData[data_key_zIndex],
                    fileName = i < 10 ? "0" + i : i;

                // console.log("diyData:>"+diyData);
                // console.log("path:>"+path);
                // console.log("ext:>"+ext);
                // console.log("zIndex:>"+zIndex);
                // console.log("fileName:>"+fileName);

                var oImgChild = document.createElement('img');
                var dataId = carName + "Img" + i + "-" + key;
                oImgChild.setAttribute("data-seq", dataId);
                oImgChild.style.zIndex = zIndex;

                var src = '';
                if (path) {
                    oImgChild.className = "car-base " + key;
                    oImgChild = imgReady(path + fileName + "." + ext + "?" + imgVer, oImgChild, _tImgCount, true);
                    //console.log("oImgChild:>"+oImgChild);
                    src = path + fileName + "." + ext + "?" + imgVer;
                } else {
                    oImgChild.className = "car-base " + key + " hide";
                }

                console.log("oImgChild:>" + JSON.stringify({
                    tag: 'img',
                    "data-seq": dataId,
                    zIndex: zIndex,
                    src: src,
                    className: oImgChild.className
                }));

                oDiv.appendChild(oImgChild);
            })(iAngle, key);
        });
        console.log("oDiv:>" + oDiv);
        tDiv.appendChild(oDiv);
        console.log("tDiv:>" + tDiv);
        console.log('------------ fn_render_part end ------------');
    };

    //渲染当前图层所有角度
    var fn_render_angle = function (key) {
        console.log('------------ fn_render_angle start ------------');
        console.log('key:>' + key);
        var imgPath = data[key].path;
        var imgExt = data[key].ext;
        var fileName, i;

        console.log('imgPath:>' + imgPath);
        console.log('imgExt:>' + imgExt);

        for (i = currentAngle; i <= maxAngle; i++) {
            fileName = i < 10 ? "0" + i : i;
            imgReady(imgPath + fileName + "." + imgExt + "?" + imgVer, $("." + key, "#" + el_id_prefix + i)[0], imgAngle);
            //$("#" + el_id_prefix + i).find("." + key).attr("src", imgPath + fileName + "." + imgExt);
        }
        for (i = currentAngle - 1; i >= minAngle; i--) {
            fileName = i < 10 ? "0" + i : i;
            imgReady(imgPath + fileName + "." + imgExt + "?" + imgVer, $("." + key, "#" + el_id_prefix + i)[0], imgAngle);
            //$("#" + el_id_prefix + i).find("." + key).attr("src", imgPath + fileName + "." + imgExt);
        }
        console.log('------------ fn_render_angle end ------------');
    };

    //选择当前图层所有角度
    // var fn_all_angle_selector = function (key) {
    //     return $(container + " ." + key);
    // };


    //旋转当前角度所有图层
    // var fn_all_part_selector = function (angle) {
    //     return $("#" + el_id_prefix + angle).children();
    // };

    //显示当前角度
    var fn_angle_change = function (angle) {
        console.log('------------ fn_angle_change start ------------');
        //console.time("方式1");
        $(lastImg).css({"visibility": "hidden"});
        $(aImg[angle]).css({"visibility": "visible"});
        //console.timeEnd("方式1");

        //console.time("方式2");
        //$(lastImg).css({"display": "none"});
        //$(aImg[angle]).css({"display": "block"});
        //console.timeEnd("方式2");
        lastImg = aImg[angle];
        console.log("lastImg:>" + lastImg);
        console.log('------------ fn_angle_change end ------------');
    };

    //初始数据（唯一）
    var unionData = function (defaults) {
        console.log('------------ unionData start ------------');
        console.log("data:>" + JSON.stringify(data));
        console.log("_.keys(data):>" + JSON.stringify(_.keys(data)));
        console.log('------------ unionData end ------------');
        return _.reduce(_.keys(data), function (result, key) {
            //"base": { "path": "base/level1",  "ext": "jpg", "zIndex": "1"}
            var d_path = data[key].path;
            var d_ext = isWebp ? "webp" : data[key].ext;
            var d_zIndex = data[key].zIndex;

            if (d_path && key == key_baseModel) {
                d_path = basePath + d_path;
            }

            //console.log("basePath:>" + basePath);
            //console.log("defaults:>" + JSON.stringify(defaults));
            //console.log("key:>" + key);

            if (defaults[key]) {
                d_path = basePath + defaults[key] + '/';
            }
            if (d_path) {
                _tImgPart++;
            }
            result[key] = {path: d_path, ext: d_ext, zIndex: d_zIndex};
            //console.log("result:>" + JSON.stringify(result));
            // result = {
            //    "base": {"path": "../../lib/images/cs55/base/level1/", "ext": "png", "zIndex": "10"},
            //    "grille": {"path": "../../lib/images/cs55/grille/level1/", "ext": "png", "zIndex": "15"},
            //    "exteriorColor": {"path": "../../lib/images/cs55/exteriorColor/white/", "ext": "png", "zIndex": "25"},
            //    "roofColor": {"path": "../../lib/images/cs55/rootColor/black/", "ext": "png", "zIndex": "35"},
            //    "louver": {"path": "", "ext": "png", "zIndex": "40"},
            //    "wheels": {"path": "../../lib/images/cs55/wheels/level1/", "ext": "png", "zIndex": "45"},
            //    "headlamp": {"path": "../../lib/images/cs55/headlamp/level1/", "ext": "png", "zIndex": "50"},
            //    "glasses": {"path": "", "ext": "png", "zIndex": "55"}
            // };
            return result;
        }, {});
    };

    return {
        render: function (config) {
            console.log('************* render start *************');

            var _loaded = 0,
                i;
            //更新配置json
            data = unionData(config.defaults);
            console.log("data:" + JSON.stringify(data));

            _tImgCount = _tImgPart * imgAngle;
            console.log("_tImgCount:" + _tImgCount);

            if (config.callback) {
                callback = config.callback;
            }
            //加载所有资源
            //$(container).html("");
            tDiv = document.createDocumentFragment();
            console.log("maxAngle:" + maxAngle); //23
            for (i = minAngle; i <= maxAngle; ++i) {
                fn_render_part(i);
                _loaded++;
                //将每组的图片存入相应的数组
                aImgL[i] = [];
            }

            if (_loaded == imgAngle) {
                //检测加载是否完成
                for (i = minAngle; i <= maxAngle; i++) {
                    if (!aImgL[i]) {
                        alert('资源加载失败，请刷新重试!');
                    }
                }
            } else {
                alert('资源加载失败，请刷新重试!');
            }

            $(container).append(tDiv);
            lastImg = aImg[initAngle];
            console.log("lastImg:>" + lastImg);

            fn_angle_change(initAngle);

            console.log('************* render start *************');
        },

        //direction：正为左转，0不转，负为右转
        rotate: function (direction, a) {
            console.log('************* rotate start *************');
            console.log("lock:>" + lock + "; a:>" + a);
            if (lock && a > 0) {
                lock = false;
                a = a || 1;
                //console.log("direction:" + direction + "angle:" + a);
                //console.log("currentAngle:"+currentAngle)
                var angle = currentAngle;

                if (direction > 0) { // rotate-left
                    angle = (angle + a) % imgAngle;
                } else if (direction < 0) { // rotate-right
                    angle = angle >= a ? (angle - a) : (imgAngle - a + angle);
                } else {
                    angle = currentAngle;
                }
                console.log("angleR:" + angle);
                fn_angle_change(angle);

                currentAngle = angle;
                lock = true;
            }
            console.log('************* rotate end *************');
        },
        getOptimizeInfo: function (imgKey) {
            console.log('************* getOptimizeInfo start *************');
            var result = {isDead: false};
            if (_.has(orgData, imgKey)) {
                var d = orgData[imgKey];
                var deadZones = d[data_key_deadZones];
                var optimize = d[data_key_optimize];
                //console.log("currentAngle:"+currentAngle);
                if (deadZones && optimize && _.contains(deadZones, currentAngle)) {
                    result.isDead = true;
                    result.optimize = optimize;
                }
            }
            console.log('************* getOptimizeInfo end *************');
            return result;
        },
        rotateTo: function (angle) {
            console.log('************* rotateTo start *************');
            if (angle >= 0) {
                var fn_getDirect = function (c, a, m) {
                    var clockwise, anticlockwise, d;
                    //当前角度大于指定角度
                    if (c > a) {
                        anticlockwise = c - a;
                        clockwise = m - c + a;
                        //d = clockwise> anticlockwise?1:-1;
                    }
                    //当前角度小于指定角度
                    else {
                        clockwise = a - c;
                        anticlockwise = m - a + c;
                    }
                    d = clockwise > anticlockwise ? -1 : 1;
                    return {direction: d, angle: (clockwise > anticlockwise ? anticlockwise : clockwise)};
                };
                var result = fn_getDirect(currentAngle, angle, maxAngle);
                var drc = result.direction;
                angle = result.angle;
                var me = this;
                var rotateTimer = setInterval(function () {
                    //console.log(angle);
                    if (angle > 0) {
                        me.rotate(drc, 1);
                        --angle;
                    } else {
                        clearInterval(rotateTimer);
                        rotateTimer = 0;
                    }
                }, 20)
            }
            console.log('************* rotateTo end *************');
        },
        //value--{key:image-key1,value:""}
        change: function (newData, callback) {
            console.log('************* change start *************');
            var change_key = _.keys(newData)[0];
            var change_value = newData[change_key];

            if (change_value && "none" !== change_value) {
                data[change_key][data_key_path] = basePath + change_key + "/" + change_value + "/";
                console.log("data:>" + JSON.stringify(data));
                // data = {
                //     "base": {"path": "../../lib/images/cs55/base/level1/", "ext": "png", "zIndex": "10"},
                //     "grille": {"path": "../../lib/images/cs55/grille/level1/", "ext": "png", "zIndex": "15"},
                //     "exteriorColor": {"path": "../../lib/images/cs55/exteriorColor/white/","ext": "png","zIndex": "25"},
                //     "roofColor": {"path": "../../lib/images/cs55/rootColor/black/", "ext": "png", "zIndex": "35"},
                //     "louver": {"path": "../../lib/images/cs55/louver/level1/", "ext": "png", "zIndex": "40"},
                //     "wheels": {"path": "../../lib/images/cs55/wheels/level1/", "ext": "png", "zIndex": "45"},
                //     "headlamp": {"path": "../../lib/images/cs55/headlamp/level1/", "ext": "png", "zIndex": "50"},
                //     "glasses": {"path": "", "ext": "png", "zIndex": "55"}
                // };
                callback_loading360 = callback;
                fn_render_angle(change_key);

                $("." + change_key, container).removeClass("hide");
            } else {
                if (change_value !== "none") {
                    $("." + change_key).addClass("hide");
                }

                callback && callback();
            }
            console.log('************* change end *************');
        }
    }
}
