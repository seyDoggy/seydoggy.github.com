#!/bin/bash
set -e

#############
# VARIABLES #
#############

BUILDDATE=`date "+%B %e, %Y"`
BUILDNUM=`date "+%y%m%d%H%M%S"`	


#############
# GET CYCLE #
#############

# get cycle
curl https://raw.github.com/malsup/cycle/master/jquery.cycle.all.js > pull-cycle.js

# compress it
jsmin <pull-cycle.js >pull-cycle.min.js
java com.yahoo.platform.yui.compressor.Bootstrap --type js -o pull-cycle.min.js pull-cycle.min.js


####################
# GET COMMON FILES #
####################

# get RwSetGet
cat ~/github/RwSetGet/rwget.js > pull-common.js && echo -e "\n" >> pull-common.js
# get rwAddLinks
cat ~/github/rwAddLinks/rwaddlinks.jquery.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get sdSetHeight
cat ~/github/sdSetHeight/jquery.sdsetheight.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get SeydoggySlideshow
cat ~/github/SeydoggySlideshow/SS3/seydoggy.slideshow.light.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get sdSmartNav
cat ~/github/sdSmartNav/jquery.sdsmartnav.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get sdVertAlign
cat ~/github/sdVertAlign/jquery.sdvertalign.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get sdLightboxAlbums
cat ~/github/sdLightboxAlbums/jquery.sdlightboxalbums.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get sdAlbumStyle
cat ~/github/sdLightboxAlbums/jquery.sdalbumstyle.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get IEgradius
cat ~/github/IE9Gradius/jquery.ie9gradius.js >> pull-common.js && echo -e "\n" >> pull-common.js
# get Frehmwerk
cat ~/github/seydoggy.github.com/libs/themes/rw/frehmwerk.js >> pull-common.js && echo -e "\n" >> pull-common.js


# compress pull-common.js
jsmin <pull-common.js >pull-common.min.js
java com.yahoo.platform.yui.compressor.Bootstrap --type js -o pull-common.min.js pull-common.min.js


##################################
# COMBINE CYCLE and COMMON FILES #
##################################

echo -e "\n\n/*\n\tjQuery Cycle Plugin\n\thttp://jquery.malsup.com/license.html\n*/\n" > pull.js
cat pull-cycle.min.js >> pull.js


echo -e "\n\n/*\n\tseyDoggy RapidWeaver Common\n\t(c) 2012 Adam Merrifield\n\thttps://github.com/seyDoggy/\n*/\n" >> pull.js
cat pull-common.min.js >> pull.js


#######################
# BUILD COMMON.MIN.JS #
#######################

# write build date to common.min.js
echo -e "/*\n\tConsolidated common scripts for seydesign/frehmwerk themes\n\t\n\tIncludes jQuery, Cycle and seyDoggy RapidWeaver Common scripts\n\tBuilt on $BUILDDATE (build No. $BUILDNUM)\n*/\n" > common.min.js

# add jQuery test to common.min.js
echo -e "// if jQuery is present\nwindow.jQuery || \n// else write jQuery" >> common.min.js

# get jQuery
curl https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js >> common.min.js

# add contents of pull.js to common.min.js
cat pull.js >> common.min.js

###########
# CLEANUP #
###########

# remove pull*.js
rm -rf pull*.js


###########
# PUBLISH #
###########

# commit and push changes
git commit common.min.js -m "[build] common.min.js: new build of common scripts. (build No. $BUILDNUM)" && git push origin master

# put common.min.js on s3
s3cmd put common.min.js s3://seydesign/rw/ -m application/javascript -P --add-header=Cache-Control:max-age=0

exit 0