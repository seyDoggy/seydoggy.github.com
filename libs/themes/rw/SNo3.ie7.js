jQuery(document).ready(function($) {
	// styles for sidebar
	if ($('.sidebarContent').css('float') == 'left' || $('.sidebarContent').css('float') == 'right') {
		if ($('#toolbar_vertical ul').length) {
			$('#toolbar_vertical').css({'position':'relative','top':'1px'});
			if ($('.sidebarContent').css('float') == 'right') {
				$('#toolbar_vertical').css('left','-1.7em');	
			}
		}
	} else if ($('.sidebarContent').css('display') == 'none') {
		$('.mainContent').width($('.contentContainer').width() - 29);
	}
});
