/* 

# RwGet #

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
sdSS = {};

/* SeydoggySlideshow 3.1.1 */
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
        	slideHeader = sdSlideshow.add(pageHeader),
        	ec1 = hContainer.find('div#extraContainer' + sdSS.ecValue),
			myEC = hContainer.find('div#myExtraContent' + sdSS.ecValue),
        	preContent = hContainer.find('div.preContent'),
        	preContentWidth = preContent.width(),
        	sdContentSlide = jq.add('div.sdSlideBoxStack'),
        	sdContentIndex = 0,
        	headerWidth = sdSlideshow.width(),
        	headerHeight = pageHeader.css('height');

		// EXTRACONTENT AREA 1
		// if the first ExtraContent hasn't yet been propogated
		if (!myEC.length) {
			myEC = jq.add('div#myExtraContent' + sdSS.ecValue);
			if (myEC.length) {
				myEC.find('script').remove().end().appendTo(ec1).show();
				// !hide !empty ExtraContent area
				preContent.show();
			}
		}

        if (!sdContentSlide.length) sdContentSlide = jq.add('div.sdSlideBoxSnippet'), sdContentIndex = 1;

        if ((typeof sdSS.slideNum != "undefined") || (typeof sdSS.slideWH != "undefined") || (typeof sdSlideNum != "undefined") || (typeof sdSlideWH != "undefined")) {

			// SETUP SLIDES
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
					'height' : pageHeader.css('height')
                });
                // clean up what's there
                pageHeader.add(ec1).remove();
				
                // add box slides to slideshow
                for (i; i < arrlen; ++i) {
                    sdSlideshow.append('<div class="pageHeader" id="sdSlideBox' + sdSS.slideNum[i] + '" style="width:' + headerWidth + 'px;"></div>');
                    jq.add('div#mySdSlideBox' + sdSS.slideNum[i]).appendTo('div#sdSlideBox' + sdSS.slideNum[i]).show();
                }
                // if header height is variable set .seydoggySlideshow height to content height
                if (isVariable) sdSlideshow.sdSetHeight(sdContentSlide, 0);
            } else {
                // SET UP IMAGE SLIDES
				
                // clean up what's there
                pageHeader.remove();

                if (typeof sdSS.slideWH != "undefined") {
					// WAREHOUSE
	                arrlen = sdSS.slideWH.length;
                    for (i; i < arrlen; ++i) {
                        sdSlideshow.append('<div class="pageHeader" style="background: url(' + sdSS.slideWH[i] + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"></div><!-- .pageHeader -->');
                    }
                } else if (typeof sdSlideWH != "undefined") {
					// WAREHOUSE (legacy API support)
	                arrlen = sdSlideWH.length;
                    for (i; i < arrlen; ++i) {
                        sdSlideshow.append('<div class="pageHeader" style="background: url(' + sdSlideWH[i] + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"></div><!-- .pageHeader -->');
                    }
                } else if (typeof sdSS.slideNum != "undefined") {
                    // LOCAL
                    arrlen = sdSS.slideNum.length;
                    for (i; i < arrlen; ++i) {
                        sdSlideshow.append('<div class="pageHeader" style="background: url(' + RwGet.pathto('images/editable_images/header' + sdSS.slideNum[i] + '.' + sdSS.imgType) + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"></div><!-- .pageHeader -->');
                    }
				} else {
					// LOCAL (legacy API support)
                    arrlen = sdSlideNum.length;
                    for (i; i < arrlen; ++i) {
                        sdSlideshow.append('<div class="pageHeader" style="background: url(' + RwGet.pathto('images/editable_images/header' + sdSlideNum[i] + '.' + sdSS.imgType) + ') ' + sdSS.bgPosition + ' ' + sdSS.bgRepeat + '; width:' + headerWidth + 'px;"></div><!-- .pageHeader -->');
                    }
				}

                // make ExtraContent visible
                preContent.css('z-index', '100');

                // if header height is variable set .seydoggySlideshow height to content height
                if (isVariable) slideHeader.sdSetHeight(ec1.find('div'), sdSS.heightAdjust);
            }

            // START THE SLIDESHOW
            sdSlideshow.cycle({
                fx: sdSS.effect,
                timeout: sdSS.timeout,
                speed: sdSS.speed
            });
        }

        // if header height is variable set .seydoggySlideshow height to content height
        if (typeof sdSS.slideBox == "undefined" && isVariable) slideHeader.sdSetHeight(ec1.find('div'), sdSS.heightAdjust);

        // redefine pageHeader to account for DOM creations
        sdSS.pageHeader = sdSlideshow.find('div.pageHeader');

        // add links to slides
        if (typeof sdSS.slideLinks != "undefined") sdSS.pageHeader.rwAddLinks(sdSS.slideLinks);
        // add links to slides (legacy API support)
        if (typeof sdSlideLinks != "undefined") sdSS.pageHeader.rwAddLinks(sdSlideLinks);

		// add new classes to DOM .pageHeaders
		if (sdSS.plusClass != '') sdSS.pageHeader.addClass(sdSS.plusClass);

        // clean up sdSlideBox backgrounds
        if (typeof sdSS.slideBox != "undefined") sdSS.pageHeader.css('background', 'transparent');

        // set width of header
        sdSS.pageHeader.width(headerWidth);
        preContent.width(headerWidth - sdSS.widthAdjust);
    }
})(jQuery);
// be sure to initiate sdNav object in <head> of html with sdNAv = {};
/* sdSmartNav 1.0.4 */
(function($) {
    $.sdSmartNav = function(settings) {
	
		// initiate jQuery object
		var jq = $([]);
	
		// SETTINGS
        sdNav.element = 'nav',
        sdNav.tier1 = '#toolbar_horizontal',
        sdNav.tier2 = '#toolbar_sub',
        sdNav.tier3 = '#toolbar_vertical';

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
            if (tbvP.length) sdNav.tb3.prepend(tbvP).css('display','block');
            if (tbsP.length) sdNav.tb2.prepend(tbsP).css('display','block');
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
	VERSION: 1.0.0

	UPDATES:
	- (1.0.0) initial release

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
			theme			:	'facebook'
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
            theme: 'default'
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
	                    theme: opts.theme
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
