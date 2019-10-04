/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.

	BB1 G Truslove May 2017
*/

//@module Cart
define('Cart.Item.Summary.View'
,	[	
'ItemViews.Price.View'
,'Backbone.CompositeView'
	,	'Profile.Model'

	,	'cart_item_summary.tpl'

	,	'Backbone'
	,	'jQuery'
	,	'Utils'
	]
,	function (
ItemViewsPriceView
		,BackboneCompositeView
	,	ProfileModel

	,	cart_item_summary_tpl

	,	Backbone
	,	jQuery
	)
{
	'use strict';

	//@class Cart.Item.Summary.View @extend Backbone.View
	return Backbone.View.extend({

		template: cart_item_summary_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}
,	childViews: {
			'Item.Price': function ()
			{
				this.model.get('item').set('quantity_total', this.model.get('quantity_total'));

				//There are some cases where you might want to use the price of the line
				//eg: quantity pricing
				if(this.options.useLinePrice === true && typeof this.model.get('rate') !== 'undefined')
				{
					return new ItemViewsPriceView({
						model: this.model.get('item')
					,	linePrice: this.model.get('rate')
					,	linePriceFormatted: this.model.get('rate_formatted')
					,	hideComparePrice: this.options.hideComparePrice
					,	origin: 'ITEMVIEWCELL'
					});
				}

					return new ItemViewsPriceView({
						model: this.model.get('item')
				,	origin: 'ITEMVIEWCELL'
					});
				}
				}
	,	events:{
			'click [data-action="plus"]': 'addQuantity'
		,	'click [data-action="minus"]': 'subQuantity'
		}

	,	addQuantity: function (e)
		{
			e.preventDefault();
			
			var $element = jQuery(e.target)
			,	quantity_input = $element.parent().find('input')
			,	old_value = quantity_input.val()
			,	new_val = parseFloat(old_value) + 1;
			
			quantity_input.val(new_val);
			quantity_input.change();
		}

	,	subQuantity: function (e)
		{
			e.preventDefault();
			
			var $element = jQuery(e.target)
			,	quantity_input = $element.parent().find('input')
			,	old_value = quantity_input.val()
			,	new_val = parseFloat(old_value) - 1;
			
			new_val = Math.max(this.model.get('item').get('_minimumQuantity', true), new_val);

			quantity_input.val(new_val);
			quantity_input.change();
		}

		//@method getContext @return {Cart.Item.Summary.View.Context}
	,	getContext: function ()
		{
			var minimum_quantity = this.model.get('item').get('_minimumQuantity', true) || 1;

			//@class Cart.Item.Summary.View.Context
			return {
				//@property {Model} line
				line: this.model
				//@property {String} lineId
			,	lineId: this.model.get('internalid')
				//@property {Boolean} isMinusButtonDisabled
			,	isMinusButtonDisabled: this.model.get('item').get('quantity') <= this.model.get('item').get('_minimumQuantity', true) || this.model.get('item').get('quantity') === 1
				//@property {Boolean} showQuantity
			,	showQuantity: this.model.get('item').get('_itemType') === 'GiftCert'
				//@property {Boolean} showComparePrice
			,	showComparePrice: this.model.get('amount') > this.model.get('total')
				//@property {Boolean} showMinimumQuantity
			,	showMinimumQuantity: minimum_quantity > 1
				//@property {Integer} minimumQuantity
			,	minimumQuantity: minimum_quantity
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
			};
			//@class Cart.Item.Summary.View
		}
	});

});
