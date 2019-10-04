/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Facets.Browse.CategoryHeading.View'
,	[
    	'Backbone'
    ,	'facets_browse_category_heading.tpl'
	]
,	function (
    	Backbone
	,	facetsBrowseCategoryHeadingTpl
	)
{
    'use strict';

    return Backbone.View.extend({

        template: facetsBrowseCategoryHeadingTpl

    ,	getContext: function ()
		{
            return {
                name: this.model.get('name')
            ,	banner: this.model.get('pagebannerurl')
            ,	description: this.model.get('description')
			,	pageheading: this.model.get('pageheading') || this.model.get('name')
            };
        }
    });
});
