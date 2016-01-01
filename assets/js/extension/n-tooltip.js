(function($, window) {

	var nTooltip = {
		_options: {
			height: 22,
			arrSize: 8,
			padding: 5,
			animateSpeed: 120
		},
		_vars: {
			title: null,
			placement: null,
			padding: null,
			$elm: null,
			$tooltip: null
		},

		show: function() {
			nTooltip._vars.title        = $(this).attr('n-tooltip');
			nTooltip._vars.placement    = $(this).attr('n-tooltip-placement');
			nTooltip._vars.padding      = $(this).attr('n-tooltip-padding');

			if (nTooltip._vars.padding) {
				nTooltip._options.padding = +nTooltip._vars.padding;
			}

			if (!nTooltip._vars.title) {
				return;
			}

			nTooltip._vars.$elm         = $(this);
			nTooltip._vars.$tooltip     = $('<div class="n-tooltip">' + nTooltip._vars.title + '</div>').appendTo($('body'));
			nTooltip._vars.$tooltip.addClass('n-tooltip_' + nTooltip._vars.placement);

			nTooltip.setPosition();
		},

		hide: function() {
			if (nTooltip._vars.$tooltip) {
				nTooltip._vars.$tooltip.remove();
			}
		},

		hideAll: function() {
			$('.n-tooltip').remove();
		},

		redraw: function() {
			nTooltip.setPosition();
		},

		setPosition: function() {
			if (!nTooltip._vars.$elm) {
				return;
			}

			var elmBounds, windowWidth, windowHeight, tooltipWidth, tooltipHeight, titleOffsetElm;
			var cssOptions = {};

			elmBounds       = nTooltip._vars.$elm[0].getBoundingClientRect();
			tooltipWidth    = nTooltip._vars.$tooltip.outerWidth(true);
			tooltipHeight   = nTooltip._vars.$tooltip.outerHeight(true);
			windowWidth     = $(window).width();
			windowHeight    = $(window).height();

			if (nTooltip._vars.placement == 'left' || nTooltip._vars.placement == 'right') {
				titleOffsetElm = (tooltipHeight - elmBounds.height) / 2;
				
				if (titleOffsetElm > elmBounds.top) {
					cssOptions.top = nTooltip._options.padding;
				} else if (windowHeight - elmBounds.bottom < titleOffsetElm) {
					cssOptions.bottom = nTooltip._options.padding;
				} else {
					cssOptions.top = elmBounds.top + (elmBounds.height - tooltipHeight) / 2;
				}
			} else {
				titleOffsetElm = (tooltipWidth - elmBounds.width) / 2;

				if (titleOffsetElm > elmBounds.left) {
					cssOptions.left = nTooltip._options.padding;
				} else if (windowWidth - elmBounds.right < titleOffsetElm) {
					cssOptions.right = nTooltip._options.padding;
				} else {
					cssOptions.left = elmBounds.left + (elmBounds.width - tooltipWidth) / 2;
				}
			}

			if (nTooltip._vars.placement == 'top') {
				cssOptions.top = elmBounds.top - tooltipHeight - nTooltip._options.padding - nTooltip._options.arrSize / 2;
			} else if (nTooltip._vars.placement == 'right') {
				cssOptions.left = elmBounds.left + elmBounds.width + nTooltip._options.padding + nTooltip._options.arrSize / 2;
			} else if (nTooltip._vars.placement == 'bottom') {
				cssOptions.bottom = elmBounds.top + elmBounds.height + nTooltip._options.padding + nTooltip._options.arrSize / 2;
			} else if (nTooltip._vars.placement == 'left') {
				cssOptions.left = elmBounds.left - tooltipWidth - nTooltip._options.padding - nTooltip._options.arrSize / 2;
			}

			nTooltip._vars.$tooltip.removeAttr('style').css(cssOptions);
			nTooltip._vars.$tooltip.animate({opacity: 1}, nTooltip._options.animateSpeed, 'linear');
		}
	};

	$(document).on('mouseenter', '[n-tooltip]', function() {
		nTooltip.show.bind(this)();
	});

	$(document).on('mouseleave', '[n-tooltip]', function() {
		nTooltip.hideAll();
	});

	$(window).on('resize', nTooltip.redraw);

	window.nTooltip = nTooltip;

})(jQuery, window);
