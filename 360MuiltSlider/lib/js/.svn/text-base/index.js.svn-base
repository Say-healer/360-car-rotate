	define(['jquery',
        'rockBase',
        '../parts/parts-client',
        'baseClient',
        //'location',
        '../bounce/bounce',
        'dialog',
        'cartMenu',
        '../rock/js/goods/diymanager',
        '../rock/js/goods/view360',
        /*'json!../diy/diyconfig.json',*/
        'goodsParams',
        'flexslider',
        'user',
        '../rock/com/bootstrap/js/dropdown',
        'videoJs', 'css!../rock/com/jquery-videojs/video-js.css'
        ],
    function($, RockBase, Client, BaseClient, /*Location,*/ Pop, Dialog, Cart, DiyManager, View360, /*Data360,*/ Params) {
        /****** 公共函数区 ******/
        /**
         * 检测是否为可触摸设备
         */
        function isMobile() {
            var ua = navigator.userAgent.toLowerCase();
            var mua = {
                IOS: /ipod|iPhone|ipad/.test(ua), //iOS
                IPHONE: /iphone/.test(ua), //iPhone
                IPAD: /ipad/.test(ua), //iPad
                ANDROID: /android/.test(ua), //Android Device
                WINDOWS: /windows/.test(ua), //Windows Device
                TOUCH_DEVICE: ('ontouchstart' in window) || /touch/.test(ua), //Touch Device
                MOBILE: /mobile/.test(ua), //Mobile Device (iPad)
                ANDROID_TABLET: false, //Android Tablet
                WINDOWS_TABLET: false, //Windows Tablet
                TABLET: false, //Tablet (iPad, Android, Windows)
                SMART_PHONE: false //Smart Phone (iPhone, Android)
            };
            mua.ANDROID_TABLET = mua.ANDROID && !mua.MOBILE;
            mua.WINDOWS_TABLET = mua.WINDOWS && /tablet/.test(ua);
            mua.TABLET = mua.IPAD || mua.ANDROID_TABLET || mua.WINDOWS_TABLET;
            mua.SMART_PHONE = mua.MOBILE && !mua.TABLET;

            return mua.SMART_PHONE;
        }

        /**
         * 图片loading
         * @params config {obj}
         */
        function Loading(config) {
            var tEl = $(config.el);
            return {
                isLoad: false,
                show: function() {
                    if (!tEl.hasClass("show")) {
                        tEl.addClass("show");
                        touchHandleEl.css({ "visibility": "hidden" });
                    }
                },
                hide: function() {
                    if (tEl.hasClass("show")) {
                        tEl.removeClass("show");
                        touchHandleEl.css({ "visibility": "visible" });
                    }
                },
                isShow: function() {
                    return tEl.hasClass("show");
                }
            }
        }

        /**
         * 轻量消息提示框
         * @param msg:   提示信息
         * @param cb:   关闭操作扩展回调
         */
        function showDialog(msg, cb) {
            me = this;
            me.dialog = Dialog.createDialog({
                autoOpen: true,
                //icon: 'build',
                content: msg,
                buttons: [{
                    name: '确定',
                    callback: function() {
                        me.dialog.hide();
                        cb();
                    },
                    className: 'btn-reverse'
                }],
                listener: {
                    close: function() {
                        me.dialog.hide();
                        cb();
                    }
                }
            });
        }

        /**
         * 获取文件类型（1.7.7增）
         * @param filePath
         * @returns {*}
         */
        function getFileFormat(filePath) {
            var imgType = ['jpg', 'gif', 'png'],
                videoType = ['mp4'],
                tt = "";

            if ("string" == typeof filePath) {
                tt = filePath.split(".");
                tt = tt[tt.length - 1];

                if (_.contains(imgType, tt)) {
                    return "IMAGE";
                } else if (_.contains(videoType, tt)) {
                    return "VIDEO";
                } else {
                    alert("该选配包设置有误，应为文件的相对路径！");
                }
            } else {
                alert("该选配包设置有误，应为文件的相对路径！");
            }
        }

        /****** 公共变量区 ******/
        // 定制车ID
        var productId = BaseClient.getGoodsCaId();
        // 定制车库存
        var goodsStatus = $("#goodsStatus").text();
        /*diy配置数据源*/
        // 选配包搭配规则集合txt
        var diyData = $('#diydata').text();
        // 选配包键值项集合txt，如"second244":"配置"
        var diyDataName = $('#diydataname').text();
        // 所有选配项集合
        var dataName = {};
        try {
            dataName = eval("(" + diyDataName + ")");
        } catch (e) {}
        // 选配包view360栏位集合txt
        var view360Config = $('#diyconfig').text();
        // 定制车view360配置项集合txt转json
        var Data360 = {};
        try {
            Data360 = eval("(" + view360Config + ")");
        } catch (e) {}
        // 指定定制车的配置数据json
        var diyProduct = Data360[productId],
            diyConfig = diyProduct.config,
            pathDomain = diyConfig.pathDomainDe,
            diyPacks = diyConfig.packs;

        // 选配包相关
        var packs = {
            // 当前选配包数量
            count: _.keys(diyPacks.sets).length - diyPacks.leastNum,
            // 选配包验证提示语
            msg: {
                checkPackMeg: diyPacks.checkPackMeg
            },
            // 需要细节展示的选配包集合
            specPacks: diyPacks.specPacks,
            // 需要动态展示（视频方式）的选配包集合
            aniPacks: diyPacks.aniPacks
        };

        // 常用dom容器
        var xBodyEl = $(document.body),
            // 页面最外层容器
            xContainer = "#xContainer",
            // 主导航区域
            detailNavEl = $("#js-detailsNav"),
            // 页面内容区
            xContent = $('.details-container'),
            // 确认购买页面头部
            confirmOrderHeaderEl = $('.confirm-order-header'),
            // 定制车总容器
            carBuilderWrapEl = $("#carBuilderWrap"),
            // 汽车选配容器
            goodsViewerEl = $("#goodsViewer"),
            // 360旋转外部容器
            viewBox360EL = $("#viewBox360"),
            // config部分外层容器
            xConfig = $("#carConfig"),
            // 拖动鼠标目标dom
            touchHandleEl = $("#viewTouch"),
            // 立即购买按钮
            oBuyImmediatelyBtn = $('.buy-immediately');

        // 360旋转分层容器
        var container360 = "#view360Wrap",
            container360El = $(container360);

        // 款型容器
        var rangeEl = $("#modelType");

        // 页面首次加载
        var isLoading = true;

        var loading = new Loading({
            el: "#onLoading"
        });
        var loading360 = new Loading({
            el: "#onLoading360"
        });

        // 滚动检测点
        var offsetT = 180,
            panelItem = $(".level-1", "#carConfig"),
            configST = parseInt(xContent.css("padding-top")) + 50;

        // 初始化360
        var view360 = new View360(diyProduct, {
            container: container360,
            minAngle: 0,
            maxAngle: 23,
            initAngle: !!diyConfig.view360 ? diyConfig.view360.initAngle : 2
			//,isWebp: !!BaseClient.getCookie("webp")
			//initExColor: CurrentColor
        });

        // 初始化选配关系
        var manager = new DiyManager(diyData, {
            selectorImpl: selectorImpl,
            settingImpl: settingImpl,
            buttonImpl: buttonImpl,
            imageImpl: imageImpl,
            stock: {
                productId: productId,
                callback: function() {
                    initInventory();
                    var tDom = $("#goodsPriceCheck");
                    tDom.hasClass("invisible") && tDom.removeClass("invisible");
                }
            }
        });
        // 所有SKU集合
        var allSKU = manager.getAllSKU();
        // 所有SKU的key集合

        var allSKUKeys = manager.getAllSKUKeys();

        /****** 专属函数区 ******/

        // 当前配置接口
        function settingImpl() {
            return {
                //keys为[k1,k2,k3],返回结果为{k1:v1,k2:v2}
                get: function(keys) {
                    var result = {};

                    if (keys) {
                        _.each(keys, function(key) {
                            xBodyEl.find("[data-key='" + key + "']").each(function(i, el) {
                                if ($(el).hasClass('active')) {
                                    result[key] = $(el).attr('data-value');
                                    return false;
                                }
                            });
                        });
                    }

                    return result;
                }
            }
        }

        // 图片接口
        function imageImpl() {
            return {
                doChange: function(data, isDetail, el) {
                    if (data) {
                        var key = _.keys(data)[0];
                        var value = data[key];

                        //console.log(key + "  :  " + value);
                        if ('none' == value) {
                            //$(key$).addClass("hide");
                            $("#" + key + " .panel-item-money").text("");
                        }

                        if (isDetail) {
                            // 当前元素的细节图的slider容器
                            var detailEl = $("#viewBox-" + key);

                            // 当前元素的细节图的显示控制柄元素
                            var tt = "";

                            // 如果需要显示细节图，需要在对应选项组html元素上配置属性：data-detail-view="true"
                            if (_.contains(packs.specPacks, key)) {
                                tt = $("#thumb-" + key);
                            }

                            if (value && 'none' !== value && (value.length > 0 && 'none' !== value[0] && "" !== value[0])) {
                                var i = detailEl.find(".flex-control-nav").find(".flex-active").text();

                                if (detailEl[0] && !_.contains(packs.aniPacks, key)) {
                                    _.each(value, function(iValue, i) {
                                        if (iValue) {
                                            detailEl.find(".slider-item-img").find("img")[i].src = pathDomain + iValue;
                                        }
                                    });
                                } else {
                                    detailEl.remove();
                                    createSlider(data, goodsViewerEl);

                                    detailEl = $("#viewBox-" + key);
                                    detailEl.find('.flexslider').flexslider({
                                        animation: "fade", // slide or fade
                                        slideDirection: "horizontal", // horizontal or vertical
                                        startAt: i - 1,
                                        animationLoop: true,
                                        slideshow: false,
                                        directionNav: true,
                                        touch: true,
                                        sync: "#carousel"
                                    });
                                    initGoodsViewer();
                                    resizePosTop();
                                }

                                if (!isLoading && !detailEl.hasClass("isShow")) {
                                    tt && showGoodsSlider(tt);
                                }
                            } else {
                                if ("" == value[0] && detailEl.hasClass("isShow")) {
                                    tt && hideGoodsSlider(tt);
                                }
                            }
                        } else {
                            if ("" !== value) {
                                if (loading360.isLoad) {
                                    // 排除指定的特殊选配包，不执行360 change逻辑
                                    if (!(_.contains(packs.specPacks, key))) {
                                        !loading360.isShow() && loading360.show();
                                        view360.change(data, loading360.hide);
                                    }
                                }
                            } else {
                                // 排除指定的特殊选配包，不执行360 change逻辑
                                if (!(_.contains(packs.specPacks, key))) {
                                    view360.change(data);
                                    loading360.isShow() && loading360.hide();
                                }
                            }

                            // 360展示容器控制柄
                            var t2 = $("#thumb-360");
                            if (!t2.hasClass("active")) {
                                hideGoodsSlider(t2);
                            }

                            //处理与车身同色
                            if ("exteriorColor" === key) {
                                var imgUrl = $(el).find("img")[0].src;
                                $("#roofColor").find(".sameAsBody").html("").html('<img src="' + imgUrl + '">');
                            }
                        }
                    }
                }
            }
        }

        // 按钮接口
        function buttonImpl() {
            return {
                //选中set接口
                setSelect: function(el, isSelect) {
                    //选中
                    if (isSelect) {
                        $(el).addClass("active");
                    }
                    //未选中
                    else {
                        $(el).removeClass("active");
                    }
                },

                //setHidden接口
                setHidden: function(el, isHidden) {
                    //隐藏
                    if (isHidden) {
                        $(el).addClass("hide");
                    }
                    //不隐藏
                    else {
                        $(el).removeClass("hide");
                    }
                },

                isHidden: function(el) {
                    return $(el).hasClass("hide");
                },

                //选中get接口
                isSelected: function(el) {
                    return $(el).hasClass("active");
                },

                //停用set接口
                setDisabled: function(el, isDisable) {
                    if (isDisable) {
                        $(el).addClass("disabled");
                    } else {
                        $(el).removeClass("disabled");
                    }
                },

                //停用get接口
                isDisabled: function(el) {
                    return $(el).hasClass("disabled");
                },

                //获取按钮value
                getValue: function(el) {
                    return $(el).attr("data-value");
                },

                //获取按钮key
                getKey: function(el) {
                    return $(el).attr("data-key");
                },

                //获取按钮图片value
                getImgValue: function(el) {
                    return $(el).attr("data-img-value");
                },

                //获取按钮图片key
                getImgKey: function(el) {
                    return $(el).attr("data-img-key");
                },

                //按钮选中回调
                doChange: function(oEl, isSelected, imgKey) {
                    var el = $(oEl);
                    var key = el.attr("data-key");

                    if (_.contains(allSKUKeys, key)) {
                        renderInventory(manager.getStockBySetting());
                    }

                    changePanelValue(el);

                    if (isSelected && imgKey) {
                        var dead = view360.getOptimizeInfo(imgKey);
                        if (dead && dead.isDead) {
                            view360.rotateTo(dead.optimize);
                        }
                    }
                }
            };
        }

        // 选择器接口
        function selectorImpl() {
            return {
                //通过key获取所属按钮集合
                getAllBtnByKey: function(key) {
                    return xBodyEl.find("[data-key='" + key + "']");
                },

                //通过对象获取该对象key
                getKeyByEl: function(el) {
                    return $(el).attr("data-key");
                },

                //通过对象获取所属分类对象
                getCatalogElByKey: function(key) {
                    return $("#" + key);
                }
            }
        }

        // 补足config元素的滚动高度
        function initLastSubsidy() {
            var lastPanelItem = $(panelItem[panelItem.length - 1]),
                panelTitleHArr = [];
            _.each(panelItem, function(iEl) {
                var el = $(iEl);
                panelTitleHArr.push(el.outerHeight());
            });
            offsetT = _.min(panelTitleHArr);
            var lastSubsidy = $(window).innerHeight() - configST - lastPanelItem.outerHeight() - offsetT;

            if (lastSubsidy > configST) {
                $(".site-ad-wrap").height(lastSubsidy);
            }
        }

        function calcLastSubsidy() {
            var lastPanelItem = $(panelItem[panelItem.length - 1]),
                tConfigST = parseInt(xContent.css("padding-top")) + 50;
            var lastSubsidy = $(window).innerHeight() - tConfigST - lastPanelItem.outerHeight() - offsetT;

            if (lastSubsidy > tConfigST) {
                $(".site-ad-wrap").height(lastSubsidy);
            } else if (lastSubsidy <= 0) {
                $(".site-ad-wrap").height(0);
            }
        }

        // 滚动响应改变导航栏
        function scrollForActive() {
            var containerST = xContent.scrollTop(),
                configOT = xConfig.offset().top,
                navs = detailNavEl.find(".nav-flag"),
                panelTitle = xConfig.find(".level-1"),
                navItemActive,
                panelTitleIdArr = [],
                panelTitleSTArr = [];

            _.each(panelTitle, function(iEl) {
                var el = $(iEl);
                panelTitleSTArr.push(el.offset().top);
                panelTitleIdArr.push(el.attr("id"));
            });

            var len = panelTitleSTArr.length - 1,
                min,
                max;

            while (len >= 0) {
                min = panelTitleSTArr[len] - configOT - offsetT;
                max = panelTitleSTArr[len] - configOT - offsetT + $(panelTitle[len]).height();

                if (containerST >= min && containerST <= max) {
                    $(navs[len]).addClass("active").siblings().removeClass("active");
                    navItemActive = panelTitleIdArr[len];
                }
                --len;
            }

            var tt = $("#thumb-" + navItemActive + "Color");
            if (navItemActive === "interior") {
                showGoodsSlider(tt);
            } else {
                hideGoodsSlider($("#thumb-360"));
            }
        }

        // 滚动到指定元素的id处
        function scrollTo(configs) {
            var config = configs || {},
                // 指定元素的id, 默认为body
                id = config.id || "body",
                // 滚动方向, 默认值为top, top or left
                dirc = (config.dirc && (config.dirc == "left" || config.dirc == "top")) ? config.dirc : "top",
                // 在指定方向上的边界值
                value = config.value || 0,
                // 控制滚动的速度, 默认值 默认500ms
                sec = (config.sec && config.sec >= 0 && config.sec <= 1000) ? config.sec : 500,
                // 得到指定id的offset, 包含两个值, top和left
                scroll_offset = $(id).offset(),
                // 获取scroll_offset_value
                scroll_offset_value = (dirc == "top") ? (scroll_offset.top - value) : (scroll_offset.left - value);

            if (xContent.scrollTop()) {
                xContent.animate({
                    scrollTop: scroll_offset_value
                }, sec);
            } else {
                if (id !== "body") {
                    xContent.animate({
                        scrollTop: scroll_offset_value
                    }, sec);
                }
            }
        }

        // goodsSlider管理
        function showSlider() {
            $('.flexslider').flexslider({
                animation: "fade", // slide or fade
                slideDirection: "horizontal", // horizontal or vertical
                animationLoop: true,
                slideshow: false,
                directionNav: true,
                touch: true,
                sync: "#carousel"
            });

            // 初始化#goodsViewer
            initGoodsViewer();
            resizePosTop();
            goodsViewerEl.css({
                "visibility": "visible"
            });
        }

        // 初始化#goodsViewer
        function createSlider(data, el) {
            var dom = "";

            _.each(_.keys(data), function(key) {
                var value = data[key];
                if ("" == value[0]) {
                    return false;
                }
                var iValue = _.map(value, function(v) {
                    if (v) {
                        if (_.indexOf("http") == -1) {
                            return pathDomain + v;
                        } else {
                            return v;
                        }
                    }
                });
                // iValue：完整的图片地址数组
                dom += _.template($("#slider-tpl").html(), {
                    key: key,
                    data: iValue,
                    aniPacks: packs.aniPacks,
                    getFileFormat: getFileFormat
                });
            });

            el.append(dom);
        }

        function initGoodsViewer() {
            var screenWidth = $(window).innerWidth(),
                screenHeight = $(window).innerHeight(),
                mainWidth = $("#xMain").width(),
                // 50为.details-container的上下margin
                detailsPadding = parseInt(xContent.css("padding-top")) + 50,
                goodsExpandHeight = $("#goodsExpand").outerHeight(),
                // goodsViewFuncHeight+goodsClassesHeight
                cutHeight = $("#goodsViewFunc").height(),
                remainHeight = screenHeight - goodsExpandHeight - cutHeight - detailsPadding * 2,
                carConHeight = goodsViewerEl.outerHeight() || remainHeight,
                ratioValue = Math.floor(carConHeight * 2);

            goodsViewerEl.removeAttr("style");
            if (screenWidth > screenHeight) {
                if (ratioValue <= Math.ceil(mainWidth)) {
                    goodsViewerEl.width(ratioValue);
                }
            }
        }

        // 360&静态图 slider处理
        function showGoodsSlider(el) {
            var dataId = el.attr("data-id");

            el.addClass("active").siblings().removeClass("active");

            /* $("#" + dataId).css({
             "z-index": "3",
             "visibility": "visible"
             }).siblings().css({
             "z-index": "1",
             "visibility": "hidden"
             });*/

            $("#" + dataId).addClass("isShow").siblings().removeClass("isShow");

            touchHandleEl.css({
                "z-index": "1",
                "visibility": "hidden"
            });

            if ("thumb-360" == el.attr("id")) {
                //$('#goodsArrow360').removeClass("hide");
                touchHandleEl.css({
                    "z-index": "20",
                    "visibility": "visible"
                });
            }
        }

        function hideGoodsSlider(el) {
            el.addClass("active").siblings().removeClass("active");
            //$("#thumb-360").addClass("active");
            //if (el.attr("id") !== "interiorColor") {
            //    $("#thumb-interiorColor").removeClass("active");
            //}
            $("#goodsViewBg").css({
                "visibility": "visible"
            });

            // $(viewBox360EL).css({
            //     "z-index": "3",
            //     "visibility": "visible"
            // }).siblings().css({
            //     "z-index": "1",
            //     "visibility": "hidden"
            // });

            $(viewBox360EL).addClass("isShow").siblings().removeClass("isShow");

            touchHandleEl.css({
                "visibility": "visible",
                "z-index": "20"
            });
        }

        // 刷新360图层容器在展示区的位置
        function resizePosTop() {
            var sliderViewerEl = $(".view-box"),
                screenWidth = $(window).innerWidth(),
                screenHeight = $(window).innerHeight(),
                detailsPadding = parseInt(xContent.css("padding-top")) + 50, //50为.details-container的上下margin
                goodsExpandHeight = $("#goodsExpand").outerHeight(),
                cutHeight = $("#goodsViewFunc").height(), //goodsViewFuncHeight + goodsClassesHeight
                remainHeight = screenHeight - goodsExpandHeight - cutHeight - detailsPadding * 2,
                carConHeight = goodsViewerEl.height() || remainHeight,
                sliderHeight = sliderViewerEl.height(),
                pos360Top = (carConHeight - sliderHeight) / 2,
                posSliderTop = (carConHeight - sliderHeight) / 2;

            if (screenWidth > screenHeight) {
                viewBox360EL.css({
                    "top": pos360Top
                });
                //$('#goodsViewBg').css({"top": pos360Top});
                sliderViewerEl.css({
                    "top": posSliderTop
                });
            } else {
                viewBox360EL.css({
                    "top": 0
                });
                //$('#goodsViewBg').css({"top": pos360Top});
                sliderViewerEl.css({
                    "top": 0
                });
            }
        }

        // 重设窗口
        function resizeWindow() {
            initGoodsViewer();
            resizePosTop();
            $(goodsViewerEl).css({
                "visibility": "visible"
            });
            calcLastSubsidy();
        }

        // 360 render完成后的回调
        function gone360() {
            /*检测当前车辆颜色
             if (CurrentColor) {
             console.log(CurrentColor);
             changeColor(parseInt(CurrentColor));
             }//*/
            loading360.isLoad = true;
            loading.hide();
            $("#goodsViewBg").removeClass("invisible");
            $(".view360-tips").removeClass("hide");
            $(container360 + ",#goodsArrow360").removeClass("hide");
            bindEvent();

                            videojs.options.flash.swf = "../rock/com/jquery-videojs/video-js.swf";

            isLoading = false;
        }

        // 初始化库存
        function initInventory() {
            renderInventory(manager.getStockBySetting());
        }

        function renderInventory(num) {
            var tBtn = $(".buy-immediately");
            var tStr = '缺货';
            if (num > 0) {
                tStr = '有货';
                tBtn.hasClass("disabled") && tBtn.removeClass("disabled");
                confirmOrderHeaderEl.hasClass("disabled") && confirmOrderHeaderEl.removeClass("disabled");
                confirmOrderHeaderEl.off().on("click", function() {
                    oBuyImmediatelyBtn.trigger('click');
                });
            } else {
                !tBtn.hasClass("disabled") && tBtn.addClass("disabled");
                !confirmOrderHeaderEl.hasClass("disabled") && confirmOrderHeaderEl.addClass("disabled");
                confirmOrderHeaderEl.off();
            }
            $("#goodsInventory").html(tStr);
        }

        /**
         * 更新控制面板上的价格等信息
         * @params el：需要改价的元素
         */
        function changePanelValue(el) {
            var key = el.attr("data-key"),
                isSkuEx = _.contains(allSKUKeys, key);

            if (el && el.hasClass("active")) {
                var tipCon = el.attr("data-content"),
                    tipPrice = parseInt(el.attr("data-price")).toFixed(2),
                    panelItemMoney = el.siblings().find(".panel-item-money"),
                    moneyStr = "&nbsp;&nbsp;-&nbsp;&nbsp;" + tipCon;
                var value = el.attr("data-value");
                var result = "";
                if (!isSkuEx) {
                    if (tipCon) {
                        if (!isNaN(tipPrice)) {
                            result = moneyStr + "&nbsp;&nbsp;-&nbsp;&nbsp;¥" + tipPrice;
                        } else {
                            result = moneyStr;
                        }
                        //if (!value || "none" == value) {
                        //    result = moneyStr;
                        //}
                    }
                }
                panelItemMoney.html(result);

                //el.popover('hide');
                $("#goods-" + key).text(tipCon);
            }
        }

        /**
         * 获取商品价格
         * @params data：商品集合
         */
        function getGoodsPrice(data) {
            var baseArr = data.skuPrice[0],
                optionPrice = data.packPrice;

            /*if (baseArr.length > 1) {
             baseArr = _.min(baseArr);
             $(".goods-price-section").css({"visibility": "visible"});
             } else {
             baseArr = _.min(baseArr);
             $(".goods-price-section").css({"visibility": "hidden"});
             }*/

            if (baseArr) {
                $(".base-price-money", "#goodsPriceBase").text(baseArr.toFixed(2)).siblings(".base-price-currency").show();
                $(".options-price-money", "#goodsPriceExt").text(optionPrice.toFixed(2)).siblings(".options-price-currency").show();
                $(".goods-price-money", "#goodsPriceCount").text((baseArr + optionPrice).toFixed(2)).siblings(".goods-price-currency").show().parent().find("span:first-child").show();
            } else {
                $(".base-price-money", "#goodsPriceBase").text("-").siblings(".base-price-currency").hide();
                $(".options-price-money", "#goodsPriceExt").text("-").siblings(".options-price-currency").hide();
                $(".goods-price-money", "#goodsPriceCount").text("暂未上市").siblings(".goods-price-currency").hide().parent().find("span:first-child").hide();
            }
        }


        /**
         * 通过页面获取当前sku配置数据集合
         * @params data：商品集合
         */
        function getSetting(data) {
            var result = {};
            if (data) {
                _.each(allSKUKeys, function(key) {
                    if (key != "GoodsId") {
                        rangeEl.find("[data-key='" + key + "']").each(function(i, el) {
                            if ($(el).hasClass('active')) {
                                result[key] = $(el).attr('data-value');
                                return false;
                            }
                        });
                    }
                });
            }
            return result;
        }

        /**
         * 根据当前sku刷新选配项
         * @param k：
         */
        function do_btn_filter(k) {
            //获取当前key允许值集合
            var values = manager.getGoodsAttrs(k, getSetting(allSKU));
            var v = "";
            //console.log('rel:');
            //console.log(values);
            //遍历当前key的所有值集合
            rangeEl.find("[data-key='" + k + "']").each(function(index, el) {
                //当前遍历项值
                v = $(el).attr('data-value');

                //当前值可使用
                if (_.indexOf(values, v) > -1) {
                    if ($(el).hasClass("disabled")) {
                        $(el).removeClass("disabled");
                    }
                }
                //当前值不可用
                else {
                    //当前值已选中
                    if ($(el).hasClass("active")) {
                        $(el).removeClass("active");
                    }
                    // 当前值置灰
                    if (!$(el).hasClass("disabled")) {
                        $(el).addClass("disabled");
                    }
                }
            });
        }

        /**
         * 处理当前点击项与#modelType的依赖关系
         * @param $theNode 当前点击的选配项
         */
        function diffSKU($theNode) {
            var key = $theNode.attr("data-key");
            var value = $theNode.attr("data-value");

            //用户所点击的项是否是可选的，可选的才能进行后面的操作
            if (!$theNode.hasClass("disabled")) {

                //依赖关系验证
                //遍历所有key
                _.each(allSKUKeys, function(k) {
                    //不是当前key的才验证依赖关系,el为需要验证的key
                    if (k != "goodsId" && k != "images" && k != "price") {
                        if (key != k) {
                            do_btn_filter(k);
                        }
                    }
                });
            }
        }

        // 操作选配项时的处理
        function diyGo(e) {
            var $theNode = $(e.currentTarget);

            // 当前选中项不可重复点击
            if ($theNode.hasClass("active") || $theNode.hasClass('disabled')) {
                return false;
            }

            // 处理按钮冲突及依赖
            manager.doButtonClick(e.currentTarget, true);

            diffSKU($theNode);

            // 处理价格计算
            getGoodsPrice(manager.getTotalPrice());
        }


        /***** 360旋转逻辑 *****/
        /* 旋转事件 */
        var direction = 0;
        var isRotate = false; //旋转状态
        var startX, lastX;
        // var _x = 0, _y = 0;
        // 初始时间
        var m_monitorStartTime = 0;
        // 采样率
        var speedTime = 5;
        // 渲染计时器
        var renderTicker = 0;
        // 旋转终点
        var targetF = 0;
        // 旋转当前点
        var currentF = 0;
        // 旋转总数
        var totalF = 23;

        // 旋转回调计时器
        var do_move_render_timer = function() {
            if (renderTicker === 0) {
                renderTicker = setInterval(do_move_render, 15)
            }
        };

        // 旋转回调
        var do_move_render = function() {
            //待旋转
            if (currentF != targetF) {
                var d = targetF < currentF ? Math.floor((targetF - currentF) * 0.1) : Math.ceil((targetF - currentF) * 0.1);

                currentF += d;
                //console.log("direction:"+direction)
                view360.rotate(d * -1, 1);

            } else {
                //moveCount = 0;
                window.clearInterval(renderTicker);
                renderTicker = 0;
            }
        };

        var calcRotatePara = function(oTarget) {
            if (m_monitorStartTime < new Date().getTime() - speedTime) {
                //console.log("starttime:"+m_monitorStartTime+"  "+(new Date().getTime() - 10));
                var start = parseInt(oTarget.clientX);
                if (start != lastX) {
                    direction = start > lastX ? -1 : 1;
                    var angle = Math.round(totalF * ((start - lastX) / 400)) * direction * -1; //totalF * 1
                    //console.log("angleM:" + angle);
                    if (angle > 0) {
                        view360.rotate(direction, angle);
                        lastX = start;
                    }
                    m_monitorStartTime = new Date().getTime();
                }

                /*if(start != lastX){
                 var dis = start - lastX;
                 targetF = currentF + Math.ceil((totalF - 1) * 10 * (dis / 500));
                 do_move_render_timer();
                 m_monitorStartTime = new Date().getTime();
                 lastX = start;
                 }*/
            }
        };

        // 桌面端拖动旋转事件响应
        var onDown = _.throttle(function(ev) {
            if (isRotate) {
                return;
            }

            var e = ev || window.event;
            var oTarget = e.target || e.srcElement;

            isRotate = true;

            $(".view360-tips").remove();
            startX = parseInt(e.clientX);
            lastX = startX;

            xBodyEl.on("mousemove", onMove).on("mouseup", onUp);

            //设置捕获范围
            if (oTarget.setCapture) {
                oTarget.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            //防止拖拽时，图片被选中
            return false;
        }, 200);
        var onMove = function(ev) {
            if (!isRotate) {
                return;
            }
            calcRotatePara(ev || window.event);
            //防止拖拽时，图片被选中
            return false;
        };
        var onUp = function(ev) {
            isRotate = false;
            direction = 0;
            var e = ev || window.event;
            var oTarget = e.target || e.srcElement;

            //if (_x < 0 || _x > touchHandleEl.width()) {
            //    //console.log("越界");
            //}
            // 解除绑定
            xBodyEl.off('mouseup').off('mousemove');

            if (oTarget.releaseCapture) {
                oTarget.releaseCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
        };

        // 移动端拖动旋转事件响应
        var touchStart = function(e) {
            var oTarget = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
            e.preventDefault();
            //当拇指按下时设定为true
            isRotate = true;
            $(".view360-tips").remove();
            lastX = parseInt(oTarget.clientX);
            xBodyEl.on("touchend", touchEnd);
            touchHandleEl.on("touchmove", touchMove);
        };
        var touchMove = function(e) {
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (!isRotate || e.originalEvent.targetTouches.length > 1 || e.scale && e.scale !== 1) {
                return;
            }
            e.preventDefault();
            var oTarget = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
            calcRotatePara(oTarget);
            //防止拖拽时，图片被选中
            return false;
        };
        var touchEnd = function() {
            isRotate = false;
            // 解除绑定
            xBodyEl.off('touchend');
            touchHandleEl.off('mousemove');
        };

        // 键盘旋转事件响应
        var onKey = _.throttle(function(event) {
            var e = event || window.event;
            var key = e.keyCode || e.which || e.charCode;

            // left-up
            if (e && (key == 37 || key == 38)) {
                direction = 1;
            }
            // right-down
            if (e && (key == 39 || key == 40)) {
                direction = -1;
            }
            if (direction) {
                view360.rotate(direction, 1);
                direction = 0;
            }
        }, 100);

        // 事件绑定函数
        function bindEvent() {
            //PC端
            touchHandleEl.off("mousedown").on("mousedown", onDown);
            //键盘
            xBodyEl.off("keydown").on("keydown", onKey);
            //移动端
            if (isMobile) {
                touchHandleEl.off("touchstart").on("touchstart", touchStart);
            }
        }

        // 返回backbone view
        return RockBase.View.extend({
            id: "carDiy",
            render: function() {
                //return this;
                //this.doInitFirst();
                this.doInit();
            },
            onShow: function() {
                var me = this;

                if (goodsStatus === "1") {
                    $(".goods-sell-stop").addClass("hide");
                } else {
                    $(".goods-sell-stop").siblings().addClass("hide");
                }
                //$('.car-header').off();

                // 更新库存
                renderInventory(manager.getStockBySetting());

                // mini购物车刷新
                Cart.reload();

                // 进入页面时提交用户数据
                me.submitUserData();

                // 购买按钮事件处理
                me.goBuy();

                // 导航栏点击处理
                var navFlag = detailNavEl.find(".nav-flag");

                navFlag.off();

                detailNavEl.on("click", ".nav-flag", function(e) {
                    var tt = e.currentTarget;
                    if (!$(tt).hasClass("active")) {
                        $(tt).addClass("active").siblings().removeClass("active");
                    }
                });

                var activeEl;
                navFlag.each(function(i, el) {
                    if ($(el).hasClass("active")) {
                        activeEl = el;
                        return false;
                    }
                });

                if (activeEl) {
                    $(activeEl).trigger('click');
                } else {
                    detailNavEl.find('.menu').removeClass("active");
                    detailNavEl.find('.nav-flag[data-href="#exterior"]').addClass("active");
                }

                // 重设窗口
                $(window).resize(resizeWindow);
            },
            doInit: function() {
                var me = this;

                // 显示loading
                loading.show();

                // 初始化个性定制配置项
                me.initConfig();

                // 初始化viewBox-slider
                showSlider();

                // 初始化个性定制滚动补间
                initLastSubsidy();

                // 更新个性定制配置项
                me.diyConfig();

                /* 滚动条处理 */
                // 滚动响应改变导航栏
                var scrollTimeout = false;
                xContent.on("scroll", function() {
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    // 防止导航菜单背景因滚动条滚动而乱跳
                    scrollTimeout = setTimeout(function() {
                        scrollForActive();
                    }, 50);
                });

                // 导航栏点击滚动
                detailNavEl.on("click", ".nav-flag", _.throttle(function(e) {
                    var tt = $(e.currentTarget).attr("data-href");
                    var contentOT = $("#carConfig").offset().top;
                    if (tt) {
                        scrollTo({
                            id: tt,
                            value: contentOT
                        });
                    }
                    return false;
                }, 500));

                // 按钮事件——360和静态图切换
                $("#goodsClasses").on("click", ".goods-classes-item", function(e) {
                    var t3 = $(e.currentTarget);
                    if (!t3.hasClass("active")) {
                        showGoodsSlider(t3);
                    } else {
                        //hideGoodsSlider(t3);
                    }
                });

                // 显示config部分的tips
                $(".optbtn-pic").popover({
                    trigger: 'hover',
                    placement: 'top',
                    delay: { show: 100, hide: 150 }
                });

                // 弹出层滑动
                //var xSideEl = $(".x-side");
                var _instance = null;
                xBodyEl.on("click", ".js-popInfo", function(e) {
                    var tt = $(e.currentTarget),
                        dataId = tt.attr("data-id");

                    if (!xBodyEl.hasClass("page-move")) {
                        /*if ("config" == dataId) {
                         xSideEl.addClass("para");
                         } else {
                         xSideEl.removeClass("para");
                         }*/
                        xBodyEl.addClass("page-move");
                    }

                    switch (dataId) {
                        // 查看配置参数
                        case "config":
                            {
                                $("#xSideConfig").show().siblings().hide();
                                if (_instance === null) {
                                    _instance = Params.init("#xSideConfig", {
                                        productId: productId
                                    });
                                    _instance.render();
                                }

                                break;
                            }
                            // 查看商品评价
                        case "comment":
                            {
                                $("#xSideComment").show().siblings().hide();
                                var popu = new Pop("#xSideComment", "comment", {
                                    id: productId
                                });
                                popu.render();

                                break;
                            }
                            // 查看商品信息
                            //case "info":{break;}
                    }
                }).on("click", ".close-overlay", function() {
                    if (xBodyEl.hasClass("page-move")) {
                        /*if (xSideEl.hasClass("para")) {
                         xSideEl.removeClass("para");
                         }*/
                        xBodyEl.removeClass("page-move");
                    }
                });

                /* config菜单
                 // 折叠config菜单
                 xConfig.on("click", ".panel-title", function (e) {
                 var tt = $(e.currentTarget).siblings(".panel-con");
                 tt.slideToggle(300);
                 });

                 //冲突列表
                 $("#carConfig").on("click", ".pop-conflication-list", function (e) {
                 $("#xSideInfo").html("");
                 var t2 = $(e.currentTarget);
                 if (t2) {
                 if (!xBodyEl.hasClass("page-move")) {
                 xBodyEl.addClass("page-move");
                 }
                 }
                 });*/
            },
            doInitFirst: function() {
                var carDiyGo = $('#carDiyGo');
                //内部页面切换
                function showNext() {
                    carBuilderWrapEl.removeClass("first");
                    //loading.show();
                    container360El.removeClass("hide");

                    detailNavEl.on("click", ".menu", function(e) {
                        var tt = $(e.currentTarget).attr("data-href");
                        var contentOT = $("#carConfig").offset().top;
                        if (tt) {
                            scrollTo({
                                id: tt,
                                value: contentOT
                            });
                        }
                        return false;
                    });
                    carDiyGo.off('click');
                }

                carDiyGo.on('click', showNext);

                // 款型后退页面处理逻辑
                $('#carModelType').on('click', function() {
                    carBuilderWrapEl.addClass("first");
                    carDiyGo.on('click', showNext);
                    detailNavEl.off("click");
                });
            },
            initEmission: function() {
                //select的下拉事件以及选中选项的事件
                var dropDownMenuEl = emissionEl.find(".dropdown-menu");

                dropDownMenuEl.html("").html(getProvinces());
                $('.dropdown-toggle').dropdown();

                //初始化用户位置
                initEmissionLocal(defaultLocal);
                initLocal();

                emissionEl.find(".dropdown-menu").on("click", "li", function(ev) {
                    var oEvent = ev || event,
                        oTarget = $(oEvent.currentTarget);

                    var currentText = oTarget.text(),
                        currentId = oTarget.find("a").attr("data-id"),
                        currentEmission = oTarget.find("a").attr("data-emission");

                    var container = oTarget.parent().siblings(".select-btn"),
                        el = emissionEl.find("." + currentEmission);

                    container.attr("data-id", currentId).text(currentText);
                    el.addClass("active").siblings(".optbtn").removeClass("active");
                    changeEmissionPanelValue(el);

                    //更新库存
                    renderInventory(manager.getStockBySetting());
                });
            },
            initConfig: function() {
                //var me = this;

                //初始化排放标准
                //me.initEmission();

                //url中的默认值
                var init = BaseClient.request("setting");

                if (init) {
                    try {
                        init = eval("(" + init + ")");
                    } catch (e) {}
                }

                var defaults_setting = manager.getDefaults(init);
                var defaultImg = defaults_setting.images;

                //初始化view360
                view360.render({
                    defaults: defaultImg,
                    callback: gone360
                });

                var detailImg = defaults_setting.details;

                createSlider(detailImg, goodsViewerEl);

                var defaults = defaults_setting.setting;

                _.each(_.keys(defaults), function(key) {
                    xBodyEl.find("[data-key='" + key + "']").each(function(i, el) {
                        if ($(el).attr("data-value") == defaults[key]) {
                            manager.setKeyValue(key, defaults[key], true);
                            //$(el).addClass('select');
                        }
                    });
                });
                //修复拉花按钮组高度抖动问题
                $('#noSelect').addClass("hide");

                getGoodsPrice(manager.getTotalPrice());
            },
            diyConfig: function() {
                // 选择配置
                $('#carConfig').on("click", ".js-opt", diyGo);
            },
            goBuy: function() {
                /*$("#addCartModal").on("click", ".goon-buy", function () {
                 $('#addCartModal').modal('hide');
                 });

                 $("#addCartModal").on("click", ".go-cart", function () {
                 window.location.href = "../cart/index.html";
                 });

                 //加入购物车
                 xBodyEl.on('click',
                 '.join-shopping-cart', function () {

                 var data = []; var car = {}; car.id = "10309";
                 car.count = 1; data.push(car);
                 Cart.add(JSON.stringify(data));
                 //$('#addCartModal').modal(); });*/

                // 立即购买
                var immeBugFun = function(event) {
                    var oTarget = $(event.target);

                    if (oTarget.hasClass("disabled")) {
                        return false;
                    }

                    oTarget.addClass("disabled");

                    var token = BaseClient.getCookie("token");

                    var closeFunc = function() {
                        oTarget.removeClass("disabled");
                    };

                    if (token) {
                        //获取选配结果
                        var result = manager.getResult();
                        var tGoodsId = result.skuId;
                        var pack = result.pack;

                        if (pack.values && (pack.total == pack.values.length)) {
                            var optionalInfo = _.reduce(pack.values, function(r, p) {
                                //if (p.id && p.id.indexOf("none") != 0)
                                r.push(p);
                                return r;
                            }, []);

                            //选配包数量验证
                            if (result.pack.none.length > packs.count) {
                                showDialog(packs.msg.checkPackMeg, closeFunc);
                            } else {
                                optionalInfo = _.reduce(pack.values, function(r, p) {
                                    if (p.id && p.id.indexOf("none") != 0)
                                        r.push(p);
                                    return r;
                                }, []);

                                var carDetail = [{ id: tGoodsId + "", optionalInfo: optionalInfo, count: 1 }];
                                var carInfo = BaseClient.putPageParam(JSON.stringify(carDetail));

                                RockBase.navigate("confirmOrder/index?type=diy&orderInfo=" + carInfo);
                            }

                        } else {
                            var txt = '';

                            _.each(_.values(_.omit(dataName, _.keys(settingImpl().get(manager.getAllKeys())))), function(t, index, list) {
                                txt += t + (index == list.length - 1 ? "" : "、");
                            });

                            showDialog("请选择" + txt, closeFunc);
                        }
                    } else {
                        var url = window.location.href;
                        var param = manager.getSettingUrlParam();

                        if (!_.isEmpty(param)) {
                            url = url.split('\?')[0] + "?setting=" + JSON.stringify(param);
                        }

                        window.location.href = "../login/login.html" + (url ? ("?redirect=" + encodeURIComponent(url)) : "");
                    }
                };

                oBuyImmediatelyBtn.off().on('click', immeBugFun);
                //$('.car-header').off();
            },
            //进入页面的时候提交用户浏览的数据
            submitUserData: function() {
                var me = this;

                Client.openPage({
                    goodsId: productId,
                    beforeSend: function() {},
                    success: function(data) {

                        //ajax返回成功
                        if (data.result == 0) {
                            //console.log("用户的浏览数据提交");
                        }
                    },
                    error: function(error) {

                    }
                });
            }
        });
    }
);
