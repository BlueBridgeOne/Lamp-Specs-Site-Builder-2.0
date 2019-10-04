/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
// @module CMSadapter
define('CMSadapter'
,	[	'jQuery'
	,	'underscore'
	,	'Backbone'
	,	'CMSadapter.Page.Router'
	,	'CMSadapter.Page.Collection'
	,	'CMSadapterImpl.Core'
	,	'CMSadapterImpl.Landing'
	,	'CMSadapterImpl.Categories'
	,	'CMSadapterImpl.Enhanced'
	,	'SC.Configuration'
	]
,	function (
		jQuery
	,	_
	,	Backbone
	,	PageRouter
	,	PageCollection
	,	CMSadapterImplCore
	,	CMSadapterImplLanding
	,	CMSadapterImplCategories
	,	CMSadapterImplEnhanced
	,	Configuration
	)
{
	'use strict';

	// @class CMSadapter responsible of starting both the adapter implementation and cms landing pages router.
	// Assumes cms.js is already loaded
	// @extend ApplicationModule
	return {

		mountToApp: function (application)
		{
			if (Configuration.get('cms.useCMS'))
			{
				var router = this.initPageRouter(application);

				var self = this;

				// instantiate and expose it:
				if (typeof CMS === 'undefined' || !CMS.on)
				{
					Backbone.Events.on('cms:load', function ()
					{
						self.initAdapter(application, router);
					});
				}
				else
				{
					this.initAdapter(application, router);
				}

				this.adapterEnhanced = new CMSadapterImplEnhanced(application, router);
			}
		}


		// @method initAdapter
		// Heads up! CMS global variable should be already available since we start the
		// shopping application after cms.js is loaded, see SC.Shopping.Starter.js
	,	initAdapter: function(application, landingRouter)
		{
			if (typeof CMS === 'undefined')
			{
				console.log('Error: CMS global variable not found - CMS adapter not initialized');
				return;
			}

			this.adapterCore = new CMSadapterImplCore(application, CMS);
			this.adapterLanding = new CMSadapterImplLanding(application, CMS, landingRouter);
			this.adapterCategories = new CMSadapterImplCategories(application, CMS);
		}

		// @method initPageRouter instantiate the landing pages router using bootstrapped data.
	,	initPageRouter: function(application)
		{
			if(!SC.ENVIRONMENT.CMS || !SC.ENVIRONMENT.CMS.pages)
			{
				console.log('Error: CMS landing pages data not found in SC.ENVIRONMENT.CMS.pages. Router not initialized');
				return;
			}

			var collection = new PageCollection(SC.ENVIRONMENT.CMS.pages.pages || []);
			var router = new PageRouter(application, collection);

			return router;
		}
	};
});
