<?php
get_header();
?>

<main id="home">

    <!-- WordPress Home Page Content -->
    <div class="hero-container valign-wrapper center-align">
        <div class="hero" style="background-image:url(/wp-content/uploads/2017/04/tiny-hero.png);"></div>
        <div class="blue mask"></div>
        <div class="caption center-align light">
            <h1>Asset Protection <br>for Real Estate Investors</h1>
            <h2>Professional Legal Solutions, Business Restructuring, Estate Planning, Retirement Investing & More</h2>
        </div>

        <div class="button-group">
            <a class="white to-blue ghost button modal-trigger" href="#hero-video">
                How it Works
            </a>
            <a class="orange button" href="/contact-us/">
                Get a Consultation
            </a>
        </div>

        <div id="hero-video" class="modal video">
            <div class="modal-content">
                <iframe id="player" src="https://www.youtube.com/embed/XBN-C_4GznM?enablejsapi=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </div>


    <!-- Product Offerings -->
    <?php get_template_part('snippets/promotions/product-offerings'); ?>


    <!-- Introduction -->
    <div class="container row rls-introduction">
        <div class="col s12">
            <h2 class="center-align">Why Real Estate Investors<br>Need Professional Asset Protection?</h2>

            <p>Did you know <a href="/series-llc-anonymous-trusts/" target="_blank">one in four Americans will be sued in their lifetimes</a>? Real estate investors are targeted even more frequently. If you get sued, the only question that matters is whether your assets are legally protected.</p>
            <p>Asset protection is like fire insurance, only instead of saving you from fire damage it prevents lawsuits from wiping out your assets. Proper asset protection provides full coverage, from before a lawsuit occurs to after a judgment is made.</p>
            <blockquote>A good asset protection plan for investors can prevent legal disasters from happening before they begin</blockquote>
            <p>Defending yourself from a lawsuit can cost thousands of dollars in legal fees alone. An asset protection plan from Royal Legal Solutions is cheaper than a single lawsuit and will scale with your investment business for years to come.</p>
            <p><a href="lawsuits-destroy-life/" target="_blank">Don't let a lawsuit destroy everything you've worked so hard to accomplish</a>. Get an asset protection plan for investors and enjoy end-to-end asset protection, tax savings, and more.</p>
            <div class="buttons">
                <a class="blue to-blue ghost button modal-trigger" href="/faq">
                    Learn More About Asset Protection
                </a>
                <a class="orange button" href="/cart">
                    Get a Consultation
                </a>
            </div>
        </div>
    </div>
</main>


<?php get_footer(); ?>
