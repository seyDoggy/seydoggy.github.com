<?php 
# FUNCTIONS

/* 
	whereAmI
	- function to test and set
		variables based on $_GET[]
*/
function whereAmI($default,$get)
{
    $detect = $default;
    if ($_GET[$get]) $detect = $_GET[$get];
    return $detect;
}

/*
	pageState
	- function to set page state
		based on current page

*/
function pageState($thisPage,$thisLink)
{
    $pageState = "normal";
    if ($thisPage === $thisLink) {
        $pageState = "active";
    }
    return $pageState;
}
?>