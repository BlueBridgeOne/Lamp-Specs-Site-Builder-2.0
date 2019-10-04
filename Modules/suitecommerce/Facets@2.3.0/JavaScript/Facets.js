/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets AKA Item List.
// @class Facets This is the index, routes in the router are assigned here
// @extends ApplicationModule
define(
	'Facets'
,	[	'Facets.Translator'
	,	'Facets.Model'
	,	'Facets.Router'
	,	'Categories'

	,	'underscore'

	// loading declared templates in configuration > resource.template
	,	'facets_item_cell_grid.tpl'
	,	'facets_item_cell_table.tpl'
	,	'facets_item_cell_list.tpl'
	,	'facets_faceted_navigation_item.tpl'
	,	'facets_faceted_navigation_item_color.tpl'
	,	'facets_faceted_navigation_item_range.tpl'
	]
,	function (
		Translator
	,	Model
	,	Router
	,	Categories

	,	_
	)
{
	'use strict';

	function prepareRouter (application, router)
	{
		// we are constructing this regexp like:
		// /^\b(toplevelcategory1|toplevelcategory2|facetname1|facetname2|defaulturl)\b\/(.*?)$/
		// and adding it as a route

		var facets_to_include = new Translator().getFacetsToInclude();

		// Here we generate an array with:
		// * The default url
		// * The Names of the facets that are in the siteSettings.facetfield config
		// * And the url of the top level categories
		var components = _.compact(_.union(
			[application.translatorConfig.fallbackUrl]
		,	facets_to_include || []
		));

		router.addUrl(components, 'facetLoading');

		var categoriesTopLevelUrl = Categories.getTopLevelCategoriesUrlComponent();

		router.addUrl(categoriesTopLevelUrl, 'categoryLoading');
	}

	function setTranslatorConfig (application)
	{
		// Formats a configuration object in the way the translator is expecting it
		application.translatorConfig = {
			fallbackUrl: application.getConfig('defaultSearchUrl')
		,	defaultShow: _.find(application.getConfig('resultsPerPage'), function (show) { return show.isDefault; }).items || application.getConfig('resultsPerPage')[0].items
		,	defaultOrder: _.find(application.getConfig('sortOptions'), function (sort) { return sort.isDefault; }).id || application.getConfig('sortOptions')[0].id
		,	defaultDisplay: _.find(application.getConfig('itemsDisplayOptions'), function (display) { return display.isDefault; }).id || application.getConfig('itemsDisplayOptions')[0].id
		,	facets: application.getConfig('facets')
		,	facetDelimiters: application.getConfig('facetDelimiters')
		,	facetsSeoLimits: application.getConfig('facetsSeoLimits')
		};
	}

	return {
		// @property {Class<FacetsTranslator>} Translator the facets translator class
		Translator: Translator
	,	Model:  Model
	,	Router: Router
	,	setTranslatorConfig: setTranslatorConfig

		// @method prepareRouter
	,	prepareRouter: prepareRouter

		// @property {Object} facetConfigParsers configuration facet parsers available in the configuration: facets->parser properties. Third party modules could add new here.
	,	facetConfigParsers: {
			currency: function(value)
			{
				return _.formatCurrency(value);
			}
		,	quantity: function(value)
			{
				return _.formatQuantity(value);
			}
		,	'default': function(value)
			{
				return value;
			}
		}

	,	mountToApp: function (application)
		{
			setTranslatorConfig(application);

			var routerInstance = new Router(application);

			prepareRouter(application, routerInstance);

			// Wires some config to the model
			Model.mountToApp(application);

			// set up facet configuration parsers
			var self = this;
			_.each(application.Configuration.get('facets'), function(facet)
			{
				if(facet.parser)
				{
					facet.parser = self.facetConfigParsers[facet.parser];
				}
				if(!facet.parser)
				{
					facet.parser = self.facetConfigParsers['default'];
				}
			});

			return routerInstance;
		}
	};
});
