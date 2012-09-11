<?php
    include("php/functions.inc");

    $page = whereAmI("Home","p");

?><!doctype html>
<html  lang="en"> 

<?php include("php/head.inc"); ?>

<body class="theme">
    
    <!-- Page Header -->
    <?php include("php/header.inc"); ?>

    
    <!-- Main Content -->
    <div id="content" role="main">

        <?php include('php/' . $page . '.inc'); ?>

    </div>
    
    <!-- Page Footer -->
    <?php include("php/footer.inc"); ?>

    <?php include("php/foot.inc"); ?>
    
</body>
</html>