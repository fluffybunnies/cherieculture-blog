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
			$showNumPosts = 9;
			$posts = wp_get_recent_posts(array(
				'numberposts' => $showNumPosts,
				'offset' => 1,
			));
			if (isset($posts[0])): ?>

			<div class="home-stories">
				<div class="home-stories-header">
					<div class="smhead-title smhead-title-lateststories">Latest Stories</div>
				</div>
				<div id="show-more-posts-here" class="home-stories-posts columns">
					<?php foreach ($posts as $post):
						$link = get_permalink($post['ID']);
						//$thumbImg = '/wp-content/themes/cherieculture-blog/images/SAMPLE-article-thumb-0.jpg';
						$thumbImg = '/wp-content/themes/cherieculture-blog/images/blank.gif';
						if (has_post_thumbnail($post['ID'])) {
							$thumbImg = current(wp_get_attachment_image_src(get_post_thumbnail_id($post['ID']),array(367,357)));
						}
					?>
						<?php //echo "<script>console.log('".$post['post_title']."',".json_encode($post).")</script>"; ?>
						<div class="home-stories-post column small-12 medium-6 large-4"><div class="home-stories-post-inner">
							<img x-showmore-key="image" x-showmore-type="background" x-showmore-size="medium_large" class="home-stories-post-image" src="/wp-content/themes/cherieculture-blog/images/blank-367x357.gif" style="background-image:url(<?php echo $thumbImg; ?>)" alt="" />
							<div x-showmore-key="timestamp" x-showmore-format="M d, Y" class="home-stories-post-timestamp"><?php echo \ace\Ace::date('M d, Y',\ace\Ace::strToTimeUTC($post['post_date_gmt'])); ?></div>
							<h3 x-showmore-key="title" class="home-stories-post-title"><?php echo htmlentities($post['post_title']); ?></h3>
							<a x-showmore-key="link" class="link-overlay" href="<?php echo $link; ?>"></a>
						</div></div>
					<?php endforeach; ?>
					<div class="clear">&nbsp;</div>
				</div>
				<div class="clear">&nbsp;</div>
				<?php if (isset($posts[$showNumPosts-1])): ?>
					<div class="home-stories-footer">
						<a id="show-more-posts" class="smhead-title smhead-title-exploremorestories" href="#">Explore More Stories</a>
					</div>
				<?php endif; ?>
			</div>

			<?php endif; ?>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
