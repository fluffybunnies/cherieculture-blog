<?php
$posts = wp_get_recent_posts(array(
	'numberposts' => 1,
));
if (isset($posts[0])): ?>

<div class="top-stories">
	<div class="top-stories-header">
		<div class="smhead-title smhead-title-topstories">Today's Top Stories</div>
		<?php get_template_part('social-icons'); ?>
	</div>
	<div class="top-stories-posts">
		<?php foreach ($posts as $post): ?>
			<div class="top-stories-post">
				<h3 class="top-stories-post-title"><?php echo htmlentities($post['post_title']); ?></h3>
				<div class="top-stories-post-timestamp"><?php echo \ace\Ace::date('M d, Y',\ace\Ace::strToTimeUTC($post['post_date_gmt'])); ?></div>
				<a class="top-stories-post-link" href="<?php echo $post['guid']; ?>">Discover Story</a>
				<a class="link-overlay" href="<?php echo $post['guid']; ?>"></a>
			</div>
			<?php
				// hack to put first post's featured image in .site-hero
				if (is_home() && $posts[0] == $post && has_post_thumbnail($post['ID'])) {
					$siteHeroImg = current(wp_get_attachment_image_src(get_post_thumbnail_id($post['ID']),'full'));
					echo "<style type=\"text/css\">.home .site-hero{background-image:url($siteHeroImg)}</style>";
				}
			?>
		<?php endforeach; ?>
	</div>
</div>

<?php endif; ?>