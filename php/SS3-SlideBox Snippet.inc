<section class="section">
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            SlideBox Snippet <small>by Adam Merrifield, 11 Sep 2012.</small><a href="http://seydesign.com/downloads/snippets/sdSlideBox.zip" class="btn btn-primary pull-right" style="color:white;text-transform: none;">Download</a>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/26595511" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <p>The SlideBox snippet is a complimentary snippet for use with SeydoggySlideshow 3 (or SS3) enabled themes. The sdSlideBox snippet is a method for creating content based slides using HTML.</p>

                    <p>Using the built-in slide show controls in your SS3 enabled theme, you can add flare to your content slide show with speed settings, delays and special effects. Or take it a step further and use the advanced tricks in the SS3 User API to link each slide to another destination.</p>

                    <h3>Instructions</h3>

                    <ol>
                        <li><p>Download and install the <a href="http://seydesign.com/downloads/snippets/sdSlideBox.zip" title="SlideBox Snippet">SlideBox snippet</a>.</p></li>
                        <li>Open the Page Inspector (<em>RapidWeaver > View > Show Page Inspector</em>).</li>
                        <li>Be sure that the setting found in <em>Page Inspector > Styles > Slide show type > Content (SlideBox stack/snippet)</em> is selected.</li>
                        <li><p>Paste the sdSlideBox snippet into any content area in RapidWeaver. It will look like this:</p><pre class="prettyprint linenums language-html">&lt;div class=&quot;sdSlideBoxSnippet&quot; id=&quot;mySdSlideBox1&quot;&gt;
    This content will appear as slide 1.&lt;br/&gt;
    Some sample content. Add whatever you like here.
&lt;/div&gt;

&lt;div class=&quot;sdSlideBoxSnippet&quot; id=&quot;mySdSlideBox2&quot;&gt;
    This content will appear as slide 2.&lt;br/&gt;
    Some sample content. Add whatever you like here.
&lt;/div&gt;

&lt;div class=&quot;sdSlideBoxSnippet&quot; id=&quot;mySdSlideBox3&quot;&gt;
    This content will appear as slide 3.&lt;br/&gt;
    Some sample content. Add whatever you like here.
&lt;/div&gt;</pre></li>
                        <li>If you've pasted the snippet into a styled-text type area then you need to select the HTML code and ignore the formatting (<em>RapidWeaver > Formatting > Ignore Formatting</em>).</li>
                        <li><p>Edit each sample text with any HTML of your liking. Each area is a unique slide. The sample text looks like this:</p><pre class="prettyprint linenums language-html">This content will appear as slide 1.&lt;br/&gt;
Some sample content. Add whatever you like here.</pre></li>
                        <li><p>To add slides, simply add a new <em>sdSlideBoxSnippet</em> wrapper and number it accordingly. For example, if I wanted to add a forth slide, I would copy the third slide and change the id from <code>mySdSlideBox3</code> to <code>mySdSlideBox4</code>. Like this:</p><pre class="prettyprint linenums language-html">&lt;div class=&quot;sdSlideBoxSnippet&quot; id=&quot;mySdSlideBox4&quot;&gt;
    This content will appear as slide 4.&lt;br/&gt;
    Some sample content. Add whatever you like here.
&lt;/div&gt;</pre></li>
                    </ol>
                </article>
            </div>    
        </div>
    </div>
</section>