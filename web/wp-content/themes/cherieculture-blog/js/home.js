// http://localhost:8888/wp-json/wp/v2/posts
(function(){
	ShowMoreStories = {
		config: {
			defaultOpts: {
				pagNum: 3
				,offset: 10
			}
		}
		,init: function($btn,$postToCopy,opts){
			var z = this
			if (z.inited) return;
			z.inited = true

			z.opts = $.extend({},z.config.defaultOpts,opts)
			z.$btn = $btn;
			z.$postToCopy = $postToCopy

			z.currentOffset = z.opts.offset

			z.functionalize()
		}
		,functionalize: function(){
			var z = this
				,busy = false
			z.$btn.bind('click',function(e){
				e.preventDefault()
				if (busy) return;
				busy = true
				chic.req('posts',{
					offset: z.currentOffset
					,per_page: z.opts.pagNum
				},function(err,data){
					if (err) {
						return console.error(z.config.key,err)
					}
					z.insertPosts(data)
					z.currentOffset += z.opts.pagNum
					busy = false
					if (data.length < z.opts.pagNum) {
						z.$btn.hide()
					}
				})
			})
		}
		,insertPosts: function(posts){
			var z = this
			$.each(posts,function(i,post){
				z.insertPost(post)
			})
		}
		,insertPost: function(post){
			var z = this
				,$post = z.$postToCopy.clone()
				,$timestamp,$img
			// title
			$post.find('[x-showmore-key="title"]').text(post.title&&post.title.rendered)
			// timestamp
			$timestamp = $post.find('[x-showmore-key="timestamp"]')
			$timestamp.text(chic.util.formatWpTimestamp(post.date_gmt,$timestamp.attr('x-showmore-format')))
			// link
			$post.find('[x-showmore-key="link"]').attr('href',post.link)
			// image
			$img = $post.find('[x-showmore-key="image"]')
			if ($img[0] && post.featured_media) {
				chic.req('media/'+post.featured_media,function(err,data){
					if (err) {
						return console.error('ShowMoreStories','fetch media',err)
					}
					var size = $img.attr('x-showmore-size') || 'medium_large'
						,src = data.media_details.sizes[size].source_url
					if ($img.attr('x-showmore-type') == 'background') {
						$img.css('background-image','url('+src+')')
					} else {
						$img.attr('src',src)
					}
				})
			}
			// insert
			z.$postToCopy.after($post)
			z.$postToCopy = $post
		}
	}

	$(function(){
		ShowMoreStories.init($('#show-more-posts'),$('#show-more-posts-here .home-stories-post:last'),{
			pagNum: 3
			,offset: 10
		})
	})
}())