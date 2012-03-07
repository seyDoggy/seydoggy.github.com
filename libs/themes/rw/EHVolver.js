/* sdEHVolverFunctions */
jQuery.noConflict();
jQuery(document).ready(function($){
	var sdEHVolverFunctions = (function(){
		// VARIABLES
		var jq = $([]),
		wTitle = jq.add('div.wrapperTitle'),
		siteHeader = wTitle.find('header.siteHeader'),
		title = wTitle.find('hgroup.title'),
		siteLogo = wTitle.find('a.logo img'),
		siteTitle = wTitle.find('h1.site_title'),
		siteSlogan = wTitle.find('h2.site_slogan'),
		tbHW = jq.add('div.wrapperTBH'),
		wHeader = jq.add('div.wrapperHeader'),
		hContainer = wHeader.find('.headerContainer'),
		hShadowB = wHeader.find('div.headerShadowBottom'),
		hPreContent = wHeader.find('div.preContent'),
		sdSlideshow = wHeader.find('div.seydoggySlideshow'),
		pageHeader = wHeader.find('div.pageHeader'),
		slideHeader = wHeader.find('div.seydoggySlideshow,div.pageHeader'),
		wPostHeader = jq.add('div.wrapperPostHeader'),
		wPreContainer = jq.add('div.wrapperPreContainer'),
		wContent = jq.add('div.wrapperContent'),
		fsI = jq.add('div.filesharing-item'),
		mContent = wContent.find('section.mainContent'),
		sContent = wContent.find('aside.sidebarContent'),
		sPlugin = sContent.find('section.plugin_sidebar'),
		bEntry = wContent.find('div.blog-entry'),
		sbTitle = wContent.find('.sidebar_title'),
		wPostContainer = jq.add('div.wrapperPostContainer'),
		wFooter = jq.add('div.wrapperFooter'),
		wCopyright = jq.add('div.wrapperCopyright'),
		footer = wCopyright.find('footer.wrapperInner section.footer'),
		bContainer = wCopyright.find('footer.wrapperInner nav.breadcrumbContainer'),
		isNoHeader = false;

		if (hPreContent.css('padding-right') == '0px') isNoHeader = true;

		/* @group general styles */
		var thisSetHeight = 30;
		// if header height variable or if custom header is transparent set styles
		if (isNoHeader) {
			sdSlideshow.css('border','none');
			pageHeader.css('background','transparent');
			thisSetHeight = 0;
		} else {
			hContainer.css('padding','1em 0 3em');
			hPreContent.css('padding','1em');
			hShadowB.css('box-shadow','0 3em 1.5em -2em rgba(0,0,0,.3)');
		}
		
		// invoke slideshow
		$.SeydoggySlideshow({
			heightAdjust : thisSetHeight
		});
		
		// styles for !empty sidebar title
		if (sbTitle.html().length) sbTitle.css('margin-bottom','0.5em');
		/* @end */		
		
		/* @group title vertical/horizontal alignment */
		var sdTitlealign = (function(){
			// vertical center logo
			if (siteLogo.length) siteLogo.sdVertAlign(siteHeader).end().show();
			// vertical center title
			if (siteTitle.html().length) siteTitle.sdVertAlign(siteHeader).end().show();
			// vertical center slogan
			if (siteSlogan.html().length) siteSlogan.sdVertAlign(siteHeader).end().show();
			// get width of all elements in the siteHeader
			var totalWidth = siteLogo.outerWidth(true) + siteTitle.outerWidth(true) + siteSlogan.outerWidth(true) + 1;
			// set siteHeader width (center styling done in CSS)
			siteHeader.width(totalWidth);
		})();
		/* @end */

		/* @group toolbar split/vertical options */
		var sdNavOptions = (function(){
			// invoke sdSmartNav
			$.sdSmartNav();
			
			// if option 2-tier
			if (sdNav.type == 1) {
				// styles for toolbar_horizontal
				sdNav.tb1.find('> ul').sdVertAlign(tbHW).find('a').addClass('radiusButtons contentShadowLight');
				// styles for toolbar_vertical
				sdNav.tb3.find('a').addClass('radiusButtons contentShadowLight');
			} else if (sdNav.type == 3) {
				// if option Vertical
				sdNav.tb3.find('a').addClass('radiusButtons contentShadowLight');
				tbHW.remove();
			} else tbHW.remove();
		})();
		/* @end */

		/* @group ExtraContent */
		var sdExtracontent = (function(){
			// EC 1 is handled in SS3
			// VARIABLES
			var myEC = '#myExtraContent',
			ec = [
				wPostHeader,
				wPreContainer,
				wPostContainer,
				wFooter
			],
			ecValue = ec.length;
			/* ExtraContent (jQuery) VERSION: r1.4.2 */
			for (i=2;i<=ecValue + 1;i++) {
				if ($(myEC + i).length) {
					$(myEC + i + ' script').remove();
					$(myEC + i).appendTo('#extraContainer'+i).show();
					// !hide !empty ExtraContent areas
					ec[i-2].show();
				}
			}
		})();
		/* @end */

		/* @group breadcrumb styles */
		var sdCopyright = (function(){
			// if copyright/breadcrumb are both present
			if (bContainer.length) {
				// remove leading breadcrumb separator
				bContainer + $('span.separator:first').hide();
				// float left/right if both are present
				if (footer.html().length) footer.css({'float':'left','text-align':'left'}), bContainer.css({'float':'right','text-align':'right'});
			}
			// if copyright is not present show footer anyway
			else if (!footer.html().length)wCopyright.height(50);
		})();
		/* @end */

		/* @group various page style */
		var sdPageStyles = (function(){
			// styles for File Sharing page
			// set width of File Sharing blocks according to available space
			if (fsI.length) fsI.width(fsI.parent().outerWidth(true) / 3 - 45).addClass('contentShadow').sdSetHeight(fsI,0);
			// styles for Blog page
			if (bEntry.length) sPlugin.children().addClass('contentShadow');
		})();
		/* @end */
		
		/* @group Album */
		var sdAlbums = (function(){
			// invoke sdLightboxAlbums
			$.sdLightboxAlbums({
				css_file	:	RwGet.pathto('css/jquery.prettyPhoto.css'),
				js_file		:	RwGet.pathto('scripts/jquery.prettyPhoto.js'),
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