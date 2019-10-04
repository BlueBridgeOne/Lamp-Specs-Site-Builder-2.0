/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//Backend Configuration file
// @module ssp.libraries
// @class Configuration Backend Configuration file
define('Configuration', ['Utils', 'underscore',	'Models.Init', 'Console'], function(Utils, _, ModelsInit)
{
	'use strict';

	/*
		Recursive extension of an object. Similar to _.extend() in lodash
		If the source and target are array, the target size it's going to
		be set to the same size of the source.
	*/
	function mergeConfigurationObjects(target, source)
	{
		if(!_.isObject(target))
		{
			return source;
		}
		if (_.isArray(source) && _.isArray(target))
		{
			target.length = source.length;
		}
		_.each(source, function(value, key)
		{
			if(key in target)
			{
				target[key] = mergeConfigurationObjects(target[key], value);
			}
			else
			{
				target[key] = value;
			}
		});

		return target;
	}

	SC.Configuration =
	{
		get: function (path, defaultValue)
		{
			return Utils.getPathFromObject(this, path, defaultValue);
		}
	};

	var domain = session.getSiteSettings(['touchpoints']).touchpoints.home.match(/^http(s?)\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[2];

	SC.Configuration = mergeConfigurationObjects(SC.Configuration, typeof(ConfigurationManifestDefaults) === 'undefined' ? {} : ConfigurationManifestDefaults);

	// then we read from the record, if any, and mix the values with the default values in the manifest.
	if (Utils.recordTypeExists('customrecord_ns_sc_configuration'))
	{
		var siteid = session.getSiteSettings(['siteid']).siteid
		,	config_key = domain ? siteid + '|' + domain : siteid + '|all'
		,	search = nlapiCreateSearch('customrecord_ns_sc_configuration', [new nlobjSearchFilter('custrecord_ns_scc_key', null, 'is', config_key)], [new nlobjSearchColumn('custrecord_ns_scc_value')])
		,	result = search.runSearch().getResults(0, 1000);

		var configuration = result.length && JSON.parse((result[result.length - 1]).getValue('custrecord_ns_scc_value')) || {};

		SC.Configuration = mergeConfigurationObjects(SC.Configuration, configuration);
	}
	//Adapt the values of multiDomain.hosts.languages and multiDomain.hosts.currencies to the structure requiered by hosts
	SC.Configuration.hosts = [];

	if(SC.Configuration.multiDomain && SC.Configuration.multiDomain.hosts && SC.Configuration.multiDomain.hosts.languages)
	{
		_.each(SC.Configuration.multiDomain.hosts.languages, function(language)
		{

			var storedHost = _.find(SC.Configuration.hosts, function(host)
			{
				return host.title === language.host;
			});
			function getLanguageObj()
			{
				return {
					title: language.title
				,	host: language.domain
				,	locale: language.locale
				};
			}

			if (!storedHost)
			{
				SC.Configuration.hosts.push(
					{
						title: language.host
					,	languages: [
							getLanguageObj()
						]
					,	currencies: _.filter(SC.Configuration.multiDomain.hosts.currencies, function(currency)
						{
							return currency.host === language.host;
						})
					}
				);
			}
			else
			{
				storedHost.languages.push(
					getLanguageObj()
				);
			}
		});
	}
	//TODO: only temporary - migrate this to config.json
	/*mergeConfigurationObjects(SC.Configuration, {
		/*quote: {
			//@property {String} purchase_ready_status_id Set the id used by SCA to know when the estimate/Quote have is ready to be purchased by the shopper
			//The list of status is configured in: Setup > Sales > Customer Statuses
			purchase_ready_status_id: '12'
		}
	,	quote_to_salesorder_wizard: {
			//@property {String} invoice_form_id Set the id of the invoice form used to generate sales order using terms
			//This value can be set by going to: Customization > Forms > Transaction Forms. Find the entry of type: Sales Order and name: Standard Sales Order - Invoice
			//for that value copy here its INTERNAL ID
			invoice_form_id: '89'
		}

		// @property {Boolean} isSCISIntegrationEnabled must be truthy for the omni channel experience to be enabled (turned on by default)
	,	isSCISIntegrationEnabled: true

	,	locationTypeMapping: {
			store: {
				internalid: '1'
			,	name: 'Store'
			}
		}*/

		// @property {Object} storeLocator configuration
	/*,	storeLocator: {
			//@property {String} distanceUnit. Possible values are: mi - miles (Default) km - kilometers
			//distanceUnit: 'mi'
			//@property defaultQuantityLocations represents the top number of Locations that will be returned when no Locations are available within the selected radius
		//,	defaultQuantityLocations: 3
			//@property {String} defaultTypeLocations 1 - Store 2- Warehouse
		//,	defaultTypeLocations: '1'

		//Use the following properties for retrieving ServiceHours and FriendlyName field values from a Custom Field associated to the Location record.
		// Uncomment the following lines including the Custom Field internalid.
			//	@property {String} customFriendlyName
			//	If property exist, field be added to result set
		//,	customFriendlyName: 'your_customfield_id'
			//	@property {String} customOpenHours
			//	If property exist, field be added to result set
		//,	customServiceHours: 'your_customfield_id'

		}*/

		// @property {Object} newsletter Configuration of the Newsletter subscription
	/*,	newsletter: {
			genericFirstName: 'unknown'
		,	genericLastName: 'unknown'
		}*/

/*
		// @property {Object} categories CommerceCategory configuration
	,	categories: {
			menuLevel: 3
		,	addToNavigationTabs: true
			// commercecategory columns: 'internalid', 'name', 'description', 'pagetitle', 'pageheading', 'pagebannerurl', 'addtohead', 'metakeywords', 'metadescription', 'displayinsite', 'urlfragment', 'sequencenumber', 'thumbnailurl'
		,	sideMenu: {
				'sortBy': 'sequencenumber'
				// columns: 'internalid', 'name', 'sequencenumber', 'urlfragment', 'displayinsite'
			,	'additionalFields': [
				]

			,	'uncollapsible': false
			,	'showMax': 5
			,	'collapsed': false
			}
		,	subCategories: {
				'sortBy': 'sequencenumber'
				// columns: 'internalid', 'name', 'description', 'sequencenumber', 'urlfragment', 'thumbnailurl', 'displayinsite'
			,	'fields': [
				]
			}
		,	category: {
				// columns: 'internalid', 'name', 'description', 'pagetitle', 'pageheading', 'pagebannerurl', 'addtohead', 'metakeywords', 'metadescription', 'displayinsite', 'urlfragment'
				'fields': [
				]
			}
		,	breadcrumb: {
				// columns: 'internalid', 'name', 'displayinsite'
				'fields': [
				]
			}
		,	menu: {
				'sortBy': 'sequencenumber'
				// columns: 'internalid', 'name', 'sequencenumber', 'displayinsite'
			,	'fields': [
				]
			}
		}


	});*/
	SC.Configuration.categories = ModelsInit.context.getSetting('FEATURE', 'COMMERCECATEGORIES') === 'T' ? SC.Configuration.categories : false;

	/* globals __sc_ssplibraries_t0 */
	if(typeof(__sc_ssplibraries_t0) !== 'undefined')
	{
		SC.Configuration.__sc_ssplibraries_time = new Date().getTime() - __sc_ssplibraries_t0;
	}

	return SC.Configuration;
});
