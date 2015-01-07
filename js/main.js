define(function(require, exports, module) {

  var $ = require("jquery");
  //var iScroll = require("iscroll");

  $(function(){
    //var containBg = $("#contain-bg"),containSocial = $("#contain-social"),containImage = $("#contain-image"),containLocation = $("#contain-location");

    //倒计时
    var timer = $(".timer"),d = timer.find(".timer-day"),h = timer.find(".timer-hour"),m = timer.find(".timer-minute"),s = timer.find(".timer-second");
    var CountDown = function(deadline){
      this.timeHandler = null;
      this.handler = function(){
        var now = new Date,diff = (deadline.getTime() - now.getTime())/1000;
        if(diff >= 0){
          var day = Math.floor(diff/86400);
          var hour = Math.floor(diff/3600 % 24);
          var minute = Math.floor(diff/60 % 60);
          var second = Math.floor(diff % 60);

          d.html() == day ? $.noop() : d.html(day);
          h.html() == hour ? $.noop() : h.html(hour);
          m.html() == minute ? $.noop() : m.html(minute);
          s.html(second);
        }else{
          if(this.timeHandler){
            clearInterval(this.timeHandler);
          }
        }
        //console.log(this.timeHandler);
      };
      this.start = function(){
        var that = this;
        this.timeHandler = setInterval(function(){
          that.handler();
        },1000);
      };
    };
    var cd = new CountDown(new Date(2015,0,27,18));
    //var cd = new CountDown(new Date(2015,4,26,16,11,30)); //TODO:输入参数1
    cd.start();

    //背景轮轮播
    var bgSlide = function(j){
      var $bgItem = $(".img-bg-item");
      /*setTimeout(function(){
        $body.attr("class","img-bg img-bg-" + (j = ++j % 3 +1));
        bgSlide(j);
        //console.log("j:%s,time:%s",j,time);
      },5000 * Math.random() + 5500);*/
    };
    bgSlide(1);

    //按钮点击样式及事件
    var clickTuple = {
      changeStyle:{
        social:"zoomInLeft zoomOutLeft",
        image:"flipInX flipOutX",
        location:"rotateInUpRight rotateOutUpLeft"
      },
      socialEvent:function(){
      },
      imageEvent:function(){
        imageObject.init();
      },
      locationEvent:function(){
        locationObject.init();
      }
    };
    $(".button").click(function(){
      var flag = $(this).addClass("button-visited").data("flag");
      $(".button-close").removeClass("button-close-rotate");
      clickTuple.bg = clickTuple.bg || $("#contain-bg");
      clickTuple[flag] = clickTuple[flag] || $("#contain-" + flag);
      clickTuple.bg.toggleClass("fadeInDown fadeOutDown");
      clickTuple[flag].show().toggleClass("fadeInUp fadeOutUp");
      clickTuple[flag + "Event"]();
    })

    $(".button-section").click(function(e){
      var flag = $(this).find(".button-close").addClass("button-close-rotate").data("flag");
      if(flag){
        clickTuple[flag].toggleClass("fadeInUp fadeOutUp");
        clickTuple.bg.toggleClass("fadeInDown fadeOutDown");
        setTimeout(function(){ //防止误按，这里要重置
          $(".contain-child").attr("class","contain-child animated fadeOutUp fast").hide();
          clickTuple.bg.attr("class","contain-bg animated fadeInDown");
        },500);
      }
      e.stopImmediatePropagation();
    });

    var imageObject = {
      init:function(){
        require.async("swipebox",function(){
          $('.swipebox').swipebox();
        });
      }
    };

    var locationObject = {
      flag:false,
      map:null,
      point:[112.80669,22.457794],
      init:function(){
        if(this.flag) return;
        this.flag = !this.flag;

        var that = this,map;

        //创建地图函数：
        function createMap(){
          map = new BMap.Map("contain-bmap");//在百度地图容器中创建一个地图
          var point = new BMap.Point(that.point[0],that.point[1]);//定义一个中心点坐标
          map.centerAndZoom(point,13);//设定地图的中心点和坐标并将地图显示在地图容器中
          locationObject.map = map;
        }

        //地图事件设置函数：
        function setMapEvent(){
          map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
          map.enableScrollWheelZoom();//启用地图滚轮放大缩小
          map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
          map.enableKeyboard();//启用键盘上下左右键移动地图
        }

        //地图控件添加函数：
        function addMapControl(){
          //向地图中添加缩放控件
          var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
          map.addControl(ctrl_nav);
          //向地图中添加缩略图控件
          var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
          map.addControl(ctrl_ove);
          //向地图中添加比例尺控件
          var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
          map.addControl(ctrl_sca);
        }

        //标注点数组
        var markerArr = [{title:"婚宴地点",content:"泮村乡上坑村",point:that.point,isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
        ];
        //创建marker
        function addMarker(){
          for(var i=0;i<markerArr.length;i++){
            var json = markerArr[i];
            var p0 = that.point[0];
            var p1 = that.point[1];
            var point = new BMap.Point(p0,p1);
            var iconImg = createIcon(json.icon);
            var marker = new BMap.Marker(point,{icon:iconImg});
            var iw = createInfoWindow(i);
            var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
            marker.setLabel(label);
            map.addOverlay(marker);
            label.setStyle({
              borderColor:"#808080",
              color:"#333",
              cursor:"pointer"
            });

            (function(){
              var index = i;
              var _iw = createInfoWindow(i);
              var _marker = marker;
              _marker.addEventListener("click",function(){
                this.openInfoWindow(_iw);
              });
              _iw.addEventListener("open",function(){
                _marker.getLabel().hide();
              });
              _iw.addEventListener("close",function(){
                _marker.getLabel().show();
              });
              label.addEventListener("click",function(){
                _marker.openInfoWindow(_iw);
              });
              if(!!json.isOpen){
                label.hide();
                _marker.openInfoWindow(_iw);
              }
            })()
          }
        }
        //创建InfoWindow
        function createInfoWindow(i){
          var json = markerArr[i];
          var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
          return iw;
        }
        //创建一个Icon
        function createIcon(json){
          var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
          return icon;
        }


        function initMap(){
          createMap();//创建地图
          setMapEvent();//设置地图事件
          addMapControl();//向地图添加控件
          addMarker();//向地图中添加marker
          //geo();
        }

        initMap();//创建和初始化地图

      },
      geo:function(){
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
          }
        },{enableHighAccuracy: true})
      },
      wed:function(){
        map.panTo(r.point);
      }

  };


    //载入动画
    //整体滚动条
    //var bodyScroll = new iScroll("#contain-bg");
    //scrollObject.scroll(containBg);

    var preloader = $("#preloader");
    preloader.addClass("preloader-hide");
    setTimeout(function(){
      preloader.hide();
    },1000);

  });

});