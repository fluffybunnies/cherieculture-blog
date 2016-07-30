<?php
/**
 * Overrides index.php for homepage /
 *
 * @package cherieculture-blog
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<?php get_template_part('top-stories'); ?>


			<?php
			$posts = wp_get_recent_posts(array(
				'numberposts' => 9,
				'offset' => 1,
			));
			if (isset($posts[0])): ?>

			<div class="home-stories">
				<div class="home-stories-header">
					<div class="smhead-title smhead-title-lateststories">Latest Stories</div>
				</div>
				<div class="home-stories-posts columns">
					<?php foreach ($posts as $post): ?>
						<script>console.log("<?php echo $post['name']; ?>",<?php echo json_encode($post); ?>)</script>
						<div class="home-stories-post column small-12 medium-6 large-4"><div class="home-stories-post-inner">
							<img class="home-stories-post-image" src="/wp-content/themes/cherieculture-blog/images/blank-367x357.gif" style="background-image:url(/wp-content/themes/cherieculture-blog/images/SAMPLE-article-thumb-0.jpg)" alt="" />
							<div class="home-stories-post-timestamp"><?php echo \ace\Ace::date('M d, Y',\ace\Ace::strToTimeUTC($post['post_date_gmt'])); ?></div>
							<h3 class="home-stories-post-title"><?php echo $post['post_title']; ?></h3>
							<a class="link-overlay" href="<?php echo $post['guid']; ?>"></a>
						</div></div>
					<?php endforeach; ?>
					<div class="clear">&nbsp;</div>
				</div>
				<div class="clear">&nbsp;</div>
				<div class="home-stories-footer">
					<a class="smhead-title smhead-title-exploremorestories" href="#">Explore More Stories</a>
				</div>
			</div>

			<?php endif; ?>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
