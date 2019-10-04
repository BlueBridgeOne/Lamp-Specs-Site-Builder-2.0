/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
/*

@module CMSadapter
@class CMSadapterImpl.Core the class that has the core integration using the CMS API.
*/

define('CMSadapterImpl.Core'
,	[
		'underscore'
	,	'Backbone'
	]
,	function (
		_
	,	Backbone
	)
{
	'use strict';

	function AdapterCore(application, CMS)
	{
		this.CMS = CMS;
		this.application = application;

		this.init();
		this.listenForCMS();
	}

	_.extend(AdapterCore.prototype, {

		init: function ()
		{
			var self = this;

			this.application.getLayout().on('afterAppendView', function ()
			{
				self.CMS.trigger('adapter:page:changed');
			});

			this.CMS.trigger('adapter:ready');
		}

	,	listenForCMS: function ()
		{
			// CMS listeners - CMS tells us to do something, could fire anytime.
			var self = this;

			self.CMS.on('adapter:get:setup', function ()
			{
				var setup = {}; // Config values the adapter can give the cms on startup. Currently nothing is used (cms ignores values).
				CMS.trigger('adapter:got:setup', setup);
			});

			self.CMS.on('adapter:get:context', function ()
			{
				var context = self.getCmsContext();
				self.CMS.trigger('adapter:got:context', context);
			});
		}

	,	getCmsContext: function ()
		{
			var url = Backbone.history.fragment.split('?')[0]
			,	path = url[0] === '/' ? url : '/' + url;

			var context = {
				path: path
			,	site_id: this.application.getConfig('siteSettings.siteid')
			,	page_type: this.application.getLayout().currentView ? this.application.getLayout().currentView.el.id : ''
			};

			return context;
		}
	});

	return AdapterCore;
});
