{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="cart-promocode-list-item" data-id="{{internalid}}">
	<div class="cart-promocode-list-item-container">
		{{#if showDiscountRate}}
			<span class="cart-promocode-list-item-discount">{{discountRate}}</span>
		{{/if}}
		<span class="{{#if isEditable}}cart-promocode-list-item-code-editable{{else}} cart-promocode-list-item-code-readonly{{/if}}">
			{{#if isEditable}}
				{{code}}
			{{else}}
				{{translate 'Promo: $(0)' code}}
			{{/if}}
		</span>
		{{#if isEditable}}
			<a href="#" data-action="remove-promocode" data-id="{{internalid}}">
				<span class="cart-promocode-list-item-remove-action"><i></i></span>
			</a>
		{{/if}}
	</div>
</div>