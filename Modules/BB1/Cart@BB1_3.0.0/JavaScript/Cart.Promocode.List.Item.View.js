/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Promocode.List.Item.View'
,	[
		'cart_promocode_list_item.tpl'

	,	'Backbone'
	]
,	function (
		cart_promocode_list_item_tpl

	,	Backbone
	)
{
	'use strict';

	//@class Cart.Promocode.List.Item.View @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: cart_promocode_list_item_tpl

		//@method initialize
		//@param {Cart.Promocode.List.Item.View.Initialize.Options} options
		//@return {Void}

		//@method getContext
		//@return {Cart.Promocode.List.Item.View.Context}
	,	getContext: function getContext ()
		{
			//@class Cart.Promocode.List.Item.View.Context
			return {
				//@property {String} code
				code: this.model.get('code')
				//@property {String} internalid
			,	internalid: this.model.get('internalid')
				//@property {Boolean} isEditable
			,	isEditable: !this.options.isReadOnly
				//@property {Boolean} showDiscountRate
			,	showDiscountRate: !!this.model.get('discountrate_formatted')
				//@property {String} discountRate
			,	discountRate: this.model.get('discountrate_formatted')
			};
			//@class Cart.Promocode.List.Item.View
		}
	});
});

//@class Cart.Promocode.List.Item.View.Initialize.Options
//@property {Backbone.Model<{code:String,internalid:String}>} model
//@property {Boolean?} isReadOnly
