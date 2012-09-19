// seyDoggy RapidWeaver Common (c) 2012 Adam Merrifield https://d2fjsjzhqhsiq8.cloudfront.net/ultimate/common.js

/* Table of Contents
==================================================
	18		jQuery Cycle Plugin
	1566	RwGet - script to parse RapidWeaver's %pathto()% syntax
	1606	rwAddLinks - Link the unlinkable
	1641	sdSetHeight - vertical alignment function
	1676	SeydoggySlideshow - SS3
	1865	sdSmartNav - Creates smart navigation
	1990	sdVertAlign - vertical alignment function
	2035	sdLightboxAlbums - prettyPhoto lightbox helper for RapidWeaver theme developers
	2141	sdAlbumStyle - styles RapidWeaver albums
	2178	IEgradius - to make rounded gradients behave in IE9
	2239	Frehmwerk - common classes for Frehmwerk themes
*/


/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.9999.5 (10-APR-2012)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.3.2 or later
 */
;(function($, undefined) {
"use strict";

var ver = '2.9999.5';

// if $.support is not defined (pre jQuery 1.3) add what I need
if ($.support === undefined) {
	$.support = {
		opacity: !($.browser.msie)
	};
}

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && console.log)
		console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
}
$.expr[':'].paused = function(el) {
	return el.cyclePause;
};


// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'pause', 'resume', 'toggle', 'next', 'prev', 'stop', 'destroy' or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in first arg == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;

		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;
		this.cycleStop = 0; // issue #108

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();

		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts.backwards);}, startTime);
		}
	});
};

function triggerPause(cont, byHover, onPager) {
	var opts = $(cont).data('cycle.opts');
	var paused = !!cont.cyclePause;
	if (paused && opts.paused)
		opts.paused(cont, opts, byHover, onPager);
	else if (!paused && opts.resumed)
		opts.resumed(cont, opts, byHover, onPager);
}

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop === undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'destroy':
		case 'stop':
			var opts = $(cont).data('cycle.opts');
			if (!opts)
				return false;
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			if (opts.elements)
				$(opts.elements).stop();
			$(cont).removeData('cycle.opts');
			if (options == 'destroy')
				destroy(cont, opts);
			return false;
		case 'toggle':
			cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
			checkInstantResume(cont.cyclePause, arg2, cont);
			triggerPause(cont);
			return false;
		case 'pause':
			cont.cyclePause = 1;
			triggerPause(cont);
			return false;
		case 'resume':
			cont.cyclePause = 0;
			checkInstantResume(false, arg2, cont);
			triggerPause(cont);
			return false;
		case 'prev':
		case 'next':
			opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		}
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;

	function checkInstantResume(isPaused, arg2, cont) {
		if (!isPaused && arg2 === true) { // resume now!
			var options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not resume');
				return false;
			}
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			go(options.elements, options, 1, !options.backwards);
		}
	}
}

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
}

