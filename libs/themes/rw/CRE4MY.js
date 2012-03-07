/* sdCRE4MYFunctions */
jQuery.noConflict();
jQuery(document).ready(function($){
	var sdCRE4MYFunctions = (function(){
		// VARIABLES
		var jq = $([]),
		wHeader = jq.add('div.wrapperHeader'),
		hContainer = wHeader.find('div.headerContainer'),
	    sdSlideshow = hContainer.find('div.seydoggySlideshow'),
		slideHeader = sdSlideshow.add(sdSlideshow.find('div.pageHeader')),
		siteHeader = wHeader.find('header.siteHeader'),
		logoImg = siteHeader.find('a.logo img'),
		title = siteHeader.find('hgroup.title'),
		siteTitle = title.find('h1.site_title'),
		siteSlogan = title.find('h2.site_slogan'),
		hPreContent = hContainer.find('div.preContent'),
		preContainer = jq.add('div.preContainer'),
		mContainer = jq.add('div.mainContainer'),
		mPreContent = mContainer.find('div.preContent'),
		cContainer = mContainer.find('div.contentContainer'),
		mContent = cContainer.find('section.mainContent'),
		fsI = jq.add('div.filesharing-item'),
		sContent = cContainer.find('aside.sidebarContent'),
		mPostContent = mContainer.find('div.postContent'),
		postContainer = jq.add('div.postContainer'),
		wFooter = jq.add('div.wrapperFooter'),
		fContainer = wFooter.find('div.footerContainer'),
		copyright = wFooter.find('footer.copyright'),
		footer = copyright.find('section.footer'),
		bContainer = copyright.find('nav.breadcrumbContainer'),
		isNoHeader = false,
		emptyBar = false,
		emptySub = false,
		radiusClass = "radiusTop";
		
		if (hContainer.css('display') == 'none') isNoHeader = true;
		if (sdNav.position == 1) radiusClass = "radiusBottom";
		else if (emptyBar == true) radiusClass = "radiusAll";
		
		// FUNCTIONS
		
		/* @group general styles */
		$.SeydoggySlideshow({
			bgPosition : 'center center',
			plusClass : radiusClass
		});
		// set height .mainContent to that of .sidebarContent if shorter
		if (sContent.css('display') != 'none') mContent.css('min-height',sContent.height());
		/* @end */

		/* @group toolbar split/vertical options */
		var sdNavOptions = (function(){
			// invoke sdSmartNav
			$.sdSmartNav();

			if ((sdNav.type == 1 || sdNav.type == 3 || sdNav.type == 4) || (sdNav.tbsP == undefined)) emptySub = true;
			if (!(logoImg.length) && !(siteTitle.html().length) && !(siteSlogan.html().length) && sdNav.type >= 2) emptyBar = true;

			// capture first and last items for toolbar_vertical
			if (sdNav.tb3.find('ul li').length <= 1) sdNav.tb3.find('a').addClass('radiusAll');
			else sdNav.tb3.find('ul:first li:first a:first').addClass('radiusTop')
					.end().find('ul:first li:last a:last').addClass('radiusBottom').css('border-style', 'none');

			// STYLES FOR TIER 2
			sdNav.tb2.find('ul').append('<div class="clear">');
			// round first list item
			if (sdNav.tbsP != undefined) sdNav.tb2.find('> ul:first > li:first >  a:first').addClass('radiusTopLeft');
			// round mPreContent
			else mPreContent.addClass('radiusTop');
		})();
		/* @end */

		/* @group title vertical alignment */
		var sdTitleValign = (function(){
			if (!(siteTitle.html().length && siteSlogan.html().length)) {
				// vertical center just title
				if (siteTitle.html().length && !siteSlogan.html().length) siteTitle.sdVertAlign(title);
				// vertical center just slogan
				else siteSlogan.sdVertAlign(title);
			}
			// vertical center logo
			if (logoImg.length) logoImg.sdVertAlign(siteHeader);
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
				fContainer
			],
			ecValue = ec.length,
			thisEC = [];
			
			/* ExtraContent (jQuery) VERSION: r1.4.2 */
			for (i=2;i<=ecValue + 1;i++) {
				thisEC[i] = jq.add('div' + myEC + i);
				if ($(myEC + i).length) {
					$(myEC + i + ' script').remove();
					$(myEC + i).appendTo('#extraContainer'+i).show();
					// !hide !empty ExtraContent areas
					ec[i-2].show();
				}
			}

			// dynamically style depending on EC areas used
			if ((thisEC[3].length && thisEC[4].length) || (emptySub == false && thisEC[4].length)) cContainer.removeClass('radiusAll').css({'border-top-style':'none','border-bottom-style':'none'});
			else if (thisEC[3].length || emptySub == false) cContainer.removeClass('radiusAll').addClass('radiusBottom').css({'border-top-style':'none'});
			else if (thisEC[4].length) cContainer.removeClass('radiusAll').addClass('radiusTop').css({'border-bottom-style':'none'});
		    if (thisEC[6].length) copyright.removeClass('radiusAll').addClass('radiusBottom'), bContainer.find('> ul > li:last >  a').addClass('radiusBottomRight');
		    else bContainer.find('> ul > li:last >  a').addClass('radiusRight');
		})();
		/* @end */
		
		/* @group rounding */
		var sdRounding = (function(){
			// header/toolbar rounding
			// !round top of #toolbar_horizontal if header is used
			if (isNoHeader == false) {
				// handle the title bar when all elements are empty
				if (emptyBar == false) {
					if (sdNav.position == 0) {
						// remove rads from title bar
						siteHeader.removeClass('radiusAll').addClass('radiusBottom');
						// round lower right corner of last link
						if (sdNav.type <= 1) sdNav.tb1.find('> ul:first > li:last >  a:last').addClass('radiusBottomRight');
						// remove bottom border from .seydoggySlideshow
						sdSlideshow.css('border-bottom-style','none');
					} else {
						// move siteHeader above header
						hContainer.parent().prepend(siteHeader.removeClass('radiusAll').addClass('radiusTop'));
						slideHeader.removeClass('radiusTop').addClass('radiusBottom');
						// round lower right corner of last link
						if (sdNav.type <= 1) sdNav.tb1.find('> ul:first > li:last >  a:last').addClass('radiusTopRight');
						// remove top border from .seydoggySlideshow
						sdSlideshow.css('border-top-style','none');
					}
				} else {
					slideHeader.removeClass('radiusTop').addClass('radiusAll');
					siteHeader.hide();
				}
			} else {
				if (emptyBar == false) {
					// round both right corners of last link
					if (sdNav.type <= 1) sdNav.tb1.find('> ul:first > li:last >  a:last').addClass('radiusRight');
				} else siteHeader.hide();// handle the title bar when all elements are empty
			}
			// content round
			if (emptySub == false) mPreContent.css('border-top-style','none');
		    // styles for copyright/breadcrumb
		    // show copyright area if footer or breadcrumb is present
		    if (footer.html().length || bContainer.length) {
				copyright.css('display','block'), fContainer.css('border-bottom-style','none');
				// if both occur then position footer
			    if (footer.html().length && bContainer.length) footer.css({'float': 'left','text-align': 'left'});
			}
		    // hide empty copyright area and round footer
		    else fContainer.removeClass('radiusTop').addClass('radiusAll');
		})();
		/* @end */

		/* @group various page style */
		// set width/height of File Sharing blocks according to available space
		if (fsI.length) fsI.width(fsI.parent().outerWidth(true) / 3 - 45).addClass('radiusAll contentShadow').sdSetHeight(fsI,0);
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
				plusClass : 'radiusAll'
			});
		})();
		/* @end */
	})();
});