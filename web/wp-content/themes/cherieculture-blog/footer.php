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
			<div class="footer-legal column small-12 medium-6">
				&copy;<?php echo date('Y'); ?> Cherie Chic. All Rights Reserved.
			</div>
			<div class="footer-nav column small-12 medium-6">
				<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
			</div>
			<div class="clear">&nbsp;</div>
			<div class="footer-social">
				<?php get_template_part('social-icons'); ?>
			</div>
		</div><!-- .site-info -->
	</div></footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
