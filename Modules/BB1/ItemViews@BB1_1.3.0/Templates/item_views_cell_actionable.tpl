{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.

	BB1 G Truslove May 2017
}}

<tr id="{{lineId}}" data-item-id="{{itemId}}" data-type="order-item" class="cart-line" itemscope itemtype="http://schema.org/Product" {{#if showGeneralClass}} class="{{generalClass}}" {{/if}}>
<td>
	
	<table cellspacing="0"><tr><td colspan="3">
		<div class="item-views-cell-actionable-name">
		{{#if isNavigable}}
			<a {{linkAttributes}} class="item-views-cell-actionable-name-link">
				{{item._name}}
			</a>
		{{else}}
				<span class="item-views-cell-actionable-name-viewonly">{{item._name}}</span>
		{{/if}}
		</div>
	</td></tr>
<tr><td>
	<div class="item-views-cell-actionable-thumbnail">
			{{#if isNavigable}}
				<a {{linkAttributes}}>
					<img src="{{resizeImage item._thumbnail.url 'thumbnail'}}" alt="{{item._thumbnail.altimagetext}}">
				</a>
			{{else}}
				<img src="{{resizeImage item._thumbnail.url 'thumbnail'}}" alt="{{item._thumbnail.altimagetext}}">
			{{/if}}
		</div>
</td><td>

<table class="cart-table">
<tr><th class="cart-head">Quantity</th><th class="cart-head">Price</th><th class="cart-head">Amount</th></tr>
<tr data-view="Item.Summary.View"></tr>
</table>

<div class="item-views-cell-actionable-stock" data-view="ItemViews.Stock.View" >
		</div>
		<div class="item-views-cell-actionable-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>
		
		
</td><td>
	<div data-view="Item.Actions.View"></div>
		
		{{#if showAlert}}
			<div class="item-views-cell-actionable-alert-placeholder" data-type="alert-placeholder"></div>
		{{/if}}

		{{#if showCustomAlert}}
			<div class="alert alert-{{customAlertType}}">
				{{item._cartCustomAlert}}
			</div>
		{{/if}}
</td></tr>
	</table>

</td>
</tr>

