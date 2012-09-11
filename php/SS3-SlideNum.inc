<section class="section">
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            SlideNum <small>by Adam Merrifield, 11 Sep 2012.</small><a href="http://seydesign.com/downloads/snippets/sdSlideNum.zip" class="btn btn-primary pull-right" style="color:white;text-transform: none;">Download</a>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/26026559" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <p>The SlideNum snippet is a complimentary snippet for use with SeydoggySlideshow 3 (or SS3) enabled themes. The sdSlideNum snippet is a method for defining how many slides to show and in which order, should you find the built-in slide sequences do not suit your needs.</p>

                    <h3>Instructions</h3>

                    <ol>
                        <li><p>Download and install the <a href="http://seydesign.com/downloads/snippets/sdSlideNum.zip" title="SlideNum Snippet">SlideNum snippet</a>.</p></li>
                        <li><p>Open the Page Inspector (<em>RapidWeaver > View > Show Page Inspector</em>).</p></li>
                        <li><p>Be sure that the setting found in <em>Page Inspector > Styles > Slide show type > Off / Manual (snippet)</em> is selected.</p></li>
                        <li><p>Paste this snippet into <em>Page Inspector > Header > JavaScript</em> changing each number to suit your needs.</p>
                        <p>The snippet will look like this:</p>
                        <pre class="prettyprint linenums language-js">sdSS.slideNum = [3,5,1,9,15];</pre>
                        <p>Each number corresponds to a header image (i.e. "3" is "Background image 3" from the <em>Page Inspector > Styles > Background (header/slide show)[EC 1]</em> menu). The order of the numbers will coincide with the order of your slides.</p></li>
                        <li><p>sdSlideNum is actually a simple comma separated list. Adding or removing slides in the sequence is just a matter of adding or removing numbers from the list. Just make sure that each number is separated from the next number by a comma, making sure that the last number in the list is NOT followed by a comma.</p>
                        <p>Here are just a few examples:</p>
                            <ol style=list-style:lower-alpha>
                                <li><p>A sequence that starts at header image 1 and goes through to header image 8:</p>
                                <pre class="prettyprint linenums language-js">sdSS.slideNum = [1,2,3,4,5,6,7,8];</pre>
                                </li>
                                <li><p>A sequence of header images from 20 to 16 in reverse order:</p>
                                <pre class="prettyprint linenums language-js">sdSS.slideNum = [20,19,18,17,16];</pre>
                                </li>
                                <li><p>A sequence of 7 random header image starting at 9 and ending 10:</p>
                                <pre class="prettyprint linenums language-js">sdSS.slideNum = [9,6,11,2,20,17,10];</pre>
                                </li>
                            </ol>
                        </li>
                    </ol>
                </article>
            </div>    
        </div>
    </div>
</section>