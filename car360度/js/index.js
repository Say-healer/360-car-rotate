var audioEle = document.getElementsByTagName("audio");
var flag1=true,flag2=true,flag3=true,flag4=true,flag5=true,flag6=true;
var mySwiper=new Swiper(".swiper-container",{
		initialSlide : 0,
	 	direction : 'vertical',
	 	autoplayDisableOnInteraction:false,
	 	grabCursor : true,
	    onInit: function(swiper){ 
		    swiperAnimateCache(swiper);  
		    swiperAnimate(swiper);
	    }, 
	    onSlideChangeEnd: function(swiper){ 
	        swiperAnimate(swiper);
	        /*if (swiper.activeIndex=="2") {
	        	audioEle[1].play();
		    	audioEle[0].pause();
		    	$(".music").removeClass("demo");
		    }else{
		    	audioEle[1].pause();
		    	audioEle[0].play();
		    	$(".music").addClass("demo");
		    }*/
		    if (swiper.activeIndex=="5") {
		    	$(".sa").css({"display":"block"});
		    	$(".sb").css({"display":"block"});
		    	$(".q").css({"display":"none"});
		    	$(".w").css({"display":"none"});
		    	$(".e").css({"display":"none"});
		    	$(".r").css({"display":"none"});
		    }
	        if (swiper.activeIndex=="6") {
	        	$(".fourbc").css("display","block");
		    	$(".clickw").css("display","block");
		    	$(".back").css("display","block");
	        }
	        if (swiper.activeIndex=="4") {
	        	$(".carf").css({
	        		"left":"-2.65rem",
					"top": "3.40rem"
	            });
	            $(".biglight").css("display","none");
	        }
	    }
});
$(".light").click(function(){
	if (flag1) {
	    $(".biglight").css("display","block");
	    flag1=false;
	}else{
		$(".biglight").css("display","none");
		flag1=true;
	}
});
$(".clickw").click(function(){
	$(".fourbc").css("display","none");
	$(this).css("display","none");
	$(".back").css("display","none");
});
$(".face").click(function(){
	if (flag4) {
    	$(".carf").animate({
    		"left":"0.60rem",
    		"top": "1.40rem"
        },100);
        flag4=false;
	}else{
		$(".carf").animate({
    		"left":"-2.65rem",
			"top": "3.40rem"
    	},100);
    	flag4=true;
	}
});
$(".sheel").click(function(){
	if (flag5) {
    	$(".carf").animate({
    		"top":"1.00rem",
    		"left":"-4.00rem"
        },100);
        flag5=false;
	}else{
		$(".carf").animate({
    		"left":"-2.65rem",
			"top": "3.40rem"
    	},100);
    	flag5=true;
	}
});
/*$(".sheel").click(function(){
	if (flag5) {
    	$(".carf").animate({
    		"top":"100px",
    		"left":"-400px"
        },100);
        flag5=false;
	}else{
		$(".carf").animate({
    		"left":"-265px",
			"top": "340px"
    	},100);
    	flag5=true;
	}
});*/
 $(".con").click(function(){
 	$(".hand3").css("display","none");
	if(flag2){
		audioEle[2].play();
		audioEle[0].pause();
		$(".music").removeClass("demo");
		flag2=false;
		flag3=true;
	}else{
		audioEle[2].pause();
		flag2=true;
	}
});
$(".music").click(function(){
	if (flag3) {
		audioEle[0].pause();
		$(".music").removeClass("demo");
		flag3=false;
	}else{
		audioEle[0].play();
		audioEle[2].pause();
		$(".music").addClass("demo");
		flag3=true;
		flag2=true;
	}
});
$(".sa").click(function(){
	$(".sa").fadeOut(100);
	$(".sb").fadeOut(100,function(){
		$(".q").fadeIn(1000);
		$(".w").fadeIn(1000,function(){
			$(".q").fadeOut(1000);
			$(".w").fadeOut(1000,function(){
				$(".e").fadeIn(1000);
		        $(".r").fadeIn(1000,function(){
		        	$(".e").fadeOut(1000);
					$(".r").fadeOut(1000,function(){
						$(".sa").css("display","block")
						$(".sb").css("display","block");
					});				
		        });
			});
		});
	});	
});
$(".face , .light , .sheel").click(function(){
	$(".hand1").css("display","none");
});
$(".sa").click(function(){
	$(".hand2").css("display","none");
});
$(function(){
	$("form").validate({
			rules:{
				name:"required",
			    phone:{
			    	required:"true",
			    	maxlength:13
			    },
			    email:{

			    }
			},
			messages:{
				name:"姓名不能为空",
				phone:{
					required:"留言不能为空",
					maxlength:"字符超过规定长度"
				}	
			}	
	});
});