// unbind event handlers
function destroy(cont, opts) {
	if (opts.next)
		$(opts.next).unbind(opts.prevNextEvent);
	if (opts.prev)
		$(opts.prev).unbind(opts.prevNextEvent);

	if (opts.pager || opts.pagerAnchorBuilder)
		$.each(opts.pagerAnchors || [], function() {
			this.unbind().remove();
		});
	opts.pagerAnchors = null;
	$(cont).unbind('mouseenter.cycle mouseleave.cycle');
	if (opts.destroy) // callback
		opts.destroy(opts);
}

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	var startingSlideSpecified;
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
	if (meta)
		opts = $.extend(opts, meta);
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.backwards); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide !== undefined) {
		opts.startingSlide = parseInt(opts.startingSlide,10);
		if (opts.startingSlide >= els.length || opts.startSlide < 0)
			opts.startingSlide = 0; // catch bogus input
		else 
			startingSlideSpecified = true;
	}
	else if (opts.backwards)
		opts.startingSlide = els.length - 1;
	else
		opts.startingSlide = 0;

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		if (startingSlideSpecified) {
			// try to find the specified starting slide and if found set start slide index in the map accordingly
			for ( var cnt = 0; cnt < els.length; cnt++ ) {
				if ( opts.startingSlide == opts.randomMap[cnt] ) {
					opts.randomIndex = cnt;
				}
			}
		}
		else {
			opts.randomIndex = 1;
			opts.startingSlide = opts.randomMap[1];
		}
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z;
		if (opts.backwards)
			z = first ? i <= first ? els.length + (i-first) : first-i : els.length-i;
		else
			z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z);
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit) {
		if (!opts.aspect) {
			if (opts.width)
				$slides.width(opts.width);
			if (opts.height && opts.height != 'auto')
				$slides.height(opts.height);
		} else {
			$slides.each(function(){
				var $slide = $(this);
				var ratio = (opts.aspect === true) ? $slide.width()/$slide.height() : opts.aspect;
				if( opts.width && $slide.width() != opts.width ) {
					$slide.width( opts.width );
					$slide.height( opts.width / ratio );
				}

				if( opts.height && $slide.height() < opts.height ) {
					$slide.height( opts.height );
					$slide.width( opts.height * ratio );
				}
			});
		}
	}

	if (opts.center && ((!opts.fit) || opts.aspect)) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ?
					((opts.width - $slide.width()) / 2) + "px" :
					0,
				"margin-top": opts.height ?
					((opts.height - $slide.height()) / 2) + "px" :
					0
			});
		});
	}

	if (opts.center && !opts.fit && !opts.slideResize) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
				"margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
			});
		});
	}

	// stretch container
	var reshape = opts.containerResize && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth || e.width || $e.attr('width');
			if (!h) h = e.offsetHeight || e.height || $e.attr('height');
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
	}

	var pauseFlag = false;  // https://github.com/malsup/cycle/issues/44
	if (opts.pause)
		$cont.bind('mouseenter.cycle', function(){
			pauseFlag = true;
			this.cyclePause++;
			triggerPause(cont, true);
		}).bind('mouseleave.cycle', function(){
				if (pauseFlag)
					this.cyclePause--;
				triggerPause(cont, true);
		});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
		this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);

		if ( $el.is('img') ) {
			// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
			// an image is being downloaded and the markup did not include sizing info (height/width attributes);
			// there seems to be some "default" sizes used in this situation
			var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
			var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
			var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
			var loadingOther = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loadingIE || loadingFF || loadingOp || loadingOther) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options);}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.cssAfter = opts.cssAfter || {};
	opts.cssFirst = opts.cssFirst || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout,10);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed,10);
		if (!opts.sync)
			opts.speed = opts.speed / 2;

		var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
		while((opts.timeout - opts.speed) < buffer) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.backwards)
		opts.nextSlide = opts.startingSlide === 0 ? (els.length-1) : opts.startingSlide-1;
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (!opts.skipInitializationCallbacks) {
		if (opts.before.length)
			opts.before[0].apply(e0, [e0, e0, opts, true]);
		if (opts.after.length)
			opts.after[0].apply(e0, [e0, e0, opts, true]);
	}
	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});
	if (opts.pager || opts.pagerAnchorBuilder)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
}

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
}

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (var p in txs) {
			if (txs.hasOwnProperty(p)) {
				tx = txs[p];
				if (txs.hasOwnProperty(p) && $.isFunction(tx))
					opts.fxs.push(p);
			}
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
}

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		// add the slide to the random map and resort
		if (opts.random) {
			opts.randomMap.push(opts.slideCount-1);
			opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		}

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$s.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager || opts.pagerAnchorBuilder)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		debug('manualTrump in go(), stopping active transition');
		$(els).stop(true,true);
		opts.busy = 0;
		clearTimeout(p.cycleTimeout);
	}

	// don't begin another timeout-based transition if there is one active
	if (opts.busy) {
		debug('transition active, ignoring new tx request');
		return;
	}


	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause && !opts.bounce &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	var changed = false;
	if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
		changed = true;
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
				opts.lastFx = 0;
			else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
				opts.lastFx = opts.fxs.length - 1;
			fx = opts.fxs[opts.lastFx];
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			opts.busy = 0;
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
			if (!p.cycleStop) {
				// queue next transition
				queueNext();
			}
		};

		debug('tx firing('+fx+'); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);

		// get ready to perform the transition
		opts.busy = 1;
		if (opts.fxFn) // fx function provided?
			opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
			$.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else
			$.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
	}
	else {
		queueNext();
	}

	if (changed || opts.nextSlide == opts.currSlide) {
		// calculate the next slide
		var roll;
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length) {
				opts.randomIndex = 0;
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			}
			opts.nextSlide = opts.randomMap[opts.randomIndex];
			if (opts.nextSlide == opts.currSlide)
				opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
		}
		else if (opts.backwards) {
			roll = (opts.nextSlide - 1) < 0;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = 1;
				opts.currSlide = 0;
			}
			else {
				opts.nextSlide = roll ? (els.length-1) : opts.nextSlide-1;
				opts.currSlide = roll ? 0 : opts.nextSlide+1;
			}
		}
		else { // sequence
			roll = (opts.nextSlide + 1) == els.length;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = els.length-2;
				opts.currSlide = els.length-1;
			}
			else {
				opts.nextSlide = roll ? 0 : opts.nextSlide+1;
				opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
			}
		}
	}
	if (changed && opts.pager)
		opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);

	function queueNext() {
		// stage the next transition
		var ms = 0, timeout = opts.timeout;
		if (opts.timeout && !opts.continuous) {
			ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
		 if (opts.fx == 'shuffle')
			ms -= opts.speedOut;
	  }
		else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
			ms = 10;
		if (ms > 0)
			p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.backwards); }, ms);
	}
}

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
   $(pager).each(function() {
	   $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
   });
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn.call(curr,curr,next,opts,fwd);
		while (opts.fx != 'none' && (t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
}

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts,1); };
$.fn.cycle.prev = function(opts) { advance(opts,0);};

