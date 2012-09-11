<section class="section">
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            SlideWH <small>by Adam Merrifield, 11 Sep 2012.</small><a href="http://seydesign.com/downloads/snippets/sdSlideWH.zip" class="btn btn-primary pull-right" style="color:white;text-transform: none;">Download</a>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/26073578" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <p>The SlideWH snippet is a complimentary snippet for use with SeydoggySlideshow 3 (or SS3) enabled themes. The sdSlideWH snippet is a method for defining externally hosted images to be used in your slide show sequence instead of the built-in images.</p>

                    <h3>Instructions</h3>

                    <ol>
                        <li><p>Download and install the <a href="http://seydesign.com/downloads/snippets/sdSlideWH.zip" title="SlideWH Snippet">SlideWH snippet</a>.</p></li>
                        <li><p>Open the Page Inspector (<code>RapidWeaver > View > Show Page Inspector</code>).</p></li>
                        <li><p>Be sure that the setting found in <code>Page Inspector > Styles > Slide show type > Off / Manual (snippet)</code> is selected.</p></li>
                        <li><p>Paste the sdSlideWH snippet into <code>Page Inspector > Header > JavaScript</code> changing each image source to suit your needs.</p>
                        <p>The snippet will look like this:</p>
                        <pre class="prettyprint linenums language-js">sdSS.slideWH = [
    "http://www.example.com/images/header3.jpg",
    "http://www.example.com/images/header5.jpg",
    "http://www.example.com/images/header1.jpg",
    "http://www.example.com/images/header9.jpg",
    "http://www.example.com/images/header15.jpg"
];</pre>
                        <p>The order of the images will coincide with the order of your slides.</p></li>
                        <li><p>To add more images to your slide show sequence:</p>
                            <ol style="list-style: lower-alpha">
                                <li><p>Add a comma to the end of the image source line that is currently last (i.e. <code>"http://www.example.com/images/header15.jpg",</code>).</p></li>
                                <li><p>Add a new line after the comma.</p></li>
                                <li><p>On the new line, add your new image source in quotations (i.e. <code>"http://www.example.com/images/header20.jpg"</code>).</p></li>
                                <li><p>Repeat <strong>a</strong> through <strong>c</strong> for each additional link.</p>
                                <p>The snippet will now look like this:</p>
                                <pre class="prettyprint linenums language-js">sdSS.slideWH = [
    "http://www.example.com/images/header3.jpg",
    "http://www.example.com/images/header5.jpg",
    "http://www.example.com/images/header1.jpg",
    "http://www.example.com/images/header9.jpg",
    "http://www.example.com/images/header15.jpg",
    "http://www.example.com/images/header20.jpg"
];</pre></li>
                            </ol>
                        </li>
                        <li><p>To remove images from your slide show sequence:</p>
                            <ol style="list-style: lower-alpha">
                                <li><p>Remove the last image source line (i.e. <code>"http://www.example.com/images/header15.jpg"</code>).</p></li>
                                <li><p>Remove the trailing comma from what is now the last image source line (i.e. <code>"http://www.example.com/images/header9.jpg"</code>)</p></li>
                                <li><p>Repeat <strong>a</strong> and <strong>b</strong> for each image you wish to remove.</p>
                                <p>The snippet will now look like this:</p>
                                <pre class="prettyprint linenums language-js">sdSS.slideWH = [
    "http://www.example.com/images/header3.jpg",
    "http://www.example.com/images/header5.jpg",
    "http://www.example.com/images/header1.jpg",
    "http://www.example.com/images/header9.jpg"
];</pre></li>
                            </ol>
                        </li>
                    </ol>
                </article>
            </div>    
        </div>
    </div>
</section>