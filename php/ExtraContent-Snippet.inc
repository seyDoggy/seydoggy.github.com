<section class="section">
    <div class="container">
        <div class="row-fluid">
            <div class="span12">
                <article class="blog-post">
                    <header class="blog-header">
                        <h2>
                            Using the ExtraContent Snippet <small>by Adam Merrifield, 6 Sep 2012.</small><a href="https://github.com/downloads/seyDoggy/ExtraContent/ExtraContent-add-ons.zip" class="btn btn-primary pull-right" style="color:white;text-transform: none;">Download</a>
                        </h2>
                    </header>
                    <div class="frame"><div class="flex-video vimeo hddisplay"><iframe src="http://player.vimeo.com/video/49024289" width="500" height="313" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>
                    <ol>
                        <li><p>Download and install the <a href="https://github.com/downloads/seyDoggy/ExtraContent/ExtraContent-add-ons.zip" title="ExtraContent Snippets and stacks">ExtraContent add-ons</a>.</p></li>
                        <li><p>Open the RapidWeaver Snippet browser ("View > Show Snippets").</p></li>
                        <li><p>Search for "ExtraContent" in the browser's search field.</p></li>
                        <li><p>Drag an appropriate snippet somewhere on your page, either in the main content or the sidebar. For Example:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent1&quot;&gt;

Add you content here and it will appear... there! Provided you are using a theme that has ExtraContent enabled of course.

Tip:
1. Check to see how many extra content area your theme supports. For each support instance, you&#039;ll need to change the trailing number in the id to suit. For example, &quot;myExtraContent1&quot;, &quot;myExtraContent2&quot;, &quot;myExtraContent3&quot;, and so on...

2. If using ExtraContent in a styled text area, be sure to highlight from &quot;&le;div id=&quot;myExtraConten...&quot; to the beginning of your own content, then mark it as &quot;Ignore Formatting&quot; (RW Menu &raquo; Format &raquo; Ignore Formatting). Repeat the process from the end of your content until the end of &quot;...#myExtraContent --&ge;&quot;

&lt;/div&gt;&lt;!-- #myExtraContent --&gt;</pre></li>
                        <li><p>Between the opening <code>&lt;div id="myExtraContent1"&gt;</code> and closing <code>&lt;/div&gt;</code>, replace everything with content of your own. For example:</p><pre class="prettyprint linenums language-html">&lt;div id=&quot;myExtraContent1&quot;&gt;Hello world!&lt;/div&gt;</pre></li>
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