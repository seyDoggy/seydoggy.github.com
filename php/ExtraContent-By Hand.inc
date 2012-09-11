<section class="section">
    <div class="container">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            Using ExtraContent By Hand <small>by Adam Merrifield, 6 Sep 2012.</small>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/49021119" width="500" height="313" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <ol>
                        <li><p>Somewhere on your page, either in the main content or the sidebar, add the following:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent1&quot;&gt;&lt;!-- your content here --&gt;&lt;/div&gt;</pre></li>
                        <li><p>Between the opening <code>&lt;div id="myExtraContent1"&gt;</code> and closing <code>&lt;/div&gt;</code>, replace <code>&lt;!-- your content here --&gt;</code> with content of your own. For example:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent1&quot;&gt;Hello world!&lt;/div&gt;</pre></li>
                        <li><p>To change which area your content is displayed in, simple change the number at the end of the id to one that corresponds with the desired area in your theme. For example:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent2&quot;&gt;Hello world!&lt;/div&gt;</pre></li>
                        <li><p>Depending on your theme, your ExtraContent may now automatically appear, or there might be an option to turn the ExtraContent on or off.</p></li>
                        <li><p>To add more content to more areas, simply repeat the process, using numbers that correspond to those in your theme. For example:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent1&quot;&gt;Hello world!&lt;/div&gt;
&lt;div id=&quot;myExtraContent2&quot;&gt;Question: What did foo say when he walked into a bar?&lt;/div&gt;
&lt;div id=&quot;myExtraContent3&quot;&gt;Answer: "Ouch!"&lt;/div&gt;</pre></li>
                        <li><p>You can add ExtraContent tags around just about anything. Say for instance you wanted to embed a video above your main content with this embed code:</p><pre class="prettyprint linenums language-html">&lt;iframe src=&quot;http://player.vimeo.com/video/46506843&quot; width=&quot;500&quot; height=&quot;313&quot; frameborder=&quot;0&quot; webkitAllowFullScreen mozallowfullscreen allowFullScreen&gt;&lt;/iframe&gt;</pre><p>Then all you need to do is add <code>&lt;div id="myExtraContent1"&gt;</code> in front and <code>&lt;/div&gt;</code> at the end, like this:</p><pre class="prettyprint linenums language-html">&lt;div id="myExtraContent2"&gt;&lt;iframe src=&quot;http://player.vimeo.com/video/46506843&quot; width=&quot;500&quot; height=&quot;313&quot; frameborder=&quot;0&quot; webkitAllowFullScreen mozallowfullscreen allowFullScreen&gt;&lt;/iframe&gt;&lt;/div&gt;</pre></li>
                        <li>If using ExtraContent with HTML code in a styled-text type area, be sure to use the option "Format > Ignore Formatting" if your code breaks out over several lines. Otherwise your formatting might have excessive spacing or have awkward steps.</li>
                    </ol>
                </article>

            </div>    
        </div>
    </div>
</section>