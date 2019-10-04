/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.CartSummary
define(
	'OrderWizard.Module.CartSummary'
,	[
		'Wizard.Module'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'GlobalViews.FormatPaymentMethod.View'
	,	'Cart.Promocode.List.View'

	,	'order_wizard_cart_summary.tpl'
	,	'cart_summary_gift_certificate_cell.tpl'

	,	'underscore'
	]
,	function (
		WizardModule
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	GlobalViewsFormatPaymentMethodView
	,	CartPromocodeListView

	,	order_wizard_cart_summary_tpl
	,	cart_summary_gift_certificate_cell_tpl

	,	_
	)
{
	'use strict';

	// @class OrderWizard.Module.CartSummary @extends Wizard.Module
	return WizardModule.extend({
		//@property {Function} template
		template: order_wizard_cart_summary_tpl

		//@property {String} className
	,	className: 'OrderWizard.Module.CartSummary'

		//@property {Object} attributes
	,	attributes: {
			'id': 'order-wizard-layout'
		,	'class': 'order-wizard-layout'
		}

		//@method initialize
	,	initialize: function initialize (options)
		{
			var self = this;
			this.wizard = options.wizard;

			//on change model we need to refresh summary
			this.wizard.model.on('change:summary change:paymentmethods', function ()
			{
				//This is an ugly hack to solve the case when the change event trigger first than the confirmation and the lines are converted to collections and models
				if (!_.isArray(self.wizard.model.get('lines')) && self.wizard.model.get('confirmation') && _.isObject(self.wizard.model.get('confirmation').attributes))
				{
					self.render();
				}
			});

			BackboneCompositeView.add(this);

			this.promocodeListView = new CartPromocodeListView({
				model: this.wizard.model
			,	hideRemovePromocodeButton: false
			});

			this.promocodeListView.on('removing_promocode', function ()
			{
				self.trigger('change_enable_continue', false);
			});

			this.promocodeListView.on('remove_promocode_finished', function ()
			{
				self.trigger('change_enable_continue', true);
			});
		}

	,	isActive: function isActive ()
		{
			return this.options.isConfirmation ? this.wizard.model.get('confirmation').get('internalid') : true;
		}

		//@method render
		//@return {Void}
	,	render: function render ()
		{
			if (this.state === 'present' )
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		//@property {Object} childViews
	,	childViews: {
			'GiftCertificates': function ()
			{
				return new BackboneCollectionView({
						collection: this.wizard.model.get('paymentmethods').where({type: 'giftcertificate'}) || []
					,	cellTemplate: cart_summary_gift_certificate_cell_tpl
					,	viewsPerRow: 1
					,	childView: GlobalViewsFormatPaymentMethodView
					,	rowTemplate: null
				});
			}
		,	'CartPromocodeListView': function ()
			{
				return this.promocodeListView;
			}
		}

	,	countItems: function countItems (lines)
		{
			var item_count = 0;

			_.each(lines.models ? lines.models: lines, function (line)
			{
				item_count += line.get('quantity');
			});

			return item_count;
		}

		//@method getContext
		//@returns {OrderWizard.Module.CartSummary.Context}
	,	getContext: function getContext ()
		{
			var confirmation = this.wizard.model.get('confirmation')
				// You need to read from confirmation from the wizards (checkout) that have the isExternalCheckout and the return value is true (when returning from an external payment method)
				// Other wizards, like QuoteToSalesOrder, does not make the confirmation hack
			,	read_from_confirmation = confirmation && confirmation.get('internalid') && this.wizard.isExternalCheckout
			,	model = read_from_confirmation ? confirmation : this.wizard.model
			,	summary = model.get('summary') || {}
			,	item_count = this.countItems(model.get('lines'));

			if (read_from_confirmation)
			{
				this.promocodeListView.setOptions({
					model: model
				,	isReadOnly: true
				});
			}

			//@class OrderWizard.Module.CartSummary.Context
			return {
					model: model
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {Boolean} itemCountGreaterThan1
				,	itemCountGreaterThan1: item_count > 1
					//@property {Array} giftCertificates
				,	giftCertificates: model.get('paymentmethods').where({type: 'giftcertificate'}) || []
					//@property {Boolean} showGiftCertificates
				,	showGiftCertificates: !!summary.giftcertapplied
					//@property {Boolean} showDiscount
				,	showDiscount: !!summary.discounttotal
					//@property {Boolean} showHandlingCost
				,	showHandlingCost: !!summary.handlingcost
					//@property {Boolean} showRemovePromocodeButton
				,	showRemovePromocodeButton: !!this.options.allow_remove_promocode
					//@property {Boolean} showWarningMessage
				,	showWarningMessage: !!this.options.warningMessage
					//@property {String} warningMessage
				,	warningMessage: this.options.warningMessage
					//@property {Boolean} showEditCartMST
				,	showEditCartMST: this.wizard.isMultiShipTo() && !this.options.isConfirmation
			};
			//@class OrderWizard.Module.CartSummary
		}

	});
});