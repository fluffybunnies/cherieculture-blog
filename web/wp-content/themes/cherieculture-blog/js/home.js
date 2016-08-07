// http://localhost:8888/wp-json/wp/v2/posts
(function(){
	ShowMoreStories = {
		config: {
			defaultOpts: {
				pagNum: 3
				,offset: 10
				,onNewItemsAddedToDom: null
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
				,$newPosts = $([])
			$.each(posts,function(i,post){
				$newPosts = $newPosts.add( z.insertPost(post) )
			})
			if (z.opts.onNewItemsAddedToDom)
				z.opts.onNewItemsAddedToDom($newPosts)
		}
		,insertPost: function(post){
			var z = this
				,$post = z.$postToCopy.clone()
				,$timestamp,$img
			// title
			//$post.find('[x-showmore-key="title"]').text(post.title&&post.title.rendered) // title.rendered appears to already be escaped safely
			$post.find('[x-showmore-key="title"]').html(post.title&&post.title.rendered)
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
			return $post
		}
	}

	/*
		To Do
			- Cross-device testing
			- Consider putting an invisible fake copy over the top to calculate, then resizing once
				- Could use css transitions then for a smoother/customizeable font-resize
				- Problem here is how to share the container without adding to the dom flow and without requiring knowledge of current css definitions
	*/

	DynamicFontSize.prototype.defaultOpts = {
		resizeAllToSmallest: true
		,deltaPx: 0.5
		,minPx: 8
		,sensibleMaxResizes: null
	}
	DynamicFontSize.prototype.key = 'DynamicFontSize'

	function DynamicFontSize($elms,opts){
		var z = this
		z.opts = $.extend({},z.defaultOpts,opts)
		if (typeof z.opts.sensibleMaxResizes != 'number') z.opts.sensibleMaxResizes = 100/z.opts.deltaPx // in case the DOM is not updating as expected

		z.elms = []
		$($elms).each(function(){
			z.elms.push($(this))
		})

		$(function(){
			z.domInited = true
			z.initializeElms()
			z.fixAll()
			var resizeSmartTimeout
			$(window).on('resize',function(){
				clearTimeout(resizeSmartTimeout)
				resizeSmartTimeout = setTimeout(function(){
					z.fixAll()
				},250)
			})
		})
	}

	// Use this.nextTick() instead of setTimeout(...,0) to group same-thread actions together
	DynamicFontSize.prototype.nextTickTimeout = null
	DynamicFontSize.prototype.nextTickActions = []
	DynamicFontSize.prototype.nextTick = function(cb){
		var z = this
		z.nextTickActions.push(cb)
		z.nextTickTimeout = setTimeout(function(){
			var actions = z.nextTickActions
			//console.log(z.key, 'nextTickActions', z.nextTickActions)
			z.nextTickActions = []
			$.each(actions,function(i,action){
				action()
			})
		},0)
	}
	DynamicFontSize.prototype.resetNexTick = function(){
		this.nextTickActions = []
		clearTimeout(this.nextTickTimeout)
	}

	DynamicFontSize.prototype.initializeElms = function(){
		var z = this
		$.each(z.elms,function(i,$elm){
			$elm.maxFontSize = $elm.css('font-size')
			if ($elm.maxFontSize.indexOf('px') == -1)
				console.warn(z.key, 'styled font-size is not in px, may have issues', '@todo: should probly just exit here')
		})
	}

	DynamicFontSize.prototype.addItems = function($elms){
		var z = this
		$($elms).each(function(){
			z.elms.push($(this))
		})
		if (z.domInited) {
			z.stopAndResetAll()
			z.initializeElms()
			z.fixAll()
		}
	}

	DynamicFontSize.prototype.fixAll = function(){
		var z = this
			,smallestFontSize

		z.stopAndResetAll()

		$.each(z.elms,function(i,$elm){
			// DOM needs time to render
			var n = 0, finalFontSize;
			(function fixOnce(){
				z.nextTick(function(){
					if (++n == z.opts.sensibleMaxResizes) return finishedFixingElm($elm,finalFontSize);
					var res = z.fix($elm)
					if (res) {
						finalFontSize = res
						fixOnce()
					} else {
						finishedFixingElm($elm,finalFontSize)
					}
				});
			}())
		})

		var numElmsFinished = 0
		function finishedFixingElm($elm,finalFontSize){
			if (finalFontSize && (!smallestFontSize || finalFontSize < smallestFontSize[1])) {
				smallestFontSize = [$elm,finalFontSize]
			}
			if (++numElmsFinished == z.elms.length) {
				//console.log(z.key, 'finished fixing all', 'smallestFontSize=', smallestFontSize)
				if (z.opts.resizeAllToSmallest && smallestFontSize) {
					$.each(z.elms,function(i,$elm){
						$elm.css('font-size',smallestFontSize[1]+'px')
					})
				}
			}
		}
	}

	DynamicFontSize.prototype.stopAndResetAll = function(){
		var z = this
		z.resetNexTick()
		$.each(z.elms,function(i,$elm){
			$elm.lastFontSize = null
			$elm.css('font-size',$elm.maxFontSize)
		})
	}

	DynamicFontSize.prototype.fix = function($elm){
		// truthy return value means keep going
		var z = this
			,fullHeight = $elm[0].scrollHeight
			,trueHeight = $elm.height() + (parseFloat($elm.css('padding-top'))||0) + (parseFloat($elm.css('padding-bottom'))||0) // omitting border for, not relevant here. and havent even tested to see if scrollHeight includes border xbrowser
		//console.log(z.key, fullHeight+' <= '+(trueHeight+1), fullHeight <= trueHeight+1)
		if (fullHeight <= trueHeight+1) {
			return 0;
		}
		var currentFontSize = parseFloat($elm.css('font-size'))
			,nextFontSize = currentFontSize - z.opts.deltaPx
		if (isNaN(currentFontSize)) {
			return console.warn(z.key, 'unable to parse currentFontSize');
		}
		if (nextFontSize < z.opts.minPx) {
			return console.log(z.key, 'currentFontSize reached its minimum value');
		}
		if (currentFontSize == $elm.lastFontSize) {
			return console.warn(z.key, 'currentFontSize == lastFontSize', 'DOM is not updating fast enough, or some other problem');
		}
		$elm.lastFontSize = currentFontSize
		$elm.css('font-size', nextFontSize+'px')
		//console.log(z.key, currentFontSize+'->'+nextFontSize)
		return nextFontSize;
	}


	$(function(){
		var homeStoriesDynamicFontSizer = new DynamicFontSize($('#main .home-stories-post-title'),{
			resizeAllToSmallest: true
		})

		ShowMoreStories.init($('#show-more-posts'),$('#show-more-posts-here .home-stories-post:last'),{
			pagNum: 3
			,offset: 10
			,onNewItemsAddedToDom: function($newItems){
				homeStoriesDynamicFontSizer.addItems($newItems.find('.home-stories-post-title'))
			}
		})

	})
}())