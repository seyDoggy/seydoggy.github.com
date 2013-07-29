/*
	Frehmwerk
	(c) 2012, Adam Merrifield
	http://seydesign.com/frehmwerk
*/

/* Theme JavaScript
	Table of Contents
==================================================
	Variables
	FUNCTIONS
		SS3
		General Styles
		Toolbar Split/Vertical Options
		ExtraContent
		Albums
*/
(function($) {
	$.frehmwerk = function(settings) {
		// OPTIONS
		var fw_opts = {
			albumClass : ''
		};

		// check for options
		if (settings) $.extend(fw_opts, settings);

		/* Variables
		================================================== */
		var jq = $([]),
		div_inner = jq.add('div.inner'),
		div_titleBlock = jq.add('div.titleBlock'),
		div_top = jq.add('div.top'),
		div_bottom = jq.add('div.bottom'),
		div_wide = jq.add('div.wide'),
		div_narrow = jq.add('div.narrow');

		/* FUNCTIONS
		================================================== */

		/* General Styles
		================================================== */
		// wide/narrow height
		$(window).load(function(){
			if (div_narrow.css('display') !== 'none') div_wide.css('min-height',div_narrow.height());
		});

		// set left/right class on wide and narrow columns
		if (div_wide.css('float') != 'none') {
			div_wide.css('float') == 'right' ? div_wide.addClass('right') : div_wide.addClass('left');
			div_narrow.css('float') == 'right' ? div_narrow.addClass('right') : div_narrow.addClass('left');
		}

		/* Toolbar Split/Vertical Options
		================================================== */
		var sdNavOptions = (function(){
			var toolbar1 = 'toolbar1',
				toolbar2 = 'toolbar2',
				toolbar3 = 'toolbar3',
				dropVal = true;

			// invoke sdSmartNav
			$.sdSmartNav({
				element:'nav',
				tier1:'.' + toolbar1,
				tier2:'.' + toolbar2,
				tier3:'.' + toolbar3,
				drop:dropVal
			});

			var responsiveNavHelper = function () {
				if (jq.add(window).width() <= '600' && jq.add('meta[name=viewport]').length || sdNav.drop == false) dropVal = false;

				// invoke sdSmartNav
				$.sdSmartNav({
					element:'nav',
					tier1:'.' + toolbar1,
					tier2:'.' + toolbar2,
					tier3:'.' + toolbar3,
					drop:dropVal
				});
				// if mobile
				if (jq.add(window).width() <= '600' && jq.add('meta[name=viewport]').length) {
					// remove additional tiers
					sdNav.tb2.remove();
					sdNav.tb3.remove();
					// add link to navigation
					if (!$('.responsiveMenu').length) {
						jq.add('<a href="#' + toolbar3 + '" title="menu" class="responsiveMenu"><i></i></a>').prependTo(div_titleBlock).css({
							"margin-top":(div_titleBlock.height()/2)-16
						});
					}
					// if theme supports Font Awesome and has styles for it...
					if (jq.add('a.responsiveMenu i').css('position') == 'relative') jq.add('a.responsiveMenu i').addClass('icon-reorder icon-large');
					// move nav after footer
					jq.add('<div class="outer last"><div class="inner"></div></div>').insertAfter(div_inner.last());
					sdNav.tb1.appendTo(jq.add('div.outer.last > div.inner')).attr({'class':toolbar3, 'id':toolbar3}).css({'display':'block','margin-top':'1em'});
				}
			};

			responsiveNavHelper();
			$(window).on('resize orientationchange', responsiveNavHelper);
		})();

		/* ExtraContent
		================================================== */
		var sdExtracontent = (function(){
			// EC 1 is handled in SS3
			// VARIABLES
			var EC = '#extraContainer',
				ec = '.extracontent',
				myEC = '#myExtraContent',
				ecValue = 12,
				i=2;

			/* ExtraContent (jQuery) VERSION: r1.4.2 */
			for (i;i<=ecValue;i++) {
				if ($(myEC + i).length) {
					$(myEC + i + ' script').remove();
					$(myEC + i).appendTo(EC + i).css('display','block');
					$(EC + i).css('display','block').parent(ec).css('display','block');
				}
			}
		})();

		/* Albums
		================================================== */
		var sdAlbums = (function(){
			// invoke sdLightboxAlbums
			$.sdLightboxAlbums({
				css_file	:	'https://d2c8zg9eqwmdau.cloudfront.net/prettyphoto/jquery.prettyPhoto.css',
				css_local	:	RwGet.pathto('options/prettyphoto/jquery.prettyPhoto.css'),
				js_file		:	'https://d2c8zg9eqwmdau.cloudfront.net/prettyphoto/jquery.prettyPhoto.js',
				js_local	:	RwGet.pathto('options/prettyphoto/jquery.prettyPhoto.js'),
				animation_speed	:	'fast',
				show_title		:	false,
				theme			:	'light_square',
				social_tools	:	false
			});

			$.sdAlbumStyle({
				plusClass : fw_opts.albumClass
			});
		})();

	};
})(jQuery);