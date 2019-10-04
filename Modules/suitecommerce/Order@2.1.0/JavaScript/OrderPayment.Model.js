/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderPayment.Model'
,	[	'CreditCardUtils'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		CreditCardUtils
	,	Backbone
	,	_)
{
	'use strict';

	// @class OrderPayment.Model Payment Model @extends Backbone.Model
	return Backbone.Model.extend({
		url: function()
        {
            var urlTemplate = 'services/OrderPayment.Service.ss?id=$(0)' +
                '&recordtype=$(1)&orderid=$(2)';
            return urlTemplate.format(this.get('id'), this.get('recordtype'), this.get('orderid'));
        }

		// @method getFormattedPaymentmethod
	,	getFormattedPaymentmethod: function ()
		{
			return this.get('paymentmethod');
		}

		// @method getPaymentType @param {String} ccnumber @param {Array} payment_types @return {String}
	,	getPaymentType: function(ccnumber, payment_types)
		{
			var type = CreditCardUtils.getType(ccnumber, payment_types);
			if (type)
			{
				return type;
			} else {
				throw new Error(_('Credit card type not configured').translate());
			}
		}

	,	addManualFormat: function (options)
		{
			var data = _.extend({}, options);
			data.paymentmethod = this.getPaymentType(options.ccnumber, options.paymentmethod);
			this.set(data);
		}

	,	addRawFormat: function (options)
		{
			var data = CreditCardUtils.parseTrack(options.raw);
			data.paymentmethod = this.getPaymentType(data.ccnumber, options.paymentmethod);
			data.payment = options.payment;
			data.signature = options.signature;
			this.set(data);
		}
	});
});
