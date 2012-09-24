// seyDoggy RapidWeaver Common (c) 2012 Adam Merrifield http://seydoggy.github.com/libs/themes/rw/common.js

/* Table of Contents
==================================================
	20		RwGet - script to parse RapidWeaver's %pathto()% syntax
	59		rwAddLinks - Link the unlinkable
	94		sdSetHeight - vertical alignment function
	129		SeydoggySlideshow - SS3
	317		sdSmartNav - Creates smart navigation
	443		sdVertAlign - vertical alignment function
	488		sdLightboxAlbums - prettyPhoto lightbox helper for RapidWeaver theme developers
	519		sdAlbumStyle - styles RapidWeaver albums
	630		IEgradius - to make rounded gradients behave in IE9
	692		Frehmwerk - common classes for Frehmwerk themes
*/


/* 

# RwGet r0.1 #

Be sure to include the following in the <head> of your index.html file:

<script charset="utf-8">
	RwSet = {
		pathto: "%pathto(javascript.js)%",
		baseurl: "%base_url%"
	};
</script>

*/
RwGet = {
	pathto: function(path, file) {
		var rtrim = function(str, list) {
			var charlist = !list ? 's\xA0': (list + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
			var re = new RegExp('[' + charlist + ']+$', 'g');
			return (str + '').replace(re, '');
		};
		var jspathto = rtrim(RwSet.pathto, "javascript.js");
		if ((path !== undefined) && (file !== undefined)) {
			jspathto = jspathto + path + file;
		} else if (path !== undefined) {
			jspathto = jspathto + path;
		}
		return jspathto;
	},
	baseurl: function(path, file) {
		var jsbaseurl = RwSet.baseurl;
		if ((path !== undefined) && (file !== undefined)) {
			jsbaseurl = jsbaseurl + path + file;
		} else if (path !== undefined) {
			jsbaseurl = jsbaseurl + path;
		}
		return jsbaseurl;
	}
};

/*
	# rwAddLinks (jQuery plugin) #

	AUTHOR:	Adam Merrifield <http://adam.merrifield.ca>
	VERSION: v1.0.0
	DATE: 06-17-11 07:54

	USAGE:
	- include this plugin code along with jQuery
	- include an array of URL's with as many items as
		there are elements to link
	- select a group of elements to link
	- invoke .rwAddLinks()

	EXAMPLE:
		var someLinks = [
			"http://www.google.com",
			"http://www.twitter.com",
			"http://www.facebook.com"
		];
		$('.someDiv').rwAddLinks(someLinks);
*/
(function($) {
	$.fn.rwAddLinks = function(linkArr) {
		var i = 0;
		$(this).each(function(i) {
			$(this).click(function() {
				location.href = linkArr[i++];
			}).hover(function() {
				$(this).css("cursor", "pointer");
			});
		});
	};
})(jQuery);

/*
	# sdSetHeight - vertical alignment function #

	AUTHOR:	Adam Merrifield <http://adam.merrifield.ca>
	VERSION: 1.1.0
	DATE: 07-28-11 12:07

	UPDATES:
	- (1.1.0) added comparative element arg
			- changed namespace from seydoggySetHeight to sdSetHeight
	- (1.0.1) changes
	- (1.0.0) initial release

	ARG DEFINITIONS:
	- elem is the comparative element
	- value is the number in px to increase the height by 

	USAGE:
		$('.someContainer').sdSetHeight($('.someComparative',30));
*/
/* @group sdSetHeight 1.0.0 07-28-11 12:07 */
 (function($) {
	$.fn.sdSetHeight = function(elem, value) {
		sdTallest = 0;
		$(elem).each(function() {
			var thisTallest = $(this).outerHeight(true);
			if (thisTallest > sdTallest) sdTallest = thisTallest;
		});
		$(this).height(sdTallest + value);
	};
})(jQuery);
/* END sdSetHeight */

// initiate sdSS object
if (!window.sdSS) sdSS = {};

/* SeydoggySlideshow 3.2.1 */
(function($) {
	$.SeydoggySlideshow = function(settings) {

		// DEVELOPER SETTINGS
		sdSS.wrapper = '.headerContainer',
			sdSS.target = '.seydoggySlideshow',
			sdSS.ecValue = 1,
			sdSS.imgType = 'jpg',
			sdSS.bgPosition = 'center top',
			sdSS.bgRepeat = 'repeat',
			sdSS.widthAdjust = 29,
			sdSS.heightAdjust = 30,
			sdSS.plusClass = '';

		// check for options
		if (settings) $.extend(sdSS, settings);

		// VARIABLES
		var jq = $([]),
			arrlen = '',
			i = 0,
			isVariable = typeof sdSS.headerHeightVariable != 'undefined',
			hContainer = jq.add('div' + sdSS.wrapper),
			sdSlideshow = hContainer.find('div' + sdSS.target),
			pageHeader = sdSlideshow.find('div.pageHeader'),
			sdSlidePager = '',
			slideHeader = sdSlideshow.add(pageHeader),
			ec1 = hContainer.find('div#extraContainer' + sdSS.ecValue),
			preContent = ec1.parent('div.preContent'),
			myEC = hContainer.find('div#myExtraContent' + sdSS.ecValue),
			sdContentSlide = jq.add('div.sdSlideBoxStack'),
			sdContentIndex = 0,
			headerWidth = sdSlideshow.width(),
			headerHeight = pageHeader.css('height'),
			nextClass = '',
			prevClass = '',
			plusClass = 0;

		// set plusClass
		sdSS.plusClass != '' ? plusClass = ' ' + sdSS.plusClass : plusClass = ''; 

		// if SlideBox Stacks is not found, use SlideBox Snippet
		if (!sdContentSlide.length) sdContentSlide = jq.add('div.sdSlideBoxSnippet'), sdContentIndex = 1;


		// EXTRACONTENT AREA 1

		// if the first ExtraContent hasn't yet been propogated
		if (!myEC.length) {
			myEC = jq.add('div#myExtraContent' + sdSS.ecValue);
			if (myEC.length) {
				myEC.find('script').remove().end().appendTo(ec1).show();

				// !hide !empty ExtraContent area
				ec1.show().width(headerWidth - sdSS.widthAdjust).css('z-index', '100');
				preContent.show();

				// if header height is variable set .seydoggySlideshow height to content height
				if (isVariable) slideHeader.sdSetHeight(ec1.find('div'), sdSS.heightAdjust);
			}
		}

		// if Slideshow is enabled in some form
		if ((typeof sdSS.slideNum != "undefined") || (typeof sdSS.slideWH != "undefined")) {

			// SETUP SLIDES

			// if SlideBox option is used
			if (typeof sdSS.slideBox != "undefined") {

				// SETUP BOX SLIDES

				// VARIABLES
				sdSS.slideNum = [];

				// determine stack or snippet
				if (sdContentSlide.length) {
					sdContentSlide.each(function(i) {
						sdSS.slideNum[i++] = (sdContentSlide.index(this)) + sdContentIndex;
					});
				}

				// set array length
				arrlen = sdSS.slideNum.length;

				// transfer header styles to parent div
				sdSlideshow.css({
					'background-image': pageHeader.css('background-image'),
					'background-position-x': pageHeader.css('background-position-x'),
					'background-position-y': pageHeader.css('background-position-y'),
					'background-color': pageHeader.css('background-color'),
					'background-size': pageHeader.css('background-size'),
					'height' : pageHeader.css('height')
				});

				// clean up what's there
				pageHeader.add(ec1).remove();

				// add box slides to slideshow
				for (i; i < arrlen; ++i) {
					sdSlideshow.append('<div class="pageHeader' + plusClass + '" id="sdSlideBox' + sdSS.slideNum[i] + '" style="background: transparent; width:' + headerWidth + 'px;"/>');
					jq.add('div#mySdSlideBox' + sdSS.slideNum[i]).appendTo('div#sdSlideBox' + sdSS.slideNum[i]).show();
				}

				// if header height is variable set .seydoggySlideshow height to content height
				if (isVariable) sdSlideshow.sdSetHeight(sdContentSlide, 0);
			} else {
				// else if standard slides/snippets are used

				// SET UP IMAGE SLIDES

				// clean up what's there
				pageHeader.remove();

				if (typeof sdSS.slideWH != "undefined") {
					// WAREHOUSE
					arrlen = sdSS.slideWH.length;
					for (i; i < arrlen; ++i) {
						sdSlideshow.append('<div class="pageHeader' + plusClass + '" style="background: url(' + sdSS.slideWH[i] + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"/>');
					}
				} else {
					// LOCAL
					arrlen = sdSS.slideNum.length;
					for (i; i < arrlen; ++i) {
						sdSlideshow.append('<div class="pageHeader' + plusClass + '" style="background: url(' + RwGet.pathto('images/editable_images/header' + sdSS.slideNum[i] + '.' + sdSS.imgType) + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"/>');
					}
				}
			}

			// SLIDESHOW SETTINGS

			// if navigation is selected
			if (sdSS.navigation == true) {

				// create navigation elements
				sdSlideshow.append('<div class="sdSlideNav"><a class="prev" href="#">&lsaquo;</a><a class="next" href="#">&rsaquo;</a></div>');
				nextClass = '.sdSlideNav .next', prevClass = '.sdSlideNav .prev';

				// if slidebox is not in use
				if (typeof sdSS.slideBox == 'undefined') {

					// make extracontent 1 smaller on each side
					var navWidth = jq.add('div.sdSlideNav a.prev, div.sdSlideNav a.next').outerWidth(true);
					ec1.width(ec1.width() - (navWidth * 2)).css('margin-left', navWidth);

					// (again) if header height is variable set .seydoggySlideshow height to content height
					if (isVariable) slideHeader.sdSetHeight(ec1.find('div'), sdSS.heightAdjust);
				}
			}

			// if pager is selected set pager classes
			if (sdSS.pager != undefined) sdSlideshow.append('<div class="sdSlidePager"/>'), sdSlidePager = sdSlideshow.find('div.sdSlidePager');


			// START THE SLIDESHOW
			sdSlideshow.cycle({
				autostop: sdSS.autostop,
				fx: sdSS.effect,
				next: nextClass,
				pager: sdSS.pager,
				pagerEvent: 'mouseover', 
				pause: sdSS.pause,
				pauseOnPagerHover: true,
				prev: prevClass,
				random: sdSS.random,
				randomizeEffects: true,
				slideExpr: '.pageHeader',
				speed: sdSS.speed,
				timeout: sdSS.timeout
			});

			// PAGINATION

			// if pagination is active, dynamically set pagination values
			if (sdSlidePager != '' && sdSlidePager.html()) {
				sdSlidePager.find('a').html('&middot;');
				sdSlidePager.css('margin-left',(sdSlidePager.width()/2)*(-1));
			}
		}

		// SLIDE LINKS

		// add links to slides
		if (typeof sdSS.slideLinks != "undefined") sdSlideshow.find('div.pageHeader').rwAddLinks(sdSS.slideLinks);
	}
})(jQuery);

// be sure to initiate sdNav object in <head> of html with sdNAv = {};
/* sdSmartNav 1.0.9 (c) 2012 Adam Merrifield https://github.com/seyDoggy/sdSmartNav */
(function($) {
	$.sdSmartNav = function(settings) {

		// initiate jQuery object
		var jq = $([]);

		// SETTINGS
		sdNav.element = 'nav',
		sdNav.tier1 = '#toolbar_horizontal',
		sdNav.tier2 = '#toolbar_sub',
		sdNav.tier3 = '#toolbar_vertical'
		sdNav.drop = false;

		// check for options
		if (settings) $.extend(sdNav, settings);

		// GLOBAL VARIABLES
		sdNav.tb1 = jq.add(sdNav.element + sdNav.tier1),
		sdNav.tb2 = jq.add(sdNav.element + sdNav.tier2),
		sdNav.tb3 = jq.add(sdNav.element + sdNav.tier3);

		// test for 
		if (sdNav.type == 1) {
			// show tier 1
			sdNav.tb1.css('display','block');

			// PRIVATE VARIABLES
			var tbsP = '',
				tbvP = sdNav.tb1.find('> ul > li.currentAncestorListItem > ul');

			// if ancestor children are not found
			if (!tbvP.length) tbvP = sdNav.tb1.find('> ul > li.currentListItem > ul');
		} else if (sdNav.type == 2) {
			// show tier 1
			sdNav.tb1.css('display','block');

			// PRIVATE VARIABLES
			var tbsP = sdNav.tb1.find('> ul'),
				tbvP = sdNav.tb1.find('> ul > li.currentAncestorListItem > ul');

			// if ancestor children are not found
			if (!tbvP.length) tbvP = sdNav.tb1.find('> ul > li.currentListItem > ul');
		} else if (sdNav.type == 3) {
			// PRIVATE VARIABLES
			var tbsP = '',
				tbvP = sdNav.tb1.find('> ul');
		} else if (sdNav.type == 4) {
			// PRIVATE VARIABLES
			var tbsP = '',
				tbvP = '';
			sdNav.tb1.remove();
		} else {
			// show tier 1
			sdNav.tb1.css('display','block');

			// PRIVATE VARIABLES (apply if sdNav.type == 0 || typeof sdNav.type == 'undefined')
			var tbsP = sdNav.tb1.find('> ul > li.currentAncestorListItem > ul'),
				tbvP = sdNav.tb1.find('> ul > li.currentAncestorListItem > ul > li.currentAncestorListItem > ul');

			// if ancestor children are not found (apply if sdNav.type == 0 || typeof sdNav.type == 'undefined')
			if (!tbsP.length) tbsP = sdNav.tb1.find('> ul > li.currentListItem > ul');
			if (!tbvP.length) tbvP = sdNav.tb1.find('> ul > li.currentAncestorListItem > ul > li.currentListItem > ul');
		};

		// prepend sub tiers
		if (sdNav.tb1.children().length) {
			if (tbvP.length) {
				sdNav.tb3.prepend(tbvP.clone()).css('display','block');
				if (!(jq.add('body').width() <= '600')) tbvP.css('display','none');
			}
			if (tbsP.length) {
				sdNav.tb2.prepend(tbsP.clone()).css('display','block');
				if (!(jq.add('body').width() <= '600')) tbsP.css('display','none');
			}
		};

		// add drop down menus
		if (sdNav.drop == true) {
			// if tb1 has children
			if (sdNav.tb1.find(' > ul li > ul')) {
				//Add 'hasChildren' class to tb1 ul li's
				sdNav.tb1.find(' > ul li > ul').parent().addClass('hasChildren');

				// tb1 hover animation
				sdNav.tb1.find('ul li').hover(function(){
					$(this).find("> ul").stop('true','true').animate({
						opacity: 'toggle',
						paddingTop: 'toggle'
					});
				});
			};

			// if tb2 has children
			if (sdNav.tb2.find(' > ul li > ul')) {
				//Add 'hasChildren' class to tb2 ul li
				sdNav.tb2.find(' > ul li > ul').parent().addClass('hasChildren');

				// tb2 hover animation
				sdNav.tb2.find('ul li').hover(function(){
					$(this).find("> ul").stop('true','true').animate({
						opacity: 'toggle',
						paddingTop: 'toggle'
					});
				});
			};

			// if tb3 has children
			if (sdNav.tb3.find(' > ul li > ul')) {
				// show siblings ul and parent ul's of a.current
				// to counter RWAlwaysDisplayFullNavigation : true
				sdNav.tb3.find('a.current')
					.siblings('ul').css('display','block')
						.end().parents('ul').css('display','block');
			};

		};

		// PUBLIC VARIABLES
		if (tbvP.length) sdNav.tbvP = tbvP;
		if (tbsP.length) sdNav.tbsP = tbsP;
	};
})(jQuery);

/*
	# sdVertAlign - vertical alignment function #

	AUTHOR:	Adam Merrifield <http://adam.merrifield.ca>
	VERSION: 2.1.2

	UPDATES:
	- (2.1.2) improved performance by using native this instead of $(this)
	- (2.1.1) added support for chaining
	- (2.1.0) added options
	- (2.0.0) forked to jquery plugin
	- (1.0.0) initial release

	ARG DEFINITIONS:
	- parent is the containing element

	USAGE:
		$('.someInnerElement').sdVertAlign($('.someOuterElement'));
*/
 (function($) {
	$.fn.sdVertAlign = function() {
		var parent = this.parent(),
			padMar = 'padding-top',
			vcenterParentHeight = $(parent).innerHeight(true),
			vcenterHeight = this.innerHeight(true),
			pm = Array('m', 'margin'),
			io = Array('o', 'outer', 'outerHeight'),
			i = 0,
			argLen = io.length;

		if (pm.length > io.length) argLen = pm.length;

		if ($.inArray(arguments[0], pm) && $.inArray(arguments[0], io) == -1) parent = arguments[0];

		for (i; i < argLen; i++) {
			if ($.inArray(arguments[i], pm)) padMar = 'margin-top';
			if ($.inArray(arguments[i], io)) vcenterParentHeight = $(parent).outerHeight(true), vcenterHeight = this.outerHeight(true);
		};

		this.css(padMar, ((vcenterParentHeight - vcenterHeight) / 2));
		return this;
	};
})(jQuery);
/* END sdVertAlign */

/*
	# sdLightboxAlbums - prettyPhoto lightbox helper for RapidWeaver theme developers #

	AUTHOR:	Adam Merrifield <http://adam.merrifield.ca>
	VERSION: 1.1.0

	SETTINGS:
	- css_file: is the path to the prettyPhoto css file within the RapidWeaver theme
	- js_file: is the path to the prettyPhoto jQuery plugin

	OPTIONS:
	- animation_speed: can be normal, slow or fast
	- show_title: can be true or false
	- theme: can be default, dark_rounded, dark_square, light_rounded, light_square, facebook

	USAGE:
		// basic use
		$.sdLightboxAlbums({
			css_file	:	'some/path/prettyPhoto.css',
			js_file		:	'another/folder/jquery.prettyPhoto.js'
		});

		// advanced use with options
		$.sdLightboxAlbums({
			css_file	:	'some/path/prettyPhoto.css',
			js_file		:	'another/folder/jquery.prettyPhoto.js',
			animation_speed	:	'slow',
			show_title		:	true,
			theme			:	'facebook',
			social_tools	:	false
		});
*/
(function($) {
	$.sdLightboxAlbums = function(settings) {
		// SETTINGS
		var opts = {
			css_file: '',
			js_file: '',
			animation_speed: 'normal',
			show_title: false,
			theme: 'default',
			social_tools: false
		};
		// check for options
		if (settings.css_file && settings.js_file) {
			$.extend(opts, settings);
			// VARIABLES
			var jq = $([]),
			phA = jq.add('.album-wrapper'),
			mA = jq.add('.movie-thumbnail-frame'),
			thFrame = phA.find('.thumbnail-frame');

			// ACTION
			if (phA.length || mA.length) {
				// load css (prettyPhoto)
				$("head").append("<link>").children(":last").attr({
					rel: "stylesheet",
					type: "text/css",
					href: opts.css_file
				});
				// load js (prettyPhoto)
				$.getScript(opts.js_file, function() {
					// Photo Album
					if (phA.length) {
						// get thumbnail links and alter attributes (prettyPhoto)
						thFrame.each(function() {
							var thisAnch = jq.add('a', this),
							thisImg = jq.add('a img', this),
							thisCap = jq.add('.thumbnail-caption', this);
							thisAnch.attr({
								'href': thisImg.attr('src').replace(/thumb/i, 'full'),
								'rel': 'prettyPhoto[gallery]',
								'title': thisCap.text()
							});
						});
					} else {
						// since photo album is false movie album is true
						// get thumbnails links and alter attributes (prettyPhoto)
						mA.each(function() {
							var thisAnch = jq.add('a', this);
							var thisCap = jq.add('.movie-thumbnail-caption', this);
							var thisPage = thisAnch.attr('href');
							thisAnch.removeAttr('onclick').removeAttr('onkeypress').attr({
								'href': thisPage + '?iframe=true&width=75%&height=75%',
								'rel': 'prettyPhoto[iframes]',
								'title': thisCap.text()
							});
						});
					}
					// apply effects (prettyPhoto)
					jq.add('a[rel^=prettyPhoto]').prettyPhoto({
						animation_speed: opts.animation_speed,
						show_title: opts.show_title,
						theme: opts.theme,
						social_tools: opts.social_tools
					});
				});
			}
		} else {
			// if no options detected, issue warning
			var msg = 'The paths to the lightbox files have not been set by the theme developer!';
			alert(msg);
			console.log(msg);
		}
	}
})(jQuery);

/* sdAlbumStyle 1.0.0 */
(function($){
	$.sdAlbumStyle = function(settings) {
		// OPTIONS
		var opts = {
			plusClass : 'contentShadow'
		}

		// check for options
		if (settings) $.extend(opts, settings);

		// VARIABLES
		var jq = $([]),
		pAlbum = jq.add('div.album-wrapper'),
		tFrameImg = pAlbum.find('div.thumbnail-frame img'),
		mFrameImg = jq.add('.movie-thumbnail-frame img');

		// style photo thumbnails
		tFrameImg.addClass(opts.plusClass);

		// show Photo Album elements
		if (pAlbum.length) {
			var aTitle = pAlbum.parent().find('div.album-title'),
				aDesc = pAlbum.parent().find('div.album-description');

			if (!aTitle.html().length && !aDesc.html().length) pAlbum.css('margin-top', '3em').append('<div class="clear"/>');
			else if (aTitle.html().length && !aDesc.html().length) aTitle.show().css('margin-bottom', '1em');
			else if (!aTitle.html().length && aDesc.html().length) aDesc.show();
			else if (aTitle.html().length && aDesc.html().length) aTitle.show(), aDesc.show();
		};

		// style movie thumbnails
		if (mFrameImg.length) mFrameImg.addClass(opts.plusClass);
	}
})(jQuery);

// jquery.ie9gradius.js
// copyright benjamin intal
// https://github.com/bfintal/jQuery.IE9Gradius.js
//
// Converted to a jQuery plugin by Adam Merrifield
// http://adam.merrifield.ca

(function($){
	$.fn.ie9gradius = function(){
		var that = $(this);
		for (var i = this.length - 1; i >= 0; i--) {
			// define filter test
			var filterscheck = this[i].filters && this[i].filters.length>0;

			// check each css property, we need a border radius and filter
			if ((parseInt($(this[i]).css('borderTopLeftRadius')) > 0 ||
				parseInt($(this[i]).css('borderTopRightRadius')) > 0 ||
				parseInt($(this[i]).css('borderBottomLeftRadius')) > 0 ||
				parseInt($(this[i]).css('borderBottomRightRadius')) > 0) &&
				filterscheck) {

				// carry over the border radius
				var s = 'border-top-left-radius: ' + parseInt($(this[i]).css('borderTopLeftRadius')) + 'px;';
				s += 'border-top-right-radius: ' + parseInt($(this[i]).css('borderTopRightRadius')) + 'px;';
				s += 'border-bottom-left-radius: ' + parseInt($(this[i]).css('borderBottomLeftRadius')) + 'px;';
				s += 'border-bottom-right-radius: ' + parseInt($(this[i]).css('borderBottomRightRadius')) + 'px;';

				// find the start and end colors
				thisFilter = this[i].filters.item('DXImageTransform.Microsoft.gradient');
				var c1 = thisFilter.startColorstr;
				var c2 = thisFilter.endColorstr;

				// form the filter rule
				var g = 'filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=\''+c1+'\', endColorStr=\''+c2+'\');';

				var id = 'ie9gradius_'+parseInt(Math.random() * 100000);

				// we need to remove the current filter because this is spilling outside the border radius
				thisFilter.enabled=0;

				// relative position is needed for proper positioning of the gradient
				$(this[i]).css('position', 'relative');

				// add support for adding hover styling
				$(this[i]).mouseenter(function() { $('#'+id).addClass('gradiusover'); }).mouseleave(function() { $('#'+id).removeClass('gradiusover'); });

				// we need this so that the contents show on top
				$(this[i]).find('> *:not(ul)').css('position', 'relative');

				// the magic is all here
				$(this[i]).prepend('\
				<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"> \
					<div style="'+s+' height: 100%; overflow: hidden;"> \
						<div id="'+id+'" style="'+g+' height: 100%; width: 100%;"> \
						</div></div></div>');
			}
		}
		return $(this);
	};
})(jQuery);

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
		}

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
			div_wide.css('min-height',div_narrow.height());	
		});

		// set left/right class on wide and narrow columns
		if (div_wide.css('float') != 'none') {
			div_wide.css('float') == 'right' ? div_wide.addClass('right') : div_wide.addClass('left');
			div_narrow.css('float') == 'right' ? div_narrow.addClass('right') : div_narrow.addClass('left');
		};

		/* Toolbar Split/Vertical Options
		================================================== */
		var sdNavOptions = (function(){
			var toolbar1 = 'toolbar1',
				toolbar2 = 'toolbar2',
				toolbar3 = 'toolbar3',
				dropVal = true;
				if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length || sdNav.drop == false) dropVal = false;

			// invoke sdSmartNav
			$.sdSmartNav({
				element:'nav',
				tier1:'.' + toolbar1,
				tier2:'.' + toolbar2,
				tier3:'.' + toolbar3,
				drop:dropVal
			});
			// if mobile
			if (jq.add('body').width() <= '600' && jq.add('meta[name=viewport]').length) {
				// remove additional tiers
				sdNav.tb2.remove();
				sdNav.tb3.remove();
				// add link to navigation
				jq.add('<a href="#' + toolbar3 + '" title="menu" class="responsiveMenu"><i></i></a>').prependTo(div_titleBlock).css({
					"margin-top":(div_titleBlock.height()/2)-16,
				});
				// if theme supports Font Awesome and has styles for it...
				if (jq.add('a.responsiveMenu i').css('position') == 'relative') jq.add('a.responsiveMenu i').addClass('icon-reorder icon-large');
				// move nav after footer
				jq.add('<div class="outer last"><div class="inner"></div></div>').insertAfter(div_inner.last());
				sdNav.tb1.appendTo(jq.add('div.outer.last > div.inner')).attr({'class':toolbar3, 'id':toolbar3}).css({'display':'block','margin-top':'1em'});
			}
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
				js_file		:	'https://d2c8zg9eqwmdau.cloudfront.net/prettyphoto/jquery.prettyPhoto.js',
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