{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showPromocodeForm}}
	<div class="order-wizard-promocodeform">
		<div class="order-wizard-promocodeform-expander-head">
			<a class="order-wizard-promocodeform-expander-head-toggle collapsed" data-toggle="collapse" data-target="#order-wizard-promocode" aria-expanded="false" aria-controls="order-wizard-promocode">
				{{translate 'Have a Promo Code?'}}
				<i class="order-wizard-promocodeform-tooltip" data-toggle="tooltip" title="{{translate '<b>Promo Code</b><br>To redeem a promo code, simply enter your information and we will apply the offer to your purchase during checkout.'}}"></i>
				<i class="order-wizard-promocodeform-expander-toggle-icon"></i>
			</a>
		</div>
		<div class="order-wizard-promocodeform-expander-body collapse" id="order-wizard-promocode"  data-type="promo-code-container" data-action="show-promo-code-container" aria-expanded="false" data-target="#order-wizard-promocode">
			<div class="order-wizard-promocodeform-expander-container">
				<div data-view="Cart.PromocodeForm"></div>
			</div>
		</div>
	</div>
{{/if}}