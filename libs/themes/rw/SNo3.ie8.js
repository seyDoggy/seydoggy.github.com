jQuery(document).ready(function($) {
	// styles for sidebar
	if ($('.sidebarContent').css('float') == 'left' || $('.sidebarContent').css('float') == 'right') {
		if ($('#toolbar_vertical ul').length) {
			var	wrapperWidth = Math.floor($('.wrapper').width());
			$('.wrapper').width(wrapperWidth);
			var mainContentWidth = Math.floor($('.mainContent').width());
			$('.mainContent').width(mainContentWidth);
			var sidenavWidth = wrapperWidth - mainContentWidth - 30;
			$('#toolbar_vertical').width(sidenavWidth);
			if ($('.sidebarContent').css('float') == 'left') {
				$('#toolbar_vertical .currentListItem').width(sidenavWidth + 1);
				$('#toolbar_vertical .currentListItem .toolbarList').width(sidenavWidth);
			} else if ($('.sidebarContent').css('float') == 'right') {
				$('#toolbar_vertical .currentListItem').width(sidenavWidth + 1).css({'position':'relative','left':'-1px'});
				$('#toolbar_vertical .currentListItem .toolbarList').width(sidenavWidth).css({'position':'relative','left':'+1px'});
			}
		}
	} else if ($('.sidebarContent').css('display') == 'none') {
		$('.mainContent').outerWidth($('.contentContainer').outerWidth(true) - 29);
	}
});
