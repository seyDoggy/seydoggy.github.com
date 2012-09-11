<?php $section = whereAmI("Stack","s"); ?>
<section id="promo" class="section alt">
    <div class="container">
        <div class="row-fluid">
            <div class="span7">
                <div class="hero-unit">
                    <h1>ExtraContent: When you have more to say.</h1>
                    <p>ExtraContent is a nearly ubiquitous technology found in most modern RapidWeaver<sup>&reg;</sup> themes today. Since it was first introduced in 2008, ExtraContent has been one of the most sought after, most requested features of all time.</p>
                    <p>ExtraContent allows users to take their RapidWever<sup>&reg;</sup> site beyond the usual sidebar/content layout and add content in places otherwise out of reach for RapidWever<sup>&reg;</sup>.</p>
                </div>
            </div>
            <div class="span5 pull-right">
                <img src="img/assets/ec_icon.png" alt="ExtraContent icon">
            </div>
        </div>
    </div>
</section>

<section id="section" class="section">
    <div class="container">
        <div class="row-fluid">
            <div class="span12">
                <ul class="nav nav-tabs">
                    <li class="<?php print pageState($section,"Stack"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=Stack#section">Stack</a>
                    </li>
                    <li class="<?php print pageState($section,"Snippet"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=Snippet#section">Snippet</a>
                    </li>
                    <li class="<?php print pageState($section,"By Hand"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=By Hand#section">By Hand</a>
                    </li>
                    <li class="<?php print pageState($section,"History"); ?>">
                        <a href="?p=<?php echo $page; ?>&s=History#section">History</a>
                    </li>
                </ul>
                <?php include('php/' . $page . '-' . $section . '.inc'); ?>
            </div>
        </div>
    </div>
</section>