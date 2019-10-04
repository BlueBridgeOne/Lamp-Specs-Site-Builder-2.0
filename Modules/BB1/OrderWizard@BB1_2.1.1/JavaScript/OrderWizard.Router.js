/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define('OrderWizard.Router'
,	[	
		'Wizard.Router'
	,	'Session'
	,	'OrderWizard.Step'
	,	'LiveOrder.Model'
	,	'Profile.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		WizardRouter
	,	Session
	,	OrderWizardStep
	,	LiveOrderModel
	,	ProfileModel

	,	_
	,	Backbone
	)
{
	'use strict';
	//@class OrderWizard.Router @extends Wizard.Router
	return WizardRouter.extend({
		//@property {OrderWizard.Step} step
		step: OrderWizardStep
		//@method initialize
	,	initialize: function ()
		{
			WizardRouter.prototype.initialize.apply(this, arguments);

			this.profileModel = ProfileModel.getInstance();

			var payment_methods = this.model.get('paymentmethods')
			,	payment_method_credit_card = payment_methods.findWhere({type: 'creditcard'})
			,	credit_card = payment_method_credit_card && payment_method_credit_card.get('creditcard');

			// remove temporal credit card.
			if (credit_card && credit_card.internalid === '-temporal-')
			{
				payment_methods.remove(payment_method_credit_card);
			}

			if (this.application.getConfig('startCheckoutWizard') && !~_.indexOf(this.stepsOrder, ''))
			{
				this.route('', 'startWizard');
				this.route('?:options', 'startWizard');
			}
		}
		//@method startWizard
	,	startWizard: function ()
		{
			Backbone.history.navigate(this.getFirstStepUrl(), {trigger: false, replace:true});
			this.runStep();
		}
		//@method hidePayment
	,	hidePayment: function ()
		{
			return this.application.getConfig('siteSettings.checkout.hidepaymentpagewhennobalance') === 'T' && this.model.get('summary').total === 0;
		}
		//@method isPaypal
	,	isPaypal: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && selected_paymentmethod.get('type') === 'paypal';
		}
		//@method isPaypalComplete
	,	isPaypalComplete: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && selected_paymentmethod.get('type') === 'paypal' && selected_paymentmethod.get('complete');
		}
		//@method isExternalCheckout
	,	isExternalCheckout: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && !!~selected_paymentmethod.get('type').indexOf('external_checkout');
		}
	,	isMultiShipTo: function ()
		{
			return this.model.get('ismultishipto');
		}

	,	isAutoPopulateEnabled: function ()
		{
			var is_guest = this.profileModel.get('isGuest') === 'T';

			return this.application.getConfig('autoPopulateNameAndEmail') && (is_guest && this.application.getConfig('forms.loginAsGuest.showName') || !is_guest);
		},
		getCurrency: function () {

			var currency = SC.ENVIRONMENT&&SC.ENVIRONMENT.currentCurrency&&SC.ENVIRONMENT.currentCurrency.code;
			var session_currency = SC.SESSION&&SC.SESSION.currency&&SC.SESSION.currency.code;
			return session_currency||currency;
		},
		getValue: function (name) { //get a value from localstorage if available

			if (typeof (Storage) !== "undefined") {
				return localStorage.getItem(name);
			}
		},
		setValue: function (name, value) { //set a value in localstorage if available

			if (typeof (Storage) !== "undefined") {
				return localStorage.setItem(name, value);
			}
		}

		//@method runStep
	,	runStep: function (options)
		{
			// Computes the position of the user in the flow
			var url = (options) ? Backbone.history.fragment.replace('?' + options, '') : Backbone.history.fragment
			,	position = this.getStepPosition(url)
			,	content = ''
			,	page_header = ''
			,	last_order_id = _.parseUrlOptions(options).last_order_id;
console.log("runStep");
console.log(this.model);
var summary=this.model.get("summary");
console.log(summary);
if(summary&&summary.subtotal>0){
	console.log("Save Summary");
	this.setValue("summary",summary);
}
			if (last_order_id && !this.model.get('confirmation').get('internalid'))
			{
				//The page has been refreshed. This is annoying so the summary has been passed over so that GTM can get the transaction details.
				console.log("Show Confirmation");
				
				var savedSummary=this.getValue("summary");
				if(savedSummary){
				console.log(savedSummary);
				console.log("Track transaction Router");

				var confirmation=this.model.get("confirmation");
				if(confirmation){
				//console.log(gtag);
					try {
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
				}else{
					console.log("confirmation not found.");
				}
				}
				if (this.profileModel.get('isGuest') !== 'T')
				{
					//checkout just finnished and user refreshed the doc.
					page_header = _('Your Order has been placed').translate();
					content = _('If you want to review your last order you can go to <a href="#" data-touchpoint="$(0)" data-hashtag="#/ordershistory/view/salesorder/$(1)">Your Account</a>. ')
						.translate('customercenter', last_order_id) +
						_('Or you can continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ').translate();
				}
				else
				{
					page_header = _('Your Shopping Cart is empty').translate();
					content = _('Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ').translate();
				}

				var layout = this.application.getLayout();

				return layout.internalError && layout.internalError(content, page_header, _('Checkout').translate());
			}

			// if you have already placed the order you can not be in any other step than the last
			if (this.model && this.model.get('confirmation') && (this.model.get('confirmation').get('confirmationnumber') || this.model.get('confirmation').get('tranid')) && position.toLast !== 0)
			{
				window.location = Session.get('touchpoints.home');
				return;
			}

			WizardRouter.prototype.runStep.apply(this, arguments);

		}
	});
});
