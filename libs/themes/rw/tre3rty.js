/*
	tre3rty
	(c) 2012, DEVI8.design
	http://devi8design.com/tre3rty
*/

/* Theme JavaScript
	Table of Contents
==================================================
	Variables
	FUNCTIONS
		SS3
		Navigation Function
		Top Function
		Middle Function
		Responsive Function
*/

jQuery.noConflict();
jQuery(document).ready(function($){

	/* tre3rty
	================================================== */
	$.frehmwerk();

	var tre3rty_default_Functions = (function(){
		/* Variables
		================================================== */
		var jq = $([]),
		div_titleBlock = jq.add('div.titleBlock'),
		div_top = jq.add('div.outer.top'),
		div_header = jq.add('div.header'),
		div_lower_top = jq.add('div.outer.top div.inner.top div.lower.top'),
		div_middle = jq.add('div.middle').not('div.upper,div.lower,div.inner,div.outer'),
		div_wide = jq.add('div.wide'),
		div_narrow = jq.add('div.narrow'),
		div_blog_entry = jq.add('div.blog-entry'),
		div_plugin_sidebar = jq.add('div#plugin_sidebar'),
		group_plugin_sidebar = div_plugin_sidebar.find('div#blog-categories, div#blog-archives, ul.blog-tag-cloud, div#blog-rss-feeds'),
		div_filesharing_item = jq.add('div.filesharing-item'),
		radiusClass = 'radiusAll';

		if (jq.add('div#myExtraContent2').length) radiusClass = 'radiusTop';

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
		navigation_fn = (function(){
			// vertical align toolbar1
			sdNav.tb1.sdVertAlign(sdNav.tb1.parent());
			// add classes to toolbar 1 & 2 and set min-width of drop down to width of parent
			sdNav.tb1.add(sdNav.tb2)
				.find('> ul > li > ul').addClass('radiusBottom')
				.end().find('ul').not('.radiusBottom').addClass('radiusAll')
				.find('ul').each(function(){
					$(this).css('min-width',$(this).parent().outerWidth(true));
				});

			// add left and right margin to toolbar 1
			if (sdNav.tb1.find('> ul li').length > 1) {
				sdNav.tb1.not('#toolbar3')
					.find('> ul > li:first').css('margin-left','0.75em')
					.end().find('> ul > li:last').css('margin-right','0.75em');
			} else sdNav.tb1.find('> ul > li:first').css({'margin-left':'0.75em','margin-right':'0.75em'});

			// when toolbar 2 is hidden
			if (sdNav.tb2.css('display') == 'none') div_header.css('margin-top','0');

			// style toolbar 3
			if (sdNav.tb3.find('ul li a').hasClass('current, currentAncestor')) sdNav.tb3.find('ul li a').addClass('radiusAll boxShadowInner3');
			else sdNav.tb3.find('ul li a').addClass('radiusAll boxShadowOuter3');
		})();

		/* Top Functions
		================================================== */
		var top_fn = (function(){
			// show top on DOM ready
			div_top.css('display','block');

			// when slogan is NOT shown
			if (!div_titleBlock.find('h2#site_slogan').html()) {
				div_titleBlock.find('h2#site_slogan').css('display','none');
			}
			// when header is shown
			if (div_header.css('display') != 'none') {
				div_lower_top.css('margin-top','0')
					.removeClass('radiusAll').addClass('radiusBottom');
			}
			// when EC2 is shown
			if (jq.add('div#myExtraContent2').length) {
				div_header.add(div_header.find('div.seydoggySlideshow, div.pageHeader'))
					.css('border-bottom-style','none')
					.removeClass('radiusAll').addClass('radiusTop');
			}
			// when header area is empty
			if (!jq.add('div#myExtraContent2').length && !sdNav.tb2.html().length && div_header.css('display') == 'none') div_top.css('display','none');
		})();

		/* Middle Functions
		================================================== */
		var middle_fn = (function(){
			// FUNCTIONS
			// define wideSetRad
			var wideSetRad = function(left,right,middle){
				// when wide is left or right
				if (div_wide.hasClass('left')) div_wide.addClass(left);
				else if (div_wide.hasClass('right')) div_wide.addClass(right);
				else div_wide.addClass(middle);
			};
			// define hideEmptyContent
			var hideEmptyContent = function (content,sidebar,sidebartitle,isEC) {
				// when content and sidebar are empty
				if (!content.html() && !sidebar.html() && !sidebartitle.html()) {
					div_wide.add(div_narrow).css('display','none');
					// when EC 4 && 5 is false
					if (isEC === false) div_middle.css('display','none');
				}
			};

			// VARIABLES
			var isEC45 = false;

			// ACTION
			// when EC4 or 5 are present
			if (jq.add('div#myExtraContent4').length || jq.add('div#myExtraContent5').length) {
				isEC45 = true;
				if (jq.add('div#myExtraContent4').length && !jq.add('div#myExtraContent5').length) {
					// run wideSetRad
					wideSetRad('radiusBottomLeft','radiusBottomRight','radiusBottom');
					div_middle.addClass('radiusBottom').css('margin-top','0');
				} else if (!jq.add('div#myExtraContent4').length && jq.add('div#myExtraContent5').length) {
					// run wideSetRad
					wideSetRad('radiusTopLeft','radiusTopRight','radiusTop');
					div_middle.addClass('radiusTop').css('margin-bottom','0');
				} else {
					div_middle.css('margin','0');
				}
			} else {
				// run wideSetRad
				wideSetRad('radiusLeft','radiusRight','radiusAll');
				div_middle.addClass('radiusAll');
			}

			// when content and sidebar are empty
			hideEmptyContent(div_wide.find('div#content'),div_narrow.find('div#sidebar'),div_narrow.find('h3#sidebar_title'),isEC45);
			
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
						.find('i').addClass('icon-book')
						.end().append('&nbsp; Feeds:');
			}

			// when file sharing page
			if (div_filesharing_item.length) {
				// add file sharing icons with font-awesome
				div_filesharing_item.find('div.filesharing-item-title a').prepend('<i class="icon-download-alt"/> &nbsp;');
			}
		})();

		/* Responsive Functions
		================================================== */
		responsive_fn = (function(){
			// title/slogan styles if less then 1024 and @media query is used
			if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length) {
				jq.add('div.titleBlock')
					.css('line-height','1.5em')
					.find('a#logo').css('display','none')
					.end().find('hgroup.titles').sdVertAlign('m')
					.find('h1#site_title').css('display','block')
					.end().find('h2#site_slogan').css({
						'border-left-style':'none',
						'font-size':'0.9em',
						'padding-left':'0'
					});
			}

			// style toolbar 3 (responsive)
			if ($('nav#toolbar3').length) {
				var nav_toolbar3 = jq.add('nav#toolbar3');
				// style
				if (nav_toolbar3.find('ul li a').hasClass('current, currentAncestor')) nav_toolbar3.find('ul li a').addClass('radiusAll boxShadowInner3');
				else nav_toolbar3.find('ul li a').addClass('radiusAll boxShadowOuter3');
				// show nested sub pages
				if (nav_toolbar3.find(" > ul li > ul")) {
					nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block");
				}
			}
		})();
	})();
});