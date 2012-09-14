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
	
	var av8or_default_Functions = (function(){
		/* Variables
		================================================== */
		var jq = $([]),
		div_titleBlock = jq.add('div.titleBlock'),
		h1_site_title = div_titleBlock.find('h1#site_title'),
		h2_site_slogan = div_titleBlock.find('h2#site_slogan'),
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
			plusClass : 'radiusAll'
		});

		
		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// style toolbar 1
			sdNav.tb1.find('ul ul')
				.find('li:first-child > a').addClass('radiusTop')
				.end().find('li:last-child > a').addClass('radiusBottom')
				.end().find('li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');

			// if IE9
			if (sdNav.IE9 === true) {
				// mask bleed of gradient items with radius
				sdNav.tb2.find('li').ie9gradius();
				sdNav.tb3.find('a').css('border-radius','0');
			}
			// title styles
			if (!h1_site_title.html() && !h2_site_slogan.html()) div_titleBlock.css('display','none');
		})();
		/* Middle Functions
		================================================== */
		var middle_fn = (function(){
			// style toolbar 2
			sdNav.tb2.find('ul ul')
				.find('li:first-child > a').addClass('radiusTop')
				.end().find('li:last-child > a').addClass('radiusBottom');
			
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
		/* Responsive Functions
		================================================== */
		responsive_fn = (function(){
			// title/slogan styles if less then 1024 and @media query is used
			if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length) jq.add('hgroup.titles').css('text-align','left');
			
			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				// show nested sub pages
				if (nav_toolbar3.find(" > ul li > ul")) {
					nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block")
				}
			}
		})();
	})();
});