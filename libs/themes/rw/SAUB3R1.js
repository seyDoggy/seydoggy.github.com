/*
	SAUB3R1
	(c) 2012, DEVI8.design
	http://devi8design.com/SAUB3R1
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/* Frehmwerk
	================================================== */
	$.frehmwerk();
	
	var SAUB3R1_default_Functions = (function(){
		/* Variables
		================================================== */
		var jq = $([]),
		div_top = jq.add('div.top'),
		div_middle = jq.add('div.middle'),
		div_wide = jq.add('div.wide'),
		div_narrow = jq.add('div.narrow'),
		div_sidebar = jq.add('div#sidebar'),
		h3_sidebar_title = jq.add('h3#sidebar_title'),
		div_blog_entry = jq.add('div.blog-entry'),
		div_plugin_sidebar = jq.add('div#plugin_sidebar'),
		group_plugin_sidebar = div_plugin_sidebar.find('div#blog-categories, div#blog-archives, ul.blog-tag-cloud, div#blog-rss-feeds'),
		div_filesharing_item = jq.add('div.filesharing-item'),
		div_bottom = jq.add('div.bottom').find('div#footer').parents('.outer'),
		nav_breadcrumb = div_bottom.find('nav#breadcrumb');
		
		/* FUNCTIONS
		================================================== */
		
		/* SS3
		================================================== */
		$.SeydoggySlideshow({
			wrapper : '.header',
			bgPosition : 'center center',
			plusClass : ''
		});

		
		/* Navigation Functions
		================================================== */
		var nav_fn = (function () {
			// style toolbar 1 & 2 drop menu
			sdNav.tb1.add(sdNav.tb2)
				.find('ul ul').addClass('radiusBottom')
				.addClass('boxShadowDropDown')
				.find('ul').removeClass('radiusBottom').addClass('radiusAll')
				.find('li:first-child, li:first-child > a').addClass('radiusTop')
				.end().end().find('li:last-child, li:last-child > a').addClass('radiusBottom')
				.end().find('li:last-child, li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');
			// set min-width of drop down to width of parent
			sdNav.tb1.find(' ul ul').add(sdNav.tb2.find(' ul ul')).each(function(){
				$(this).css('min-width',$(this).parent().outerWidth(true) - 1);
			});
			// add last list item
			sdNav.tb2.find('> ul > li:last-child').after('<li class="last"/>');
			// style toolbar 3
			sdNav.tb3.find('ul li a')
				.addClass('radiusAll boxShadowOuter')
				.prepend('<i class="icon-play-circle"/> &nbsp;');
			
			if (sdNav.tb3.find(' > ul li > ul')) {
				//Add 'hasChildren' class to tb3 ul li's
				sdNav.tb3.find(' > ul li > ul').parent().addClass('hasChildren');
				//Add fontawesome icons
				sdNav.tb3.find('li.hasChildren > a').append(' &nbsp; <i class="icon-caret-down"/>');
			}
			
			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				// style toolbar 3
				nav_toolbar3
					.addClass('radiusAll')
					.find('ul li, ul ul, a:first-child, a:last-child').removeClass('radiusAll radiusTop radiusBottom boxShadowDropDown')
					.end().find('ul li a')
						.addClass('radiusAll boxShadowOuter')
						.prepend('<i class="icon-play-circle"/> &nbsp;');
				
				if (nav_toolbar3.find(' > ul li > ul')) {
					//Add 'hasChildren' class to tb3 ul li's
					nav_toolbar3.find(' > ul li > ul').parent().addClass('hasChildren');
					//Add fontawesome icons
					nav_toolbar3.find('li.hasChildren > a').append(' &nbsp; <i class="icon-caret-down"/>');
					// show nested sub pages
					if (nav_toolbar3.find(" > ul li > ul")) {
						nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block");
					}
				}
			}

			//style breadcrumb
			nav_breadcrumb.find('> ul > li:first-child').prepend('<i class="icon-list-alt"></i> | ');
		})();

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

		/* Sidebar Functions
		================================================== */
		var sidebar_fn = (function(){
			// when sidebar and sidebar title is empty
			if (!div_sidebar.html().length && !h3_sidebar_title.html().length) div_sidebar.add(h3_sidebar_title).css('display','none');
			
			// when plugin_sidebar is !empty
			group_plugin_sidebar.addClass('radiusAll');
		})();
	})();
});