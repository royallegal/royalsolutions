<div class="product-offerings panel">
    <h3 class="center-align" style="font-size: 2.5em">Popular Legal Services</h3>

    <div class="container">
        <?php
        $llcs       = get_products_by_category('llc');
        $trusts     = get_products_by_category('trust');
        $plans      = get_products_by_category('planning');
        $agreements = get_products_by_category('agreement');

        $products = array(
            "blue"   => $llcs[array_rand($llcs)],
            "brown"  => $trusts[array_rand($trusts)],
            "purple" => $plans[array_rand($plans)],
            "green"  => $agreements[array_rand($agreements)]
        );
        foreach ($products as $color=>$product) : ?>
            <a href="/product/<?php echo $product->post_name; ?>">
                <div class="product-offering circle <?php echo $color; ?>">
                    <h3>
                        <?php echo $product->post_title; ?>
                    </h3>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</div>


<?php wp_reset_query(); ?>
