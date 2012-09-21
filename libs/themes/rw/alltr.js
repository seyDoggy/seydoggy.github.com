/*
	alltr
	(c) 2012, Adam Merrifield
	http://seydesign.com/alltr
*/

/* Theme JavaScript
	Table of Contents
==================================================
	Variables
	FUNCTIONS
		SS3
		Top Functions
		Sidebar Function
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/* Frehmwerk
	================================================== */
	$.frehmwerk();
	
	var alltr_default_Functions = (function(){
		/* Variables
		================================================== */
		var jq = $([]),
		div_inner_top = jq.add('div.inner.top'),
		div_top = jq.add('div.top'),
		div_middle = jq.add('div.middle'),
		div_wide = jq.add('div.wide'),
		div_blog_entry = jq.add('div.blog-entry'),
		div_narrow = jq.add('div.narrow'),
		div_sidebar = jq.add('div#sidebar'),
		h3_sidebar_title = jq.add('h3#sidebar_title'),
		div_plugin_sidebar = jq.add('div#plugin_sidebar');
		group_plugin_sidebar = div_plugin_sidebar.find('div#blog-categories, div#blog-archives, ul.blog-tag-cloud, div#blog-rss-feeds');
		
		
		/* FUNCTIONS
		================================================== */
		
		/* SS3
		================================================== */
		$.SeydoggySlideshow({
			wrapper : '.header',
			bgPosition : 'center center'
		});

		
		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// style toolbar 1
			sdNav.tb1.find('ul ul')
				.find('li:first-child > a').addClass('radiusTop')
				.end().find('li:last-child > a').addClass('radiusBottom')
				.end().find('li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');
			
			if (sdNav.type >= 2) sdNav.tb1.css('display','none');
			
			// style ExtraContent12
			if (sdNav.type >= 2 || (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length)) {
				jq.add('div#extraContainer12').css({
					'position':'static',
					'width':'100%'
				}).addClass('boxShadowOuterTop');
			}
				
			// style toolbar 2
			var sumWidth = 0;
			sdNav.tb2.find('> ul').children().each(function(){
				sumWidth += $(this).width();
			}).end().find('> li:first-child > a').addClass('radiusLeft')
				.end().find('> li').last().after('<li class="last radiusRight"/>')
					.next().css('width',sdNav.tb2.width() - sumWidth - 2)
				.end().end().end().end().find('ul ul')
					.find('li:first-child > a').addClass('radiusTop')
					.end().find('li:last-child > a').addClass('radiusBottom')
					.end().find('li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');
			
			// resize li.last on window scale
			$(window).resize(function(){
				sdNav.tb2.find('> ul > li.last').css('width',sdNav.tb2.width() - sumWidth - 2);
			});

			// support for alltr v1.2.2 or <
			if (sdNav.tb2.find('> ul').css('position') != 'relative') {
				sdNav.tb2
					.find('> ul').css('position','relative')
						.find('> li').css('display','inline-block')
						.end().find('> li.last').css({
							'position':'absolute',
							'top':'0',
							'right':'0'
						});
			}

			// when header is shown
			if (div_top.find('div.header').css('display') == 'block') {
				sdNav.tb2.removeClass('radiusAll boxShadowOuter').addClass('radiusTop').css('margin-bottom','0')
					.find('> ul')
						.find('> li:first-child > a').removeClass('radiusLeft').addClass('radiusTopLeft')
						.end().find('> li.last').removeClass('radiusRight').addClass('radiusTopRight');
			}
			
			// when toolbar 2 is shown
			if (sdNav.tb2.css('display') == 'block') {
				div_top.find('div.header').removeClass('radiusAll').addClass('radiusBottom').css('border-top-style','none');
			}
			
			// if IE9
			if (sdNav.IE9 === true) {
				// mask bleed of gradient items with radius
				sdNav.tb2.add(sdNav.tb3).ie9gradius();
				// reduce the width of the .last item
				sdNav.tb2.find('ul > li.last').css('width',sdNav.tb2.width() - sumWidth - 2.4);
				// resize li.last on window scale
				$(window).resize(function(){
					sdNav.tb2.find('> ul > li.last').css('width',sdNav.tb2.width() - sumWidth - 2.4);
				});
			}
			
		})();
		
		/* Middle Functions
		================================================== */
		var middle_fn = (function(){
			// when blog page
			if (div_blog_entry.length) {
				// make each post separate
				div_blog_entry.addClass('radiusAll boxShadowOuter')
					.parent().removeClass('boxShadowOuter').css({
						'background':'transparent',
						'border':'none',
						'padding':'0'
					});
				// if !entry tags
				if (!div_blog_entry.find('p.blog-entry-tags').length) div_blog_entry.css('padding-bottom','3%');
				// add entry icons with font-awesome
				div_blog_entry.find('div.blog-entry-date').prepend('<i class="icon-calendar"/> &nbsp;');
				// add sidebar icons with font-awesome
				group_plugin_sidebar.prepend('<div class="before"><i/></div>');
				div_plugin_sidebar
					.find('div#blog-categories div.before')
						.find('i').addClass('icon-folder-close')
						.end().append('&nbsp; Categories:')
					.end().find('div#blog-archives div.before')
						.find('i').addClass('icon-calendar')
						.end().append('&nbsp; Archives:')
					.end().find('ul.blog-tag-cloud div.before')
						.find('i').addClass('icon-tags')
						.end().append('&nbsp; Tags:')
					.end().find('div#blog-rss-feeds div.before')
						.find('i').addClass('icon-book')
						.end().append('&nbsp; Feeds:');
			};
		})();
		
		/* Sidebar Functions
		================================================== */
		var sidebar_fn = (function(){
			// look for comments in sidebar
			var div_sidebar_comments = div_sidebar.contents().filter(function(){
				return this.nodeType == 8;
	        });
			// look for whitespace in sidebar
			var div_sidebar_whitespace = div_sidebar.contents().filter(function(){
				return this.nodeType == 3;
	        });
			// when sidebar and sidebar title is empty
			if (!h3_sidebar_title.html().length && !div_sidebar.contents().not(h3_sidebar_title).not(div_sidebar_comments).not(div_sidebar_whitespace).length) div_sidebar.css('display','none');
			else if (!h3_sidebar_title.html().length) h3_sidebar_title.css('display','none');
			
			// when plugin_sidebar is !empty
			group_plugin_sidebar.addClass('radiusAll boxShadowOuter');
			// style toolbar 3
			if (sdNav.tb3.find('ul li').length <= 1) sdNav.tb3.find('a').addClass('radiusAll');
			else sdNav.tb3.find('ul').find('li a').first().addClass('radiusTop')
					.end().end().find('li a').filter(':visible').last().addClass('radiusBottom');
			sdNav.tb3.find('ul ul li > a').prepend('<i class="icon-arrow-right"/> &nbsp;');
			
			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				nav_toolbar3.addClass('radiusAll').css('display','block');
				if (nav_toolbar3.find('ul li').length <= 1) nav_toolbar3.find('a').addClass('radiusAll');
				else nav_toolbar3.find('ul').find('li a').first().removeClass('radiusLeft radiusRight').addClass('radiusTop')
						.end().end().find('li a').filter(':visible').last().removeClass('radiusLeft radiusRight').addClass('radiusBottom');
				// show nested sub pages
				if (nav_toolbar3.find(" > ul li > ul")) {
					nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block")
				}
			}
		})();
		
	})();
});