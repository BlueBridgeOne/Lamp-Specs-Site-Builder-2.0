/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.Confirmation
define(
	'OrderWizard.Module.Confirmation', [
		'SC.Configuration', 'Wizard.Module', 'Tracker'

		, 'order_wizard_confirmation_module.tpl'

		, 'Backbone', 'underscore', 'jQuery', 'Utils'
	],
	function (
		Configuration, WizardModule, Tracker

		, order_wizard_confirmation_module_tpl

		, Backbone, _, jQuery, Utils
	) {
		'use strict';

		// @class OrderWizard.Module.Confirmation @extends Wizard.Module
		return WizardModule.extend({

			template: order_wizard_confirmation_module_tpl

				,
			className: 'OrderWizard.Module.Confirmation'

				,
			render: function () {
					var confirmation = this.model.get('confirmation')
						// store current order id in the hash so it is available even when the checkout process ends.
						,
						new_hash;
						console.log("render confirmation "+Backbone.history.fragment);
						console.log(confirmation);
					if (!_.parseUrlOptions(Backbone.history.fragment).last_order_id) {
						this.trackTransaction(confirmation);

						new_hash = Utils.addParamsToUrl(Backbone.history.fragment, {
							last_order_id: confirmation.get('internalid')
						});

						Backbone.history.navigate(new_hash, {
							trigger: false
						});
					}

					this.confirmation_number = confirmation.get('tranid') || confirmation.get('confirmationnumber');
					this.order_id = confirmation.get('internalid');

					this._render();

					if (!(this.model.get('confirmation') && this.model.get('confirmation').get('internalid'))) {
						this.$el.html('<h3>' + _('Your Order has been placed').translate() + '</h3>');
						this.$el.append('<p>' + _('Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ').translate() + '</p>');
					}

				}

				//@method trackTransaction Convert the LiveOrder.Model into Track.Transaction.Model until we unified it with the Transaction.Model
				,
			trackTransaction: function (confirmation) {
				console.log("trackTransaction");
					var summary = confirmation.get('summary'),
						transaction = {
							confirmationNumber: confirmation.get('tranid'),
							subTotal: summary.subtotal,
							total: summary.total,
							taxTotal: summary.taxtotal,
							shippingCost: summary.shippingcost,
							handlingCost: summary.handlingcost,
							products: new Backbone.Collection()
						},
						transactionModel = new Backbone.Model(transaction);

					confirmation.get('lines').each(function (line) {
						var item = line.get('item'),
							sku = item.get('itemDisplay'),
							name = item.get('itemDisplay'),
							option = '';

						if (item.get('itemDisplay').indexOf(':') !== -1) {
							sku = jQuery.trim(item.get('itemDisplay').split(':')[1]);
							name = jQuery.trim(item.get('itemDisplay').split(':')[0]);
						}

						if (line.get('options')) {
							var options = line.get('options').split(String.fromCharCode(4));

							option = _.map(options, function (singleOption) {
								var opt = singleOption.split(String.fromCharCode(3));
								return opt[opt.length - 1];
							}).sort().join(', ');
						}

						transactionModel.get('products').add(new Backbone.Model({
							sku: sku,
							name: name,
							category: item.get('category'),
							rate: line.get('rate'),
							quantity: line.get('quantity'),
							options: option
						}));
					});

					Tracker.getInstance().trackTransaction(transactionModel);
					
					
					try {
						console.log("Track transaction Confirmation");
						console.log(ga);
						console.log(summary);
						// gtag('event', 'conversion', {
						// 	'send_to': 'AW-1070196922/Z0PrCKaqqHsQutGn_gM',
						// 	'value': summary.subtotal.toString(),
						// 	'currency': 'GBP',
						// 	'transaction_id': confirmation.get('tranid')
						// });

						ga('ecommerce:addTransaction', {
							'id': confirmation.get('tranid'),                     // Transaction ID. Required.
							'affiliation': 'Lamp Specs',   // Affiliation or store name.
							'revenue': summary.subtotal.toString()                // Tax.
						  });
						ga('ecommerce:send');

					} catch (err) {
						console.log(err);
					}
				}

				// @method getContext @return OrderWizard.Module.Confirmation.Context
				,
			getContext: function () {
				var continue_url = '/',
					touchpoint = true;

				if (Configuration.get('siteSettings.iswsdk') && Configuration.get('siteSettings.wsdkcancelcarturl')) {
					continue_url = Configuration.get('siteSettings.wsdkcancelcarturl');
					touchpoint = false;
				}

				// @class OrderWizard.Module.Confirmation.Context
				return {
					// @property {String} continueURL
					continueURL: continue_url
						// @property {Boolean} isGuestAndCustomerCenter
						,
					isGuestAndCustomerCenter: !!(this.wizard.profileModel.get('isGuest') === 'F' && Configuration.get('siteSettings.touchpoints.customercenter'))
						// @property {String} additionalConfirmationMessage
						,
					additionalConfirmationMessage: this.options.additional_confirmation_message
						// @property {Boolean} touchPoint
						,
					touchPoint: touchpoint
						// @property {String} confirmationNumber
						,
					confirmationNumber: this.confirmation_number
						// @property {Number} orderId
						,
					orderId: this.order_id
						// @property {String} pdfUrl
						,
					pdfUrl: _.getDownloadPdfUrl({
						asset: 'order-details',
						id: this.order_id
					})
				};
			}
		});
	});