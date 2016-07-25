<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cherieculture-blog
 */

?>

	</div></div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo"><div class="page-content-wrap">
		<div class="site-info">
			&copy;<?php echo date('Y'); ?> Cherie Chic. All Rights Reserved.
			<br />
			<?php get_template_part('social-icons'); ?>
		</div><!-- .site-info -->
	</div></footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
