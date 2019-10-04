/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order
define('Discount.Model', 
	[
		'ItemDetails.Model'
	,	'bignumber'
	,	'underscore'
	]
	,	
	function (
		ItemDetailsModel
	,	BigNumber
	,	_
	)
{
	'use strict';
	// @class Discount.Model @extends ItemDetails.Model
	return ItemDetailsModel.extend({
		validation: {
			rate: {
				required: function(value, attr, model) {
					//require a rate only if custom discounts are used and the default discount id is used.
					return !!SC.ENVIRONMENT.defaultDiscountId && model.id === SC.ENVIRONMENT.defaultDiscountId;
				}
			,	fn: function(value, attr, model) {
					var parsedRate = Math.abs(parseFloat(model.rate));
					return !parsedRate || parsedRate < 0.01;
				}
			}
		,	itemid: { 
				required: function(value, attr, model) {
					return !!model.rate;
				}
			}
		,	id: {
				required: false
			}
		}

	,	parse: function(response, options)
		{
			// Make rates negative, since custom discounts can also have positive values
			response.rate = '-' + response.rate;
			return ItemDetailsModel.prototype.parse(response, options);
		}

	,	set: function (attributes, val, options)
		{
			if (typeof attributes !== 'object') {
				var key = attributes;
				attributes = {};
				attributes[key] = val;
			}

			if (!_.isUndefined(attributes.rate))
			{
				var rate = attributes.rate;

				if(_.contains(rate,'%'))
				{
					attributes.isPercentage = true;
					attributes.appliedRate = BigNumber(parseFloat(rate)).div(100).plus(1).round(2).toNumber();
				}
				else
				{
					attributes.isPercentage = false;
					attributes.appliedRate = parseFloat(rate).toFixed(2);
				}
			}
			ItemDetailsModel.prototype.set.call(this, attributes, val, options);
		}

		// @method getPrice @param {Number} originalAmount @return {Number}
	,	getPrice: function (originalAmount)
		{
			var totalPrice = 0;
			if (this.get('isPercentage'))
			{
				totalPrice = BigNumber(originalAmount).times(this.get('appliedRate') || 1);
			}
			else
			{
				totalPrice = BigNumber(originalAmount).plus(this.get('appliedRate') || 0);
			}
			return totalPrice.round(2).toNumber();
		}

		// @method getDisplayRate @param {Number} originalAmount @return {String}
	,	getDisplayRate: function (originalAmount)
		{
			if (this.get('isPercentage'))
			{
				return SC.Utils.formatCurrency(originalAmount - originalAmount * this.get('appliedRate'));
			}
			else
			{
				return SC.Utils.formatCurrency(Math.abs(this.get('appliedRate')));
			}
		}
	});
});
