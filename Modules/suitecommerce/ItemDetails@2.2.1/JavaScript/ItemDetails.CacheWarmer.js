/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ItemDetails.Cache.js
// --------------------
// Represents 1 single product of the web store
define(
	'ItemDetails.CacheWarmer'
,	[
		'ItemDetails.Cache'
	,	'ItemDetails.Collection'
	,	'OpenDrawerReason.Collection'
	,	'Discount.Collections'
	,	'Order.Return.Collections'
	,	'ItemDetails.Model'
	,	'Backbone'
	]
,	function(
		ItemDetailsCache
	,	ItemDetailsCollection
	,	OpenDrawerReasonCollections
	,	DiscountCollections
	,	OrderReturnCollections
	,	ItemDetailsModel
	,	Backbone
	)
{
	'use strict';

	return {

		mountToApp: function()
		{
			if (SC.ENVIRONMENT.loggedIn)
			{
				var items_collection = new ItemDetailsCollection()
				,	discounts = new DiscountCollections.Discounts()
				,	discountReasons = new DiscountCollections.DiscountReasons()
				,	returnReasons = new OrderReturnCollections.ReturnReasons()	
				,	openCashDrawerReasons = new OpenDrawerReasonCollections();

				items_collection.fetch({cache: true}).then(function()
				{
					items_collection.each(function(item)
					{
						ItemDetailsCache.add(item);
					});
				});

				discounts.fetch().then(function()
				{
					discounts.each(function(discount)
					{
						ItemDetailsCache.add(discount);
					});

					SC.ENVIRONMENT.discounts = discounts;
				});

				discountReasons.fetch().then(function()
				{
					//Adding an empty model to show the "custom reason" input without much hassle with collection views. Check discount_list_element.tpl
					discountReasons.add(new Backbone.Model());
					SC.ENVIRONMENT.discountReasons = discountReasons;
				});

				// Add rounding item
				ItemDetailsCache.add(new ItemDetailsModel({
					internalid: SC.Configuration.order.roundItemId
				,	itemtype: 'Payment'
				,	itemid: 'Rounding'
				,	name: 'Rounding'
				}));

				// as is cached, the next fetch will be instantaneous
				returnReasons.fetch().then(function()
				{
					SC.ENVIRONMENT.returnReasons = returnReasons;
				});

				openCashDrawerReasons.fetch().then(function()
				{
					//Adding an empty model to show the "custom reason" input without much 
					//hassle with collection views. Check discount_list_element.tpl
					openCashDrawerReasons.add(new Backbone.Model());					
					SC.ENVIRONMENT.openCashDrawerReasons = openCashDrawerReasons;
				});



			}
		}
	};
});
