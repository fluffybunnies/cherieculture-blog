<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package cherieculture-blog
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php if (has_post_thumbnail()): ?>
			<div class="entry-header-image" style="background-image:url(<?php echo current(wp_get_attachment_image_src(get_post_thumbnail_id(),'full')); ?>)"></div>
		<?php endif; ?>
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php
			the_content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'cherieculture-blog' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<?php if ( get_edit_post_link() ) : ?>
		<footer class="entry-footer">
			<?php
				edit_post_link(
					sprintf(
						/* translators: %s: Name of current post */
						esc_html__( 'Edit %s', 'cherieculture-blog' ),
						the_title( '<span class="screen-reader-text">"', '"</span>', false )
					),
					'<span class="edit-link">',
					'</span>'
				);
			?>
		</footer><!-- .entry-footer -->
	<?php endif; ?>
</article><!-- #post-## -->
