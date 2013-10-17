(function( $ ){

	var offsets = {
		top: 0,
		bottom: 10,
	}
	
	var spy = {
		
		$nav: null,
		targets: {},
		current: null,
		paused: false,
		inBounds: false,
		max: null,
		min: null,
		
		_init: function( newOffset ) {
			spy.$nav = this;
			$.extend(offsets, newOffset)
			
			spy.$nav.find("[data-spy-on]").each(function() {
				spy.targets["#"+$(this).attr("id")] = {};
			});
			
			spy._setBounds()

			return spy.$nav;
		},


		_setMinMax: function(top, bottom) {
			if (top < spy.min || spy.min == null) {
				spy.min = top;
			}
			if (bottom > spy.max || spy.max == null) {
				spy.max = bottom;
			}
		},

		_setBounds: function() {
			for (var target in spy.targets) {

				var section = $(target).data("spy-on")
				,	top     = Math.floor($(section).offset().top - offsets.top)
				,	bottom  = Math.floor(top + $(section).outerHeight() - offsets.bottom)

				spy.targets[target] = {
					top: top, 
					bottom: bottom,
				}

				spy._setMinMax(top, bottom)
			}
		},

		_scrollCheck: function(scroll) {
			if (scroll < spy.min || scroll > spy.max ) {
				spy.current && spy.exit();
				spy.current && spy.deactivate(spy.current)

			} else {
				!spy.inBounds && spy.enter();
				for (var target in spy.targets) {
					var top = spy.targets[target].top
					,	bottom = spy.targets[target].bottom

					if ( (top <= scroll) && (scroll <= bottom) && (spy.current !== target) ) {
						spy.current && spy.deactivate(spy.current)
						spy.activate(target)
					}
				}
			}
		},

		deactivate: function(link) {
			spy.$nav.trigger("ns.deactivate", $(link));
			spy.$nav.find(".active").removeClass("active");
			spy.current = null
		},
	
		activate: function(link) {
			spy.$nav.trigger("ns.activate", $(link));
			$(link).addClass("active");

			spy.current = link;
		},

		enter: function() {
			spy.inBounds = true;
			spy.$nav.trigger("ns.enter");
		},

		exit: function() {
			spy.inBounds = false;
			spy.$nav.trigger("ns.exit");
		},

		pause: function() {
			spy.paused = true;
		},

		unpause: function() {
			spy.paused = false;
			spy._scrollCheck($(window).scrollTop());	
		},
	};

	$.fn.navspy = function() {

		$(window).bind("scroll", function() {
			if (!spy.paused) {
				spy._scrollCheck($(window).scrollTop());	
			}
		});

		$(window).bind("resize", function() {
			spy._setBounds();
		});


		if ( spy[ arguments[0] ] ) {
			return spy[ arguments[0] ].call( 
				this, 
				Array.prototype.slice.call( arguments, 1 )
			);
		} else if ( typeof arguments[0] === 'object' || !arguments ) {
			return spy._init.call( this, arguments[0] );
		} else {
			$.error( 'Unknown method called' );
		}    
	};


})( jQuery );
