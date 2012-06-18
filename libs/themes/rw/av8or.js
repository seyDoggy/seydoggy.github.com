/*
	Frehmwerk
	(c) 2012, Adam Merrifield
	http://seydesign.com/frehmwerk
*/

/* Theme JavaScript
	Table of Contents
==================================================
	Variables
	FUNCTIONS
		SS3
		Top Function
		Middle Function
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/* Frehmwerk
	================================================== */
	$.frehmwerk();
	
	var theme_default_Functions = (function(){
		/* Variables
		================================================== */
		var jq = $([]),
		div_wide = jq.add('div.wide'),
		div_narrow = jq.add('div.narrow'),
		div_bottom = jq.add('div.bottom');
		div_blog_entry = jq.add('div.blog-entry'),
		
		/* FUNCTIONS
		================================================== */
		
		/* SS3
		================================================== */
		$.SeydoggySlideshow({
			wrapper : '.header',
			bgPosition : 'center center',
		});

		
		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// style toolbar 1
			sdNav.tb1.find('ul ul')
				.find('li:first-child > a').addClass('radiusTop')
				.end().find('li:last-child > a').addClass('radiusBottom');
				
			// if IE9
			if (sdNav.IE9 == true) {
				// mask bleed of gradient items with radius
				(function($){$.fn.ie9gradius=function(){$(this).each(function(){if((parseInt($(this).css("borderTopLeftRadius"))>0||parseInt($(this).css("borderTopRightRadius"))>0||parseInt($(this).css("borderBottomLeftRadius"))>0||parseInt($(this).css("borderBottomRightRadius"))>0)&&$(this).css("filter")!=""&&$(this).css("filter").match(/DXImageTransform\.Microsoft\.gradient/i)!=null){var s="border-top-left-radius: "+parseInt($(this).css("borderTopLeftRadius"))+"px;";s+="border-top-right-radius: "+parseInt($(this).css("borderTopRightRadius"))+"px;";s+="border-bottom-left-radius: "+parseInt($(this).css("borderBottomLeftRadius"))+"px;";s+="border-bottom-right-radius: "+parseInt($(this).css("borderBottomRightRadius"))+"px;";var c1=$(this).css("filter").match(/startcolorstr\=\"?\'?\#([0-9a-fA-F]{6})\'?\"?/i);var c2=$(this).css("filter").match(/endcolorstr\=\"?\'?\#([0-9a-fA-F]{6})\'?\"?/i);if(c1!=null){if(c1.length==2){c1=c1[1]}else{c1=null}}if(c2!=null){if(c2.length==2){c2=c2[1]}else{c2=null}}if(c1==null&&c2!=null){c1=c2}else{if(c2==null&&c1!=null){c2=c1}}var g="";if(c1!=null){var g="filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#"+c1+"', EndColorStr='#"+c2+"');"}var id="ie9gradius_"+parseInt(Math.random()*100000);$(this).css("filter","").css("position","relative");$(this).mouseenter(function(){$("#"+id).addClass("gradiusover")}).mouseleave(function(){$("#"+id).removeClass("gradiusover")});$(this).find("> *:not(ul)").css("position","relative");$(this).prepend('	            <div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"> 	                <div style="'+s+' height: 100%; overflow: hidden;"> 	                    <div id="'+id+'" style="'+g+' height: 100%; width: 100%;"> 	                    </div></div></div>')}});return $(this)}})(jQuery);
				sdNav.tb2.find('a').add(sdNav.tb3).find('a').ie9gradius();
			}
			
		})();
		/* Middle Functions
		================================================== */
		var middle_fn = (function(){
			// style toolbar 2
			sdNav.tb2.find('ul ul')
				.find('li:first-child > a').addClass('radiusTop')
				.end().find('li:last-child > a').addClass('radiusBottom');
			
			// style toolbar 3
			if (sdNav.tb3.find('ul li').length <= 1) sdNav.tb3.find('a').addClass('radiusAll');
			else sdNav.tb3.find('ul').find('li a').first().addClass('radiusTop')
					.end().end().find('li a').filter(':visible').last().addClass('radiusBottom');
			
			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				nav_toolbar3.addClass('radiusAll');
				if (nav_toolbar3.find('ul li').length <= 1) nav_toolbar3.find('a').addClass('radiusAll');
				else nav_toolbar3.find('ul').find('li a').first().removeClass('radiusLeft radiusRight').addClass('radiusTop')
						.end().end().find('li a').filter(':visible').last().removeClass('radiusLeft radiusRight').addClass('radiusBottom');
			}
			// blog styles
			if (div_blog_entry.length) {
				// make each post separate
				// div_blog_entry.addClass('radiusAll boxShadowOuter');
				div_blog_entry.each(function(){
					$(this).wrap('<div class="blog-entry-wrapper radiusAll boxShadowOuter"/>');
					$(this).find('h1.blog-entry-title').insertBefore($(this)).addClass('radiusTop');
					$(this).find('div.blog-entry-date').insertAfter($(this)).addClass('radiusBottom');
				});
			}
		})();
	})();
});
