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
