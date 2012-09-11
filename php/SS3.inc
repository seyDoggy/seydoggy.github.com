<?php $section = whereAmI("Basic Usage","s"); ?>
<section id="promo" class="section alt">
    <div class="container">
        <div class="row-fluid">
            <div class="span7">
                <div class="hero-unit">
                    <h1>SS3: The built-in, "anything" slider.</h1>
                    <p>In 2011 we launched the third iteration of an integrated slide show that we'd been putting in seyDesign RapidWeaver<sup>&reg;</sup> themes since 2010. This third version, dubbed SS3, was also the first time we'd opened up the source for all developers to use in their own themes.</p>
                    <p>SS3 allows users to turn just about anything into a slide show. From built-in images, remote images, content, stacks and more!</p>
                </div>
            </div>
            <div class="span5 pull-right">
                <img src="img/assets/ss3_icon.png" alt="SS3 icon">
            </div>
        </div>
    </div>
</section>

<section id="section" class="section">
    <div class="container">
        <div class="row-fluid">
            <div class="span12">
                <ul class="nav nav-tabs">
                    <li class="<?php print pageState($section,"Basic Usage"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=Basic Usage#section">Basic Usage</a>
                    </li>
                    <li class="<?php print pageState($section,"SlideBox Stack"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=SlideBox Stack#section">SlideBox Stack</a>
                    </li>
                    <li class="<?php print pageState($section,"SlideBox Snippet"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=SlideBox Snippet#section">SlideBox Snippet</a>
                    </li>
                    <li class="<?php print pageState($section,"SlideLinks"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=SlideLinks#section">SlideLinks</a>
                    </li>
                    <li class="<?php print pageState($section,"SlideNum"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=SlideNum#section">SlideNum</a>
                    </li>
                    <li class="<?php print pageState($section,"SlideWH"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=SlideWH#section">SlideWH</a>
                    </li>
                </ul>
                <?php include('php/' . $page . '-' . $section . '.inc'); ?>
            </div>
        </div>
    </div>
</section>