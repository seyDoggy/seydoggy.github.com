// CRE4MY (c) 2012 Adam Merrifield http://seydoggy.github.com/libs/themes/rw/CRE4MY.js

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
		radiusClass = "radiusTop",
		dropVal = true;
		
		if (hContainer.css('display') == 'none') isNoHeader = true;
		if (sdNav.position === 1) radiusClass = "radiusBottom";
		else if (emptyBar === true) radiusClass = "radiusAll";
		
		if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length) dropVal = false;
		
		// FUNCTIONS
		
		/* @group general styles */
		$.SeydoggySlideshow({
			bgPosition : 'center center',
			plusClass : radiusClass
		});
		// set height .mainContent to that of .sidebarContent if shorter
		if (sContent.css('display') != 'none') mContent.css('min-height',sContent.height());
		

		/* @group toolbar split/vertical options */
		var sdNavOptions = (function(){
			// test for legacy CRE4MY v4.7.0 (r7)
			if (!$('div#extraContainer12').length || sdNav.drop === false) {
				dropVal = false;
			}
			// invoke sdSmartNav
			$.sdSmartNav({
				drop:dropVal
			});
			
			// $.sdSmartNav();
			// if mobile
			if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length) {
				// add link to navigation
				$('<a href="#toolbar_vertical" title="menu" class="responsiveMenu"></a>').prependTo(siteHeader).css({
					"background-image":"url(http://seydoggy.github.com/libs/themes/rw/plus.black.32.png)",
					"background-repeat":"no-repeat",
					"float":"right",
					"height":"32px",
					"margin-top":(siteHeader.height()/2)-16,
					"margin-right":"0.75em",
					"width":"32px"
				});
				// move nav after footer
				sdNav.tb1.insertAfter(wFooter).attr('id','toolbar_vertical').css({
					'margin-top':'1.5em',
					'display':'block'
				}).addClass('radiusAll');
				// capture first and last items for toolbar_vertical
				if (sdNav.tb1.find('ul li').length <= 1) sdNav.tb1.find('a').addClass('radiusAll');
				else sdNav.tb1.find('ul:first li:first a:first').addClass('radiusTop')
						.end().find('ul:first li:last a:last').addClass('radiusBottom').css('border-style', 'none');
					// show nested sub pages
				if ($('nav#toolbar_vertical').length) {
					var nav_toolbar3 = jq.add('nav#toolbar_vertical');
					if (nav_toolbar3.find(" > ul li > ul")) {
						nav_toolbar3.find("a.current").siblings("ul").css("display", "block").end().parents("ul").css("display", "block");
					}
				}
				// round mPreContent
				mPreContent.addClass('radiusTop');
				// set sub nav as empty
				emptySub = true;
				// remove additional tiers
				sdNav.tb2.remove();
				sdNav.tb3.remove();
			} else {
				if ((sdNav.type === 1 || sdNav.type === 3 || sdNav.type === 4) || (sdNav.tbsP === undefined)) emptySub = true;
				if (!(logoImg.length) && !(siteTitle.html().length) && !(siteSlogan.html().length) && sdNav.type >= 2) emptyBar = true;

				// capture first and last items for toolbar_vertical
				if (sdNav.tb3.find('ul li').length <= 1) sdNav.tb3.find('a').addClass('radiusAll');
				else sdNav.tb3.find('ul:first li:first a:first').addClass('radiusTop')
						.end().find('ul:first li:last a:last').addClass('radiusBottom').css('border-style', 'none');

				// STYLES FOR TIER 2
				// round first list item
				if (sdNav.tbsP !== undefined) sdNav.tb2.find('> ul:first > li:first >  a:first').addClass('radiusTopLeft');
				// round mPreContent
				else mPreContent.addClass('radiusTop');
				// style toolbar 1 & 2 drop menu
				sdNav.tb1.add(sdNav.tb2)
					.find('ul ul').addClass('radiusBottom boxShadowDropDown')
					.find('ul').removeClass('radiusBottom').addClass('radiusAll')
					.end().find('ul li:first-child > a').addClass('radiusTop')
					.end().find('li:last-child > a').addClass('radiusBottom')
					.end().find('ul li:only-child > a').removeClass('radiusTop radiusBottom').addClass('radiusAll');
				
				// set min-width of drop down to width of parent
				sdNav.tb1.find(' ul ul').each(function(){
					$(this).css('min-width',$(this).parent().outerWidth(true)+1);
				});
				sdNav.tb2.find(' ul ul').each(function(){
					$(this).css('min-width',$(this).parent().outerWidth(true));
				});
			}
		})();
		
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
			
			/* ExtraContent 12 */
			if (jq.add('div#myExtraContent12').length) {
				jq.add('div#myExtraContent12 script').remove();
				jq.add('div#myExtraContent12').appendTo('div#extraContainer12').show();
			}

			// dynamically style depending on EC areas used
			if ((thisEC[3].length && thisEC[4].length) || (emptySub === false && thisEC[4].length)) cContainer.removeClass('radiusAll').css({'border-top-style':'none','border-bottom-style':'none'});
			else if (thisEC[3].length || emptySub === false) cContainer.removeClass('radiusAll').addClass('radiusBottom').css({'border-top-style':'none'});
			else if (thisEC[4].length) cContainer.removeClass('radiusAll').addClass('radiusTop').css({'border-bottom-style':'none'});
			if (thisEC[6].length) copyright.removeClass('radiusAll').addClass('radiusBottom'), bContainer.find('> ul > li:last >  a').addClass('radiusBottomRight');
			else bContainer.find('> ul > li:last >  a').addClass('radiusRight');
		})();
		
		
		/* @group rounding */
		var sdRounding = (function(){
			// header/toolbar rounding
			// !round top of #toolbar_horizontal if header is used
			if (isNoHeader === false) {
				// handle the title bar when all elements are empty
				if (emptyBar === false) {
					if (sdNav.position === 0) {
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
				if (emptyBar === false) {
					// round both right corners of last link
					if (sdNav.type <= 1) sdNav.tb1.find('> ul:first > li:last >  a:last').addClass('radiusRight');
				} else siteHeader.hide();// handle the title bar when all elements are empty
			}
			// content round
			if (emptySub === false) mPreContent.css('border-top-style','none');
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
		

		/* @group various page style */
		// set width/height of File Sharing blocks according to available space
		if (fsI.length) fsI.width(fsI.parent().outerWidth(true) / 3 - 45).addClass('radiusAll contentShadow').sdSetHeight(fsI,0);
		
		
		/* @group Album */
		var sdAlbums = (function(){
			// invoke sdLightboxAlbums
			$.sdLightboxAlbums({
				css_file	:	'https://d2c8zg9eqwmdau.cloudfront.net/prettyphoto/jquery.prettyPhoto.css',
				js_file		:	'https://d2c8zg9eqwmdau.cloudfront.net/prettyphoto/jquery.prettyPhoto.js',
				animation_speed	:	'fast',
				show_title		:	false,
				theme			:	'light_square'
			});

			$.sdAlbumStyle({
				plusClass : 'radiusAll'
			});
		})();
		
	})();
});