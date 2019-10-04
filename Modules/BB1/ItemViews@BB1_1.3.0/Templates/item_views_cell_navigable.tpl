{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.

	BB1 G Truslove May 2017
}}

<tr class="item-views-cell-navigable {{cellClassName}} item-{{itemId}}" data-id="{{itemId}}" data-item-type="{{itemType}}">
<td class="cell-small-pad"><table cellsapcing="0" style="width:100%"><tr>
<td colspan="4" class="cell-small-pad">
	<p class="item-views-cell-navigable-product-name">
			{{#if isNavigable}}
				<a class="item-views-cell-navigable-product-title-anchor" {{{itemURLAttributes}}}>{{itemName}}</a>
			{{else}}
				<span class="item-views-cell-navigable-product-title">
					{{itemName}}
				</span>
			{{/if}}
		</p>
</td>
</tr><tr>
	<td class="item-views-cell-navigable-item-image cell-small-pad" name="item-image">
		<img src="{{resizeImage itemImageURL 'thumbnail'}}" alt="{{itemImageAltText}}">
	</td>
	<td>
		<table class="cart-table">
			<tr><th class="cart-head">QTY</th><th class="cart-head">Price</th><th class="cart-head">Amount</th></tr>
			<tr><td class="cart-cell">
{{quantity}}
			</td><td class="cart-cell">
				<div data-view="Item.Price"></div>
			</td><td class="cart-cell">

		<span class="item-views-cell-navigable-item-amount-value"> {{detail3}}</span>

			</td></tr>
		</table>
		{{#if showOptions}}
			<div data-view="Item.Options"></div>
		{{/if}}
	</td>
	</tr>
	</table>
	</td>
</tr>
