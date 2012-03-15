// SNo3 (c) 2012 Adam Merrifield http://seydoggy.github.com/libs/themes/rw/SNo3.js

jQuery.noConflict();
jQuery(document).ready(function($){
	
	/* @group SNo3 theme functions */
	var sdSNo3Functions = (function(){
		// VARIABLES
		var jq = $([]),
		wrapper = jq.add('div.wrapper'),
		siteHeader = wrapper.find('header.siteHeader'),
		titleBlock = siteHeader.find('div.titleBlock'),
		logo = titleBlock.find('a.logo'),
		logoImg = logo.find('img'),
		title = titleBlock.find('hgroup.title'),
		siteTitle = title.find('h1.site_title'),
		preContainer = wrapper.find('div.preContainer'),
		mContainer = wrapper.find('div.mainContainer'),
		mPreContent = mContainer.find('div.preContent'),
		cContainer = mContainer.find('div.contentContainer'),
		mContent = cContainer.find('section.mainContent'),
		fsI = jq.add('.filesharing-item'),
		sContent = cContainer.find('aside.sidebarContent'),
		mPostContent = mContainer.find('div.postContent'),
		postContainer = wrapper.find('div.postContainer'),
		fContainer = wrapper.find('div.footerContainer'),
		fPreContent = fContainer.find('div.preContent'),
		copyright = wrapper.find('footer.copyright'),
		footer = copyright.find('section.footer'),
		bContainer = copyright.find('nav.breadcrumbContainer');
		
		// crush % rounding in all browsers with Math.floor()
		var	wrapperWidth = Math.floor(wrapper.width()),
		mContentWidth = Math.floor(mContent.width());
		wrapper.width(wrapperWidth);
		mContent.width(mContentWidth);
		// test user font-size selection and set to %
		var percentfontsize = 100 * parseFloat(jq.add('body').css('font-size')) / parseFloat(jq.add('html').css('font-size'));
		// adjust navigation offset based on font-size selection
		var offset;
		if (percentfontsize >= 60) offset = 21;
		if (percentfontsize >= 70) offset = 25;
		if (percentfontsize >= 85) offset = 29;
		if (percentfontsize >= 100) offset = 33;
		if (percentfontsize >= 115) offset = 39;
		var sidenavWidth = wrapperWidth - mContentWidth - offset;

		// FUNCTIONS
		
		/* @group Title align */
		var sdTitleAlign = (function(){
			// if mobile
			if (jq.add('body').width() <= '600') {
				jq.add('body').css('padding-top','1em');
				logo.css('display','none');
				title.css('font-size','0.75em');
			}
			// kill padding used until js loads
			logoImg.add(title).css('padding-top','0');
			// set top margin for .siteHeader .title
			if (siteTitle.html().length) title.sdVertAlign(siteHeader,'o','m');
			// set top margin for .logo img
			if (logoImg.length) logoImg.sdVertAlign(siteHeader,'o','m');
			// styles for title center
			if (titleBlock.css('float') == 'none') {
				// VARIABLES
				var logoWidth = logo.outerWidth(true),
				titleWidth = title.outerWidth(true),
				titleBlockWidth = logoWidth + titleWidth;
				titleBlock.width(titleBlockWidth);

				if (!logoImg.length) title.css({'margin-left':'0','text-align':'center'});
			}
		})();
		/* @end */
		
		/* @group toolbar split/vertical options */
		var sdNavOptions = (function(){
			// invoke sdSmartNav
			$.sdSmartNav();
			// if mobile
			if (jq.add('body').width() <= '600') {
				// remove additional tiers
				sdNav.tb2.remove();
				sdNav.tb3.remove();
				// add link to navigation
				$('<a href="#toolbar_vertical" title="menu"></a>').prependTo(siteHeader).css({
					"background-image":"url(http://seydoggy.github.com/libs/themes/rw/plus.black.32.png)",
					"background-repeat":"no-repeat",
					"float":"right",
					"height":"32px",
					"margin-top":(siteHeader.height()/2)-16,
					"margin-right":"0.75em",
					"width":"32px"
				});
				// move nav after footer
				sdNav.tb1.insertAfter(wrapper).attr('id','toolbar_vertical');
				// STYLES FOR MOBILE TIER 1
				sdNav.tb1.css({
					'float':'none',
					'margin':'1.5em auto',
					'width':wrapper.width(),
				}).addClass('radiusAll contentShadow');
				// capture first and last items for toolbar_vertical
				if (sdNav.tb1.find('ul li').length <= 1) sdNav.tb1.find('a').addClass('radiusAll');
				else sdNav.tb1.find('ul:first li:first a:first').addClass('radiusTop')
						.end().find('ul:first li:last a:last').addClass('radiusBottom').css('border-style', 'none');
			} else {
				// STYLES FOR NAVIGATION CENTER
				if (sdNav.tb1.css('float') == 'none') {
					sdNav.tb1.width(sdNav.tb1.find('ul:first').outerWidth(true) + 1);
				}

				// STYLES FOR TIER 1
				sdNav.tb1.sdVertAlign('o');

				// STYLES FOR TIER 2
				sdNav.tb2.find('ul').append('<div class="clear">');

				// STYLES FOR TIER 3
				sdNav.tb3.width(sidenavWidth);
				// make sidenav .current state wider to cover border (if !Firefox)
				var cItem = sdNav.tb3.find('.currentListItem'),
				cList = sdNav.tb3.find('.currentListItem').find('.toolbarList');

				if (!$.browser.mozilla) {
					cItem.width(sidenavWidth + 1);
					cList.width(sidenavWidth);
				}
				if (sContent.css('float') == 'left') sdNav.tb3.addClass('innerShadowRight');
				else if (sContent.css('float') == 'right') {
					sdNav.tb3.addClass('innerShadowLeft');
					cItem.css({'position':'relative','left':'-1px'});
					cList.css({'position':'relative','left':'1px'});
				}
			}
		})();
		/* @end */

		/* @group ExtraContent */
		var sdExtracontent = (function(){
			// EC 1 is handled in SS3
			// VARIABLES
			var myEC = '#myExtraContent',
				ec = [
					preContainer,
					mPreContent,
					mPostContent,
					postContainer,
					fPreContent
				],
				ecValue = ec.length,
				thisEC = [];

			/* ExtraContent (jQuery) VERSION: r1.4.2 */
			// change ecValue to suit your theme
			for (i=2;i<=ecValue + 1;i++) {
				thisEC[i] = wrapper.find('div' + myEC + i);
				if (thisEC[i].length) {
					thisEC[i].find('script').remove().end().appendTo('#extraContainer'+i).show();
					// !hide !empty ExtraContent areas
					ec[i-2].show();
				}
			}
			
			// dynamically style depending on EC areas used
			if (!thisEC[2].length && thisEC[3].length) mPreContent.removeClass('innerShadowBottom').addClass('innerShadowTopBottom');
			if (thisEC[5].length && !thisEC[6].length) {
				postContainer.removeClass('innerShadowTop').addClass('innerShadowTopBottom');
				if (!footer.html().length && !bContainer.length) postContainer.removeClass('innerShadowTopBottom').addClass('radiusBottom innerShadowTop');
			}
			if (thisEC[4].length && !thisEC[6].length && !thisEC[5].length) {
				mPostContent.removeClass('innerShadowTop').addClass('innerShadowTopBottom');
				if (!footer.html().length && !bContainer.length) mPostContent.removeClass('innerShadowTopBottom').addClass('radiusBottom innerShadowTop');
			}
			if (!thisEC[2].length && !thisEC[3].length) cContainer.css('border-top-style','none');
			if (!thisEC[4].length && !thisEC[5].length && !thisEC[6].length) {
				cContainer.css('border-bottom-style','none');
				if (!footer.html().length && !bContainer.length) {
					cContainer.addClass('radiusBottom');
					// bottom behavior of main content and sidebar
					// if sidebar left
					if (sContent.css('float') == 'left') sContent.addClass('radiusBottomLeft'), mContent.addClass('radiusBottomRight');
					// if sidebar right
					else if (sContent.css('float') == 'right') sContent.addClass('radiusBottomRight'), mContent.addClass('radiusBottomLeft');
					// if sidebar hide
					else mContent.addClass('radiusBottom');
				}
			}
			if (thisEC[6].length) {
				if (!footer.html().length && !bContainer.length) fContainer.addClass('radiusBottom innerShadowTop').removeClass('innerShadowTopBottom');
			}
		})();
		/* @end */
		
		/* @group copyright/breadcrumb */
		var sdCopyright = (function(){
			// if copyright or breadcrumb is present
			if (footer.html().length || bContainer.length) {
				copyright.show();
				footer.css({'float':'left','text-align':'left'});
				bContainer.css({'float':'right','text-align':'right'});
				// remove leading breadcrumb separator
				bContainer + $('.separator:first').hide();
			}
			// if copyright or breadcrumb is not present
			else copyright.css('border-top-style','none');
		})();
		/* @end */
		
		/* @group various page style */
		var sdPageStyles = (function(){
			// styles for File Sharing page
			// set width/height of File Sharing blocks according to available space
			if (fsI.length) fsI.width(fsI.parent().outerWidth(true) / 3 - 45).addClass('radiusAll contentShadow').sdSetHeight(fsI,0);
		})();
		/* @end */
		
		/* @group Album */
		var sdAlbums = (function(){
			// invoke sdLightboxAlbums
			$.sdLightboxAlbums({
				css_file	:	'http://seydoggy.github.com/libs/prettyPhoto/jquery.prettyPhoto.css',
				js_file		:	'http://seydoggy.github.com/libs/prettyPhoto/jquery.prettyPhoto.js',
				animation_speed	:	'fast',
				show_title		:	false,
				theme			:	'light_square'
			});

			$.sdAlbumStyle({
				plusClass : 'radiusAll contentShadow'
			});
		})();
		/* @end */
		
		/* @group general styles */
		// invoke SeydoggySlideshow
		$.SeydoggySlideshow();

		// styles for left sidebar
		if (sContent.css('float') == 'left') mContent.css('min-height',sContent.outerHeight(true)).addClass('outerShadowLeft');
		// styles for right sidebar
		else if (sContent.css('float') == 'right') mContent.css('min-height',sContent.outerHeight(true)).addClass('outerShadowRight');

		/* @end */

	})();
	/* @end */
});