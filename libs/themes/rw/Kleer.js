// Kleer (c) 2012 Adam Merrifield http://seydoggy.github.com/libs/rw/ultimate/Kleer.js

jQuery.noConflict();
jQuery(document).ready(function($){
	var sdKleerFunctions = (function(){
		// VARIABLES
		var jq = $([]),
			wOuter = jq.add('div.wrapperOuter'),
			wHeader = jq.add('div.wrapperHeader'),
			siteHeader = wHeader.find('header.siteHeader'),
			titleBlock = wHeader.find('div.titleBlock'),
			title = titleBlock.find('hgroup.title'),
			logo = titleBlock.find('a.logo'),
			logoImg = logo.find('img'),
			wContent = jq.add('div.wrapperContent'),
			mContent = wContent.find('section.mainContent'),
			fsI = jq.add('.filesharing-item'),
			bEntry = jq.add('.blog-entry'),
			sContent = wContent.find('aside.sidebarContent'),
			sPlugin = sContent.find('section.plugin_sidebar'),
			wPostContainer = jq.add('div.wrapperPostContainer'),
			wFooter = jq.add('div.wrapperFooter'),
			wCopyright = jq.add('div.wrapperCopyright'),
			footer = wCopyright.find('section.footer'),
			bContainer = wCopyright.find('nav.breadcrumbContainer'),
			pageWidth = siteHeader.outerWidth(true);
			
		// FUNCTIONS
		
		/* @group General styles */
		// set width of .wrapperOuter to .siteHeader
		wOuter.css('min-width',pageWidth + 86);

		// invoke slideshow
		$.SeydoggySlideshow({
			plusClass : 'radiusAll',
			widthAdjust : 29
		});
		/* @end */

		/* @group title center */
		var sdTitle = (function(){
			if (titleBlock.css('float') == 'none') {
				var lw = logo.outerWidth(true),
					tw = title.outerWidth(true),
					tbw = lw + tw;
				titleBlock.width(tbw);
				if (!logoImg.length) title.css({'margin-left':'0','text-align':'center'});
			}
		})();
		/* @end */

		/* @group toolbar split/vertical options */
		var sdNavOptions = (function(){
			// invoke sdSmartNav
			$.sdSmartNav();

			// STYLES FOR NAVIGATION CENTER
			if (sdNav.tb1.css('float') == 'none') {
				sdNav.tb1.width(sdNav.tb1.find('ul:first').outerWidth(true) + 1);
			}

			// STYLES FOR TIER 1
			sdNav.tb1
				.find('a').css('background-position','0' + ' ' + (((sdNav.tb1.find('a').outerHeight(true) / 2) - 23) + 'px'))
				.end().find('.current').add(sdNav.tb1.find('.currentAncestor')).css('background-position','left top')
				.end().end().find('ul:first').addClass('radiusAll contentShadow');

			if (!sdNav.tb1.find('ul li:first').siblings().length) {
				sdNav.tb1.find('a').addClass('radiusAll').css('border-style','none');
			}else{
				sdNav.tb1
					.find('a:first').addClass('radiusLeft').css('border-left-style','none')
					.end().find('a:last').addClass('radiusRight').css('border-right-style','none');
			}

			// STYLES FOR TIER 2
			sdNav.tb2
				.find('a').css('background-position','left bottom')
				.end().find('ul').append('<div class="clear">')
				.end().find('ul li a').addClass('radiusTop outerShadowTop');

			// STYLES FOR TIER 3
			sdNav.tb3
				.find('a')
					.addClass('radiusAll contentShadowLight')
					.css('background-position','0' + ' ' + (((sdNav.tb3.find('a').outerHeight(true) / 2) - 26) + 'px'))
				.end().find('.current').add(sdNav.tb3.find('.currentAncestor')).css('background-position','left top');
		})();
		/* @end */
			
		/* @group ExtraContent */
		var sdExtracontent = (function(){
			// EC 1 is handled in SS3
			// VARIABLES
			var myEC = '#myExtraContent',
				ec = [
					wPostContainer,
					wFooter
				],
				ecValue = ec.length;

			/* ExtraContent (jQuery) VERSION: r1.4.2 */
			var extraContent =  (function() {
				for (i=2;i<=ecValue + 1;i++) {
					if ($(myEC + i).length) {
						$(myEC + i + ' script').remove();
						$(myEC + i).appendTo('#extraContainer'+i).show();
						// !hide !empty ExtraContent areas
						ec[i-2].show();
					}
				}
			})();
		})();
		/* @end */
			
		/* @group Sidebar Height */
		var sdSidebar = (function(){
			if (sContent.css('display') != 'none') {
				// set height .mainContent to that of .sidebarContent if shorter
				mContent.css('min-height',sContent.height());
				// styles for left sidebar
				if (sContent.css('float') == 'left') mContent.addClass('innerShadowLeft');
				// styles for right sidebar
				else mContent.addClass('innerShadowRight');
			}
		})();
		/* @end */
			
		/* @group copyright/breadcrumb */
		var sdCopyright = (function(){
			// if copyright/breadcrumb are present
			if (bContainer.length) {
				// remove leading breadcrumb separator
				bContainer + $('span.separator:first').hide();
				// float left/right if both are present
				if (footer.html().length) footer.css({'float':'left','text-align':'left'}), bContainer.css({'float':'right','text-align':'right'});
			}
			// if copyright is not present show footer anyway
			else if (!(footer.html().length)) wCopyright.height(50);
		})();
		/* @end */
		
		/* @group various page style */
		var sdPageStyles = (function(){
			// styles for File Sharing page
			// set width/height of File Sharing blocks according to available space
			if (fsI.length) fsI.width(fsI.parent().outerWidth(true) / 3 - 45).addClass('contentShadow').sdSetHeight(fsI,0);
			// styles for Blog page
			if (bEntry.length) sPlugin.children().addClass('contentShadow');
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

			$.sdAlbumStyle();
		})();
		/* @end */
	})();
});