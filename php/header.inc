<header id="masthead">       
    <div class="container">
        <nav class="navbar navbar-static-top">
            <div class="navbar-inner">
                <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </a>
                <h1>
                    <a class="brand" href="index.php">
                        SEY.FOSS
                        <i class="icon-beaker"></i>
                    </a>
                </h1>
                <div class="nav-collapse">
                    <ul class="nav pull-right">
                        <li class="<?php print pageState($page,"Home"); ?>">
                            <a href="?p=Home"><i class="icon-home"></i> Home</a>
                        </li>
                        <li class="<?php print pageState($page,"ExtraContent"); ?>">
                            <a href="?p=ExtraContent"><i class="icon-th-large"></i> ExtraContent</a>
                        </li>
                        <li class="<?php print pageState($page,"SS3"); ?>">
                            <a href="?p=SS3"><i class="icon-picture"></i> SS3</a>
                        </li>
                        <li class="dropdown <?php print pageState($page,"Developers"); ?>">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-cogs"></i> Developers</a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="https://github.com/seyDoggy/SeydoggySlideshow" title="SS3 on github">SeydoggySlideshow</a>
                                </li>
                                <li>
                                    <a href="https://github.com/seyDoggy/ExtraContent" title="ExtraContent on github">ExtraContent</a>
                                </li>
                                <li>
                                    <a href="https://github.com/seyDoggy/sdSmartNav" title="sdSmartNav on github">sdSmartNav</a>
                                </li>
                                <li>
                                    <a href="https://github.com/seyDoggy/sdLightboxAlbums" title="sdLightboxAlbums on github">sdLightboxAlbums</a>
                                </li>
                                <li>
                                    <a href="https://github.com/seyDoggy/RwSetGet" title="RwSetGet on github">RwSetGet</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</header>