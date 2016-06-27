$.fn.hexToRGB = function(hex)  {
    // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

$.fn.simpleColorPicker = function(options) {
	var defaults = {
		colorsPerLine: 8,
		colors: ['#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff'
				, '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
				, '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'
				, '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'
				, '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'
				, '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'
				, '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'
				, '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4C1130'],
		showEffect: '',
		hideEffect: '',
		onChangeColor: false,
		includeMargins:true,
        opacity: .6
	};

	var opts = $.extend(defaults, options);

	return this.each(function() {
		var txt = $(this);

		var colorsMarkup = '';

		var prefix = txt.attr('id').replace(/-/g, '') + '_';

		for(var i = 0; i < opts.colors.length; i++){
			var item = opts.colors[i];

			var breakLine = '';
			if (i % opts.colorsPerLine == 0)
				breakLine = 'clear: both; ';

			if (i > 0 && breakLine && $.browser && $.browser.msie && $.browser.version <= 7) {
				breakLine = '';
				colorsMarkup += '<li style="float: none; clear: both; overflow: hidden; background-color: #fff; display: block; height: 1px; line-height: 1px; font-size: 1px; margin-bottom: -2px;"></li>';
			}

        if (opts.opacity) {
                var rgb = $.fn.hexToRGB(item);
                colorsMarkup += '<li id="' + prefix + 'color-' + i + '" class="color-box" style="' + breakLine + 'background: ' + item + '; background:rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opts.opacity + ');" title="' + item + '"></li>';
            } else {
                colorsMarkup += '<li id="' + prefix + 'color-' + i + '" class="color-box" style="' + breakLine + 'background: ' + item + '" title="' + item + '"></li>';
            }
		}

		var box = $('<div id="' + prefix + 'color-picker" class="color-picker" style="position: absolute; left: 0px; top: 0px; width:auto;"><ul>' + colorsMarkup + '</ul><div style="clear: both;"></div></div>');
		$('body').append(box);
		box.hide();

		box.find('li.color-box').click(function() {
			if (txt.is('input')) {
				txt.val(opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
				txt.blur();
			}
			if ($.isFunction(defaults.onChangeColor)) {
				defaults.onChangeColor.call(txt, opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
			}
			hideBox(box);
		});


		$('body').on('mousedown', function(e) {
            if (!box.is(e.target) && !box.has(e.target).length) {
                hideBox(box);
            }
		});


		box.click(function(event) {
			event.stopPropagation();
		});

		var positionAndShowBox = function(box) {
			var pos = txt.offset();
			var left = pos.left + txt.outerWidth(opts.includeMargins) - box.outerWidth(opts.includeMargins);
			if (left < pos.left) left = pos.left;
			box.css({ left: left, top: (pos.top + txt.outerHeight(opts.includeMargins)) });
			showBox(box);
		}

		txt.click(function(event) {
			event.stopPropagation();
			if (!txt.is('input')) {
				// element is not an input so probably a link or div which requires the color box to be shown
				positionAndShowBox(box);
			}
		});

		txt.focus(function() {
			positionAndShowBox(box);
		});

		function hideBox(box) {
			if (opts.hideEffect == 'fade')
				box.fadeOut();
			else if (opts.hideEffect == 'slide')
				box.slideUp();
			else
				box.hide();
		}

		function showBox(box) {
			if (opts.showEffect == 'fade')
				box.fadeIn();
			else if (opts.showEffect == 'slide')
				box.slideDown();
			else
				box.show();
		}
	});
};