// advance slide forward or back
function advance(opts, moveForward) {
	var val = moveForward ? 1 : -1;
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	var cb = opts.onPrevNextEvent || opts.prevNextClick; // prevNextClick is deprecated
	if ($.isFunction(cb))
		cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, moveForward);
	return false;
}

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
	opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
}

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder)) {
		a = opts.pagerAnchorBuilder(i,el);
		debug('pagerAnchorBuilder('+i+', el) returned: ' + a);
	}
	else
		a = '<a href="#">'+(i+1)+'</a>';

	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone[0]);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	opts.pagerAnchors =  opts.pagerAnchors || [];
	opts.pagerAnchors.push($a);

	var pagerFn = function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		var cb = opts.onPagerEvent || opts.pagerClick; // pagerClick is deprecated
		if ($.isFunction(cb))
			cb(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
//		return false; // <== allow bubble
	};

	if ( /mouseenter|mouseover/i.test(opts.pagerEvent) ) {
		$a.hover(pagerFn, function(){/* no-op */} );
	}
	else {
		$a.bind(opts.pagerEvent, pagerFn);
	}

	if ( ! /^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
		$a.bind('click.cycle', function(){return false;}); // suppress click

	var cont = opts.$cont[0];
	var pauseFlag = false; // https://github.com/malsup/cycle/issues/44
	if (opts.pauseOnPagerHover) {
		$a.hover(
			function() { 
				pauseFlag = true;
				cont.cyclePause++; 
				triggerPause(cont,true,true);
			}, function() { 
				if (pauseFlag)
					cont.cyclePause--; 
				triggerPause(cont,true,true);
			} 
		);
	}
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	debug('applying clearType background-color hack');
	function hex(s) {
		s = parseInt(s,10).toString(16);
		return s.length < 2 ? '0'+s : s;
	}
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v && v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	}
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
}

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	if (typeof opts.cssBefore.opacity == 'undefined')
		opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (opts.slideResize && w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (opts.slideResize && h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {
		$n.animate(opts.animIn, speedIn, easeIn, function() {
			cb();
		});
	};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		$l.css(opts.cssAfter);
		if (!opts.sync) 
			fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
	activePagerClass: 'activeSlide', // class name used for the active pager link
	after:            null,     // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
	allowPagerClickBubble: false, // allows or prevents click event on pager anchors from bubbling
	animIn:           null,     // properties that define how the slide animates in
	animOut:          null,     // properties that define how the slide animates out
	aspect:           false,    // preserve aspect ratio during fit resizing, cropping if necessary (must be used with fit option)
	autostop:         0,        // true to end slideshow after X transitions (where X == slide count)
	autostopCount:    0,        // number of transitions (optionally used with autostop to define X)
	backwards:        false,    // true to start slideshow at last slide and move backwards through the stack
	before:           null,     // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
	center:           null,     // set to true to have cycle add top/left margin to each slide (use with width and height options)
	cleartype:        !$.support.opacity,  // true if clearType corrections should be applied (for IE)
	cleartypeNoBg:    false,    // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
	containerResize:  1,        // resize container to fit largest slide
	continuous:       0,        // true to start next transition immediately after current one completes
	cssAfter:         null,     // properties that defined the state of the slide after transitioning out
	cssBefore:        null,     // properties that define the initial state of the slide before transitioning in
	delay:            0,        // additional delay (in ms) for first transition (hint: can be negative)
	easeIn:           null,     // easing for "in" transition
	easeOut:          null,     // easing for "out" transition
	easing:           null,     // easing method for both in and out transitions
	end:              null,     // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
	fastOnEvent:      0,        // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
	fit:              0,        // force slides to fit container
	fx:               'fade',   // name of transition effect (or comma separated names, ex: 'fade,scrollUp,shuffle')
	fxFn:             null,     // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
	height:           'auto',   // container height (if the 'fit' option is true, the slides will be set to this height as well)
	manualTrump:      true,     // causes manual transition to stop an active transition instead of being ignored
	metaAttr:         'cycle',  // data- attribute that holds the option data for the slideshow
	next:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for next slide
	nowrap:           0,        // true to prevent slideshow from wrapping
	onPagerEvent:     null,     // callback fn for pager events: function(zeroBasedSlideIndex, slideElement)
	onPrevNextEvent:  null,     // callback fn for prev/next events: function(isNext, zeroBasedSlideIndex, slideElement)
	pager:            null,     // element, jQuery object, or jQuery selector string for the element to use as pager container
	pagerAnchorBuilder: null,   // callback fn for building anchor links:  function(index, DOMelement)
	pagerEvent:       'click.cycle', // name of event which drives the pager navigation
	pause:            0,        // true to enable "pause on hover"
	pauseOnPagerHover: 0,       // true to pause when hovering over pager link
	prev:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for previous slide
	prevNextEvent:    'click.cycle',// event which drives the manual transition to the previous or next slide
	random:           0,        // true for random, false for sequence (not applicable to shuffle fx)
	randomizeEffects: 1,        // valid when multiple effects are used; true to make the effect sequence random
	requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
	requeueTimeout:   250,      // ms delay for requeue
	rev:              0,        // causes animations to transition in reverse (for effects that support it such as scrollHorz/scrollVert/shuffle)
	shuffle:          null,     // coords for shuffle animation, ex: { top:15, left: 200 }
	skipInitializationCallbacks: false, // set to true to disable the first before/after callback that occurs prior to any transition
	slideExpr:        null,     // expression for selecting slides (if something other than all children is required)
	slideResize:      1,        // force slide width/height to fixed size before every transition
	speed:            1000,     // speed of the transition (any valid fx speed value)
	speedIn:          null,     // speed of the 'in' transition
	speedOut:         null,     // speed of the 'out' transition
	startingSlide:    undefined,// zero-based index of the first slide to be displayed
	sync:             1,        // true if in/out transitions should occur simultaneously
	timeout:          4000,     // milliseconds between slide transitions (0 to disable auto advance)
	timeoutFn:        null,     // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
	updateActivePagerLink: null,// callback fn invoked to update the active pager link (adds/removes activePagerClass style)
	width:            null      // container width (if the 'fit' option is true, the slides will be set to this width as well)
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
"use strict";

//
// These functions define slide initialization and properties for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
};

// not a cross-fade, fadeout only fades out the top slide
$.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
	$slides.not(':eq('+opts.currSlide+')').css({ display: 'block', 'opacity': 1 });
	opts.before.push(function(curr,next,opts,w,h,rev) {
		$(curr).css('zIndex',opts.slideCount + (rev !== true ? 1 : 0));
		$(next).css('zIndex',opts.slideCount + (rev !== true ? 0 : 1));
	});
	opts.animIn.opacity = 1;
	opts.animOut.opacity = 0;
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	opts.cssAfter.zIndex = 0;
};

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.cssFirst.top = 0;
	opts.animIn.top = 0;
	opts.animOut.top = -h;
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst.top = 0;
	opts.cssBefore.top = -h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = 0-w;
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = -w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = 0;
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.left = 0;
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.width = 'show';
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animIn.height = 'show';
	opts.animOut.height = 0;
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		if (opts.rev)
			fwd = !fwd;
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++) {
				if (fwd)
					opts.els.push(opts.els.shift());
				else
					opts.els.unshift(opts.els.pop());
			}
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z,10)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
		opts.animOut.width = next.cycleW;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.height = 0;
	opts.animIn.top = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	$.extend(opts.cssBefore, { top: 0, left: 0, width: 0 });
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
		$.extend(opts.animOut, { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 });
	});
	opts.cssFirst.top = 0;
	opts.cssFirst.left = 0;
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
	});
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
	opts.animOut.opacity = 0;
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = w;
	opts.animIn.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = h;
	opts.animOut.left = w;
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = this.cycleH;
		opts.animOut.top = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = curr.cycleW/2;
		opts.animOut.width = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = next.cycleH;
		opts.animOut.top = curr.cycleH/2;
		opts.animOut.height = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			$.extend(opts.animOut, { left: w*2, top: -h/2, opacity: 0 });
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2,10);
			var left = parseInt(w/2,10);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0],10), r = parseInt(d[1],10), b = parseInt(d[2],10), l = parseInt(d[3],10);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13),10) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count),10) : 0;
			var ll = l ? l - parseInt(step * (l/count),10) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1),10) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1),10) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);
/* end jQuery cycle */

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
if (sdSS === 'undefined') sdSS = {};

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