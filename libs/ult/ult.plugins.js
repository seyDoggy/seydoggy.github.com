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
