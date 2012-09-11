<section class="section">
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            SlideLinks <small>by Adam Merrifield, 11 Sep 2012.</small><a href="http://seydesign.com/downloads/snippets/sdSlideLinks.zip" class="btn btn-primary pull-right" style="color:white;text-transform: none;">Download</a>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/26067703" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <p>The SlideLinks is a complimentary snippet for use with SeydoggySlideshow 3 (or SS3) enabled themes. The sdSlideLinks snippet is a method for defining unique URL's for each slide in an SS3 slide show, whether they are the default internal image slides, externally hosted image slides or content based SlideBox slides.</p>

                    <h3>Instructions</h3>

                    <ol>
                        <li><p>Download and install the <a href="http://seydesign.com/downloads/snippets/sdSlideLinks.zip" title="SlideLinks Snippet">SlideLinks snippet</a>.</p></li>
                        <li><p>Open the Page Inspector (<em>RapidWeaver > View > Show Page Inspector</em>).</p></li>
                        <li><p>Once you've set up the slide show with the desired settings, paste this snippet into <em>Page Inspector > Header > JavaScript</em> changing each URL to suit your needs.</p>
                        <p>The snippet will look like this:</p><pre class="prettyprint linenums language-js">sdSS.slideLinks = [
    "http://www.google.com",
    "http://www.tumblr.com",
    "http://www.twitter.com",
    "http://www.flickr.com",
    "http://www.facebook.com"
];</pre>
                        <p>The order of the links will coincide with the order of your slides.</p></li>
                        <li><p>Be sure that the number of links used matches the number of slides in your slide show. To add links to the end of your sequence:</p>
                            <ol style="list-style: lower-alpha">
                                <li>Add a comma to the end of the URL line that is currently last (i.e. <code>"http://www.facebook.com",</code>).</li>
                                <li>Add a new line after the comma.</li>
                                <li>On the new line, add your new URL in quotations (i.e. <code>"http://seydesign.com"</code>).</li>
                                <li><p>Repeat <strong>a</strong> through <strong>c</strong> for each additional link.</p>
                                <p>The snippet will now look like this:</p><pre class="prettyprint linenums language-js">sdSS.slideLinks = [
    "http://www.google.com",
    "http://www.tumblr.com",
    "http://www.twitter.com",
    "http://www.flickr.com",
    "http://www.facebook.com",
    "http://seydesign.com"
];</pre></li>
                            </ol>
                        </li>
                        <li><p>To remove links from the end of your sequence:</p>
                            <ol style="list-style: lower-alpha">
                                <li>Remove the last URL line (i.e. <code>"http://www.facebook.com"</code>).</li>
                                <li>Remove the trailing comma from what is now the last URL line (i.e. <code>"http://www.flickr.com"</code>)</li>
                                <li><p>Repeat <strong>a</strong> and <strong>b</strong> for each link you wish to remove.</p>
                                <p>The snippet will now look like this:</p><pre class="prettyprint linenums language-js">sdSS.slideLinks = [
    "http://www.google.com",
    "http://www.tumblr.com",
    "http://www.twitter.com",
    "http://www.flickr.com"
];</pre></div></li>
                            </ol>
                        </li>
                    </ol>
                </article>
            </div>    
        </div>
    </div>
</section>