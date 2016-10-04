/**
 * ajaxFlow is a jQuery plugin that limits HTTP requests. It waits for a response from the server before sending an additional request. It is especially useful for search inputs and other text inputs in which an AJAX call is made for each user keystroke.
 *
 * @package ajaxFlow
 * @copyright Copyright (c) 2016 Ryan Whitman (https://www.ryanwhitman.com)
 * @license https://opensource.org/licenses/MIT MIT
 * @version 1.0.0
 * @link https://github.com/RyanWhitman/ajaxflow
 * @since 1.0.0
 */

var AjaxFlow = function(selector, settings, input_types) {

	var
		obj = function(settings) {

			var
				the_settings = {
					method: 'get',
					url: '',
					data: {},
					min_length: 3,
					request_key: 'q',
					callback: function() {}
				},
				previous_q =  '',
				is_holding = false,
				pending_data;

			this.request = function(data) {

				var instance = this;

				if (!is_holding) {

					is_holding = true;
					pending_data = null;

					jQuery.ajax(the_settings.url, {
						method: the_settings.method,
						data: data,
						complete: function(jqXHR, textStatus) {
							the_settings.callback(jqXHR, textStatus);
							is_holding = false;

							if (pending_data)
								instance.request(pending_data);
						}
					});
				} else
					pending_data = data;
			}

			this.input = function(val) {

				if (val.length >= the_settings.min_length && val != previous_q) {

					var data = the_settings.data;
					data[the_settings.request_key] = val;

					previous_q = val;

					this.request(data);
				}
			}

			this.settings = function(settings) {

				if (typeof settings === 'object')
					the_settings = jQuery.extend({}, the_settings, settings);
			}

			this.settings(settings);
		},
		input_types = typeof input_types === 'string' ? input_types : 'keyup input';

	if (typeof selector === 'string') {

		var
			settings = typeof settings === 'object' ? settings : {},
			ajaxFlow = new obj(settings);

		jQuery(selector).on(input_types, function() {
			ajaxFlow.input(jQuery(this).val());
		});
	} else {

		var
			settings = typeof selector === 'object' ? selector : {},
			ajaxFlow = new obj(settings);
	}

	return ajaxFlow;
}