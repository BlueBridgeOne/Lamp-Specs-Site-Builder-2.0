/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard.Module.MultiShipTo.EnableLink
define(
	'OrderWizard.Module.MultiShipTo.EnableLink'
,	[	'Wizard.Module'
	,	'OrderWizard.PromocodeUnsupported.View'
	,	'GlobalViews.Confirmation.View'
	,	'OrderWizard.Module.MultiShipTo.RemovedPromoCodes'

	,	'order_wizard_msr_enablelink_module.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		WizardModule
	,	PromocodeUnsupportedView
	,	GlobalViewsConfirmationView
	,	OrderWizardModuleMultiShipToRemovedPromoCodes

	,	order_wizard_msr_enablelink_module_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class OrderWizard.Module.MultiShipTo.EnableLink @extend Wizard.Module
	return WizardModule.extend(
	{
		//@property {Function} template
		template: order_wizard_msr_enablelink_module_tpl

	,	className: 'OrderWizard.Module.MultiShipTo.EnableLink'

	,	events: {
			'click [data-action="change-status-multishipto"]': 'updateMultiShipToStatus'
		}

		//@method initialize Override default method to attach current module on wizard's model events
		//@return {Void}
	,	initialize: function initialize ()
		{
			WizardModule.prototype.initialize.apply(this, arguments);

			if (!this.wizard.model._events['toggle-multi-ship-to'])
			{
				this.wizard.model.on('toggle-multi-ship-to', this.toggleMultiShipTo, this);
				this.wizard.model.on('update-multi-ship-to-status', this.updateMultiShipToStatus, this);
				this.wizard.model.on('ismultishiptoUpdated', this.render, this);
			}
		}

		//@method isActive Determines if the current module is valid to be shown and operate with
		//@return {Boolean}
	,	isActive: function isActive ()
		{
			var shippable_items = this.wizard.model.getShippableLines();
			return this.wizard.application.getConfig('siteSettings.isMultiShippingRoutesEnabled', false) &&
				(shippable_items.length > 1 || (shippable_items.length === 1 && shippable_items[0].get('quantity') > 1));
		}

		//@method updateMultiShipToStatus Handle the change between module ship to and single ship to\
		//@param {jQuery.Event} e
		//@return {void}
	,	updateMultiShipToStatus: function updateMultiShipToStatus (e)
		{
			e && e.preventDefault();

			var application = this.wizard.application;

			if (this.wizard.model.get('promocodes') && this.wizard.model.get('promocodes').length)
			{
				var promocodeUnsupportedView = new PromocodeUnsupportedView({
					model: this.wizard.model
				,	application: application
				,	parent: this
				});

				application.getLayout().showInModal(promocodeUnsupportedView);
			}
			else
			{
				this.toggleMultiShipTo();
			}
		}

		//@method toggleMultiShipTo Toggle the MST status of the order
		//@return {jQuery.Deferred}
	,	toggleMultiShipTo: function toggleMultiShipTo ()
		{
			if (!this.wizard.model.get('ismultishipto'))
			{
				//These unsets are silent in order to avoid problems with other modules
				this.wizard.model.set('shipmethod',  null, {silent: true});
				this.wizard.model.set('sameAs', false, {silent: true});
				this.wizard.model.set('shipaddress', null, {silent: true});
			}

			var self = this;
			this.wizard.model.set('ismultishipto', !this.wizard.model.get('ismultishipto'));

			return this.wizard.model.save()
				.done(function ()
				{
					self.wizard.model.trigger('ismultishiptoUpdated');

					// var invalid_promocodes = _.filter(self.wizard.model.get('promocodes') || [], function (promo_code)
					// 	{
					// 		return !promo_code.isvalid;
					// 	});

					// if (invalid_promocodes.length)
					// {
						// self.removedPromocodesConfirmation(invalid_promocodes);
					// }

					Backbone.history.navigate(self.options.change_url || '/', {trigger: true});
					self.render();
				});
		}

		//@method removedPromocodesConfirmation
		//@param {Array<LiveOrder.Model.PromoCode>} invalid_promocodes
		//@return {Void}
	,	removedPromocodesConfirmation: function removedPromocodesConfirmation (invalid_promocodes)
		{
			var removedPromocodesConfirmationView = new GlobalViewsConfirmationView({
				callBack: this.revertMultiShipToAndPromoCodes
			,	callBackParameters: {
					context: this
				,	invalidPromocodes: invalid_promocodes
				}
			,	title: _('Alert').translate()
			,	view: OrderWizardModuleMultiShipToRemovedPromoCodes
			,	viewParameters: {
					invalidPromocodes: invalid_promocodes
				}
			,	autohide: true
			});

			this.wizard.application.getLayout().showInModal(removedPromocodesConfirmationView);
		}

	,	revertMultiShipToAndPromoCodes: function revertMultiShipToAndPromoCodes (options)
		{
			var new_promocodes = (this.wizard.model.get('promocodes') || []).concat(options.invalidPromocodes);

			return this.wizard.model.save({promocodes:new_promocodes});
		}

		//@method render We override render to just render this module in case the multi ship to feature is enabled
		//@return {Void}
	,	render: function render ()
		{
			if (this.isActive())
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		//@method getContext
		//@return {OrderWizard.Module.MultiShipTo.EnableLink.Context}
	,	getContext: function getContext ()
		{
			//@class OrderWizard.Module.MultiShipTo.EnableLink.Context
			return {
				//@property {Boolean} isMultiShipToEnabled
				isMultiShipToEnabled: !!this.model.get('ismultishipto')
			};
			//@class OrderWizard.Module.MultiShipTo.EnableLink
		}
	});
});