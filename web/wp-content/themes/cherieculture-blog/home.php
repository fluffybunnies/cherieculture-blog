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
				<div class="home-stories-posts">
					<?php foreach ($posts as $post): ?>
						<div class="home-stories-post"><a class="nostyle" href="<?php echo $post['guid']; ?>">
							<img class="home-stories-post-image" src="/wp-content/themes/cherieculture-blog/images/SAMPLE-article-thumb-0.jpg" alt="" />
							<div class="home-stories-post-timestamp"><?php echo \ace\Ace::date('M d, Y',\ace\Ace::strToTimeUTC($post['post_date_gmt'])); ?></div>
							<h3 class="home-stories-post-title"><?php echo $post['post_title']; ?></h3>
						</a></div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php endif; ?>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
