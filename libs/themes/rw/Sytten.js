/*
	Sytten
	(c) 2012, Adam Merrifield
	http://seydesign.com/Sytten
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/* Frehmwerk
	================================================== */
	$.frehmwerk();
	
	var Sytten_default_Functions = (function(){
		
		/* Variables
		================================================== */
		var jq = $([]),
		div_top = jq.add('div.outer.top'),
		div_banner = jq.add('div.outer.banner'),
		div_extracontent2 = jq.add('div.outer.extracontent2'),
		div_extracontent3 = jq.add('div.outer.extracontent3'),
		div_middle = jq.add('div.outer.middle'),
		div_wide = jq.add('div.wide'),
		div_narrow = jq.add('div.narrow'),
		div_sidebar = jq.add('div#sidebar'),
		h3_sidebar_title = jq.add('h3#sidebar_title'),
		div_blog_entry = jq.add('div.blog-entry'),
		div_plugin_sidebar = jq.add('div#plugin_sidebar'),
		group_plugin_sidebar = div_plugin_sidebar.find('div#blog-categories, div#blog-archives, ul.blog-tag-cloud, div#blog-rss-feeds'),
		div_filesharing_item = jq.add('div.filesharing-item'),
		div_bottom = jq.add('div.bottom').find('div#footer').parents('.outer'),
		radiusClass = 'radiusAll';
		
		/* FUNCTIONS
		================================================== */
		
		/* SS3
		================================================== */
		$.SeydoggySlideshow({
			wrapper : '.header',
			bgPosition : 'center center',
			plusClass : radiusClass
		});

		
		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// style logo when title and slogan are missing
			if (!div_top.find('h1#site_title').html().length && !div_top.find('h2#site_slogan').html().length) div_top.find('a#logo').css('padding-right','0'), div_top.find('hgroup.titles').remove();
		})();

		/* Navigation Functions
		================================================== */
		var nav_fn = (function(){

			// add animation when toolbar1 > ul > li is hovered over
			var nav_animate = function(elem,plusClass,effect,value){
				if (effect === 0) {
					elem
						.find('> ul > li').hover(
							function () {
								// add class
								$(this).find('>a').addClass(plusClass)
									// animate
									.end().animate({top:value}, 'fast')
									// set min-width of first drop-down to that of parent
									.find('> ul')
										.css('min-width',$(this).find('>a').outerWidth(true));
							},
							function () {
								// restore
								$(this).find('>a').removeClass(plusClass)
									.end().animate({top:'0'}, 'fast');
							}
						);
				} else if (effect === 1) {
					var fs;
					elem
						.find('> ul > li').hover(
							function () {
								fs = $(this).css('font-size');
								// add class
								$(this).addClass(plusClass)
									// animate
									.animate({fontSize:value}, 'fast');
								return fs;
							},
							function () {
								// restore
								$(this).removeClass(plusClass)
									.animate({fontSize:fs}, 'fast');
							}
						);
				} else {
					elem
						.find('> ul > li').hover(
							function () {
								// add class
								$(this).find('>a').addClass(plusClass)
									// set min-width of first drop-down to that of parent
									.end().find('> ul')
										.css('min-width',$(this).find('>a').outerWidth(true));
							},
							function () {
								// restore
								$(this).find('>a').removeClass(plusClass);
							}
						);
				}
			};
			
			nav_animate(sdNav.tb1.find("div#myExtraContent12"), 'hover', 1, '1.6em');
			nav_animate(sdNav.tb1,'hover boxShadowDropDown', 0, '5px');
			nav_animate(sdNav.tb2, 'hover boxShadowDropDownInner');

			// style toolbar 1 & 2 drop menu
			sdNav.tb1.add(sdNav.tb2)
				.find('ul ul').addClass('radiusBottom boxShadowDropDown')
				.find('ul').removeClass('radiusBottom').addClass('radiusAll')
				.find('li:first-child, li:first-child > a').addClass('radiusTop')
				.end().end().find('li:last-child, li:last-child > a').addClass('radiusBottom')
				.end().find('li:last-child, li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');
			
			// style toolbar 3
			// if not IE9
			if (sdNav.IE9 !== true) {
				// add classes to menu pills
				sdNav.tb3.find('ul li a').addClass('radiusAll boxShadowOuter');
				// add end cap to menu pills
				jq.add('<i class="endCap icon-play radiusLeft"/>').prependTo(sdNav.tb3.find('ul li a'));
			} else {
				// add classes to menu pills
				sdNav.tb3.find('ul li a').addClass('boxShadowOuter');
				// add end cap to menu pills
				jq.add('<i class="endCap icon-play"/>').prependTo(sdNav.tb3.find('ul li a'));
			}
			//Add 'hasChildren' class to menu pills
			sdNav.tb3.find(' ul > li > ul').parent().addClass('hasChildren')
				.find('> a').append(' &nbsp; <i class="icon-caret-down"/>');

			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				// add classes to menu pills
				nav_toolbar3.find('ul li a').addClass('radiusAll boxShadowOuter');
				// add end cap to menu pills
				jq.add('<i class="endCap icon-play radiusLeft"/>').prependTo(nav_toolbar3.find('ul li a'));
				//Add 'hasChildren' class to menu pills
				nav_toolbar3.find('ul > li > ul').parent().addClass('hasChildren')
					.find('> a').append(' &nbsp; <i class="icon-caret-down"/>');
			}
		})();
		
		/* Content Functions
		================================================== */
		var content_spaces_fn = (function(){
			var if_banner = false, if_ec2 = false, if_nav2 = false, if_ec3 = false;
			if (jq.add(div_banner).find('div.header').css('display') === 'block') if_banner = true;
			if (jq.add(div_extracontent2).css('display') == 'block') if_ec2 = true;
			if (sdNav.tb2.find("ul").length) if_nav2 = true;
			if (jq.add(div_extracontent3).css('display') == 'block') if_ec3 = true;

			if (if_banner === true || sdSS.headerHeightVariable === true) {
				jq.add(div_banner).addClass('contentShadow')
					.find('div.header').css('display','block');
			} else jq.add(div_banner).css('display','none');
			
			if (if_banner === false	&& if_ec2) jq.add(div_extracontent2).addClass('contentShadow');
			
			if (if_nav2 && if_ec3) jq.add(div_extracontent3).addClass('contentShadow');
		})();

		/* Sidebar Functions
		================================================== */
		var sidebar_fn = (function(){
			// when sidebar and sidebar title is empty
			if (!div_sidebar.html().length && !h3_sidebar_title.html().length) div_sidebar.add(h3_sidebar_title).css('display','none');
			
			// when plugin_sidebar is !empty
			group_plugin_sidebar.addClass('radiusAll boxShadowOuter');
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