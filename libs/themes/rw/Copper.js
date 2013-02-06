/*
	Copper
	(c) 2012, Adam Merrifield
	http://seydesign.com/Copper
*/

/* Theme JavaScript
	Table of Contents
==================================================
	Variables
	FUNCTIONS
		SS3
		Top Functions
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
		div_top = jq.add('div.top'),
		div_header = jq.add('div.header'),
		div_ec2 = jq.add('div#extraContainer2'),
		div_ec3 = jq.add('div#extraContainer3'),
		div_middle = jq.add('div.middle'),
		div_wide = div_middle.find('div.wide'),
		div_narrow = div_middle.find('div.narrow'),
		div_blog_entry = jq.add('div.blog-entry'),
		div_plugin_sidebar = jq.add('div#plugin_sidebar'),
		group_plugin_sidebar = div_plugin_sidebar.find('div#blog-categories, div#blog-archives, ul.blog-tag-cloud, div#blog-rss-feeds'),
		div_filesharing_item = jq.add('div.filesharing-item'),
		radiusClass = '';
		
		/* FUNCTIONS
		================================================== */
		
		/* SS3
		================================================== */
		$.SeydoggySlideshow({
			wrapper : '.header',
			bgPosition : 'center center',
			plusClass : radiusClass
		});

		/* Navigation Functions
		================================================== */
		var nav_fn = (function(){
			
			// add upper shadow
			sdNav.tb1.addClass('boxShadowOuterUpper');
			
			// add radius
			sdNav.tb1
				.find('> ul > li:first-child, > ul > li:first-child > a:first-child')
					.addClass('radiusTopLeft');

			sdNav.tb2
				.find('> ul > li > a')
					.addClass('radiusTop');
			
			// drop navigation styles
			sdNav.tb1.add(sdNav.tb2)
				.find('> ul > li > a')
					.hover(function(){
						$(this).parent().find('> ul')
							.css('min-width',$(this).outerWidth(true));
					})
				.end().find('ul ul')
					.addClass('boxShadowOuterDrop radiusAll')
					.find('ul > li:first-child > a')
						.addClass('radiusTop')
					.end().find('li:last-child > a')
						.addClass('radiusBottom')
					.end().find('ul > li:only-child > a')
						.removeClass('radiusTop radiusBottom')
						.addClass('radiusAll');

			// toolbar3 styles function
			var fn_style_tb3 = function(elem){
				elem
					.find('> ul > li > a')
						.removeClass('radiusTopLeft')
						.addClass('radiusAll');
				if (elem.find('> ul > li > ul > li').filter(':visible').length <= 1 && elem.find('> ul > li > ul > li > ul').filter(':visible').length <= 0) {
					elem
						.find('> ul > li > ul > li > a')
							.addClass('radiusAll');
				} else {
					elem
						.find('> ul > li > ul > li:first-child > a')
							.addClass('radiusTop')
						.end().find('ul ul li a').filter(':visible').last()
							.addClass('radiusBottom');
				}
				// Add 'hasChildren' class and sub nav indicators
				elem
					.find('ul > li > ul')
						.parent()
							.addClass('hasChildren')
							.find('> a.normal')
								.prepend('<i class="icon-caret-right"/> &nbsp; ')
							.end().find('> a.current, > a.currentAncestor')
								.prepend('<i class="icon-caret-down"/> &nbsp; ');

			};
			
			// toolbar3 styles
			fn_style_tb3(sdNav.tb3);
			
			// toolbar3 styles (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				
				fn_style_tb3(nav_toolbar3);
					
				// show nested sub pages
				if (nav_toolbar3.find(" > ul li > ul")) {
					nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block");
				}
			}
		})();

		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// vertically align
			div_top
				.find('div#extraContainer12')
					.sdVertAlign(jq.add('hgroup.titles'))
				.end().find('a#logo')
					.sdVertAlign(jq.add('hgroup.titles'));

			// if responsive
			if ($('nav#toolbar3').length) {
				div_top
					.find('hgroup.titles, div#extraContainer12')
						.css('float','none')
					.end().find('a#logo')
						.css('display','none');
			}
		})();
		
		/* Middle Functions
		================================================== */
		var middle_fn = (function(){
			// make shadows
			var elements = [
				div_header,
				div_ec2,
				div_middle,
				div_ec3
			];
			for (var i = elements.length - 1; i >= 0; i--) {
				if (elements[i].css('display') == 'block') {
					jq.add(elements[i]).after('<div class="contentShadow radiusTop"/>');
				}
			}
			

			// if sidebar is not hidden
			if (div_narrow.css('display') !== 'none') {
			
				// when wide is left or right
				if (div_wide.hasClass('left')) {
					// if sidebar right
					// increase radius to prevent bleed-through
					div_middle.css({
						'border-top-left-radius':'+=2px',
						'border-bottom-left-radius':'+=2px'
					});
					div_wide.removeClass('radiusAll').addClass('radiusLeft boxShadowOuterSidebarRight');
					div_narrow.addClass('radiusRight');
				} else if (div_wide.hasClass('right')) {
					// sidebar left
					// increase radius to prevent bleed-through
					div_middle.css({
						'border-top-right-radius':'+=2px',
						'border-bottom-right-radius':'+=2px'
					});
					div_wide.removeClass('radiusAll').addClass('radiusRight boxShadowOuterSidebarLeft');
					div_narrow.addClass('radiusLeft');
				} else if ($('nav#toolbar3').length) {
					// if responsive
					// increase radius to prevent bleed-through
					div_middle.css({
						'border-top-right-radius':'+=2px',
						'border-top-left-radius':'+=2px'
					});
					div_wide.removeClass('radiusAll').addClass('radiusTop');
					div_narrow.addClass('radiusBottom boxShadowInnerSidebarTop');
					div_plugin_sidebar.css({
						'border-top':'none',
						'padding-top':'0'
					});
				}

				// hide sidebar title if empty
				if (!div_narrow.find('h3#sidebar_title').html()) div_narrow.find('h3#sidebar_title').css('display','none');
				// hide plugin sidebar if empty
				if (!div_plugin_sidebar.html()) div_plugin_sidebar.css('display','none');

				// hide sidebar title styles if tb2 and plugin sidebar or empty
				if (div_narrow.find('h3#sidebar_title').html() && !div_plugin_sidebar.html() && sdNav.tb3.find('ul').length === 0) {
					div_narrow.find('h3#sidebar_title').css({
						'border-top':'none',
						'padding-top':'0'
					});
				}

				// hide plugin sidebar styles if tb2 is empty
				if (div_plugin_sidebar.html() && sdNav.tb3.find('ul').length === 0) {
					div_plugin_sidebar.css({
						'border-top':'none',
						'padding-top':'0'
					});
				}
			} else {
				// increase radius to prevent bleed-through
				div_middle.css('border-radius','+=2px');
			}
		})();

		/* Pages Functions
		================================================== */

		var pages_fn = (function () {
			// when blog page (main content)
			if (div_blog_entry.length) {
				// add entry icons with font-awesome
				div_blog_entry
					.find('h1.blog-entry-title a').prepend('<i class="icon-pencil"/> &nbsp;')
					.end().find('div.blog-entry-date').prepend('<i class="icon-calendar"/> &nbsp;');
				// add blog sidebar icons with font-awesome
				group_plugin_sidebar
					.addClass('radiusAll')
					.prepend('<div class="before"><i/></div>');
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
						.find('i').addClass('icon-rss')
						.end().append('&nbsp; Feeds:');
			}
			// when file sharing page
			if (div_filesharing_item.length) {
				// add file sharing icons with font-awesome
				div_filesharing_item.find('div.filesharing-item-title a').prepend('<i class="icon-download-alt"/> &nbsp;');
			}
		})();
	})();
});
