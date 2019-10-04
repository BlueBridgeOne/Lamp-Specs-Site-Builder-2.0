{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a href="/quotes" class="quote-details-header-back-btn">{{translate '&lt; Back to quotes'}}</a>
<section class="quote-details">
	<div class="quote-details-view">
		<header>
			<h2 class="quote-details-header-title">
				{{translate 'Quote '}}
				<span class="quote-details-quote-id">{{tranid}}</span>

				<span class="quote-details-header-amount-total">
					{{summary.total_formatted}}
				</span>
			</h2>
		</header>

		<!--GENERATE HEADER -->
		<div class="quote-details-header-information">
			<div class="quote-details-row">
				<div class="quote-details-header-col-left">
					<p class="quote-details-header-info-request-date">
						<span class="quote-details-header-label-request-date">{{translate 'Request date: '}}</span>
						<span class="quote-details-header-value-date">{{model.trandate}}</span>
					</p>
					<p class="quote-details-header-info-expiration-date">
						<span class="quote-details-header-info-expiration-date-label">{{translate 'Expiration date: ' }}</span>
						{{#if hasDuedate}}
							<span class="quote-details-header-info-expiration-date-value">{{duedate}}</span>

							{{#if model.isOverdue }}
								<i class="quote-details-header-info-expiration-date-icon-overdue"></i>
							{{else}}
								{{#if model.isCloseOverdue}}
									<i class="quote-details-header-info-expiration-date-icon-closeoverdue"></i>
								{{/if}}
							{{/if}}
						{{else}}
							<span class="quote-details-header-info-expiration-date-value">{{translate 'Not specified'}}</span>
						{{/if}}
					</p>
				</div>
				<div class="quote-details-header-col-right">
				{{#if showQuoteStatus}}
					<p class="quote-details-header-info-status">
						<span class="quote-details-header-label-status">{{translate 'Status: '}}</span>
						<span class="quote-details-header-value-status">{{entityStatusName}}</span>
					</p>
				{{/if}}
				</div>
			</div>
		</div>

		<!-- CONTENT -->
		<div class="quote-details-row">
			<div class="quote-details-content-col">

				<div class="quote-details-accordion-divider">
					<div class="quote-details-accordion-head">
							<a class="quote-details-accordion-head-toggle {{#unless showOpenedAccordion}}collapsed{{/unless}}" data-toggle="collapse" data-target="#quote-products" aria-expanded="true" aria-controls="#quote-products">
								{{translate 'Items ($(0))' lineItemsLength}}
							<i class="quote-details-accordion-toggle-icon"></i>
						</a>
					</div>

						<div class="quote-details-accordion-body collapse  {{#if showOpenedAccordion}}in{{/if}}" id="quote-products" role="tabpanel" data-target="#quote-products">
						<table class="quote-details-products-table lg2sm-first">
							<tbody data-view="Items.Collection"></tbody>
						</table>
					</div>
				</div>

				<!-- COMMENTS/MEMO -->
				{{#if showMemo}}
					<div class="quote-details-accordion-divider">

						<div class="quote-details-accordion-head">
							<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-comments" aria-expanded="false" aria-controls="#quote-comments">
								{{translate 'My comments'}}
								<i class="quote-details-accordion-toggle-icon"></i>
							</a>
						</div>

						<div class="quote-details-accordion-body collapse" id="quote-comments" role="tabpanel" data-target="quote-comments">
							<div class="quote-details-accordion-container">
								<div class="quote-details-comments-row">
									{{breaklines memo}}
								</div>
							</div>
						</div>
					</div>
				{{/if}}

				<!-- BILLADDRESS -->
				{{#if showBillingAddress}}
					<div class="quote-details-accordion-divider">
						<div class="quote-details-accordion-head">
							<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-billing-info" aria-expanded="false" aria-controls="#quote-billing-info">
								{{translate 'Payment Information'}}
								<i class="quote-details-accordion-toggle-icon"></i>
							</a>
						</div>
						<div class="quote-details-accordion-body collapse" id="quote-billing-info" role="tabpanel" data-target="quote-billing-info">
							<div class="quote-details-accordion-container">
								<div class="quote-details-billing-row">
									<div class="quote-details-billing-info-card">
										<h5 class="quote-details-billing-info-card-title">
											{{translate 'Bill to:'}}
										</h5>
										<div data-view="Billing.Address"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{{/if}}

				<!-- MESSAGE -->
				{{#if showMessage}}
					<div class="quote-details-accordion-divider">

						<div class="quote-details-accordion-head">
							<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-messages" aria-expanded="false" aria-controls="#quote-messages">
								{{translate 'Message from Sales Representative'}}
								<i class="quote-details-accordion-toggle-icon"></i>
							</a>
						</div>

						<div class="quote-details-accordion-body collapse" id="quote-messages" role="tabpanel" data-target="quote-messages">
							<div class="quote-details-accordion-container">
								<div class="quote-details-message-row">
								{{breaklines message}}
								</div>
							</div>
						</div>
					</div>
				{{/if}}

				<div class="quote-details-disclaimer-bottom-content">
					{{#if hasSalesrep}}
						<small class="quote-details-disclaimer-message">{{translate 'For immediate assistance contact <strong>$(0)</strong> at <strong>$(1)</strong>. For additional information, send an email to <strong>$(2)</strong>.' salesrepName salesrepPhone salesrepEmail}}</small>
					{{else}}
						<small class="quote-details-disclaimer-message">{{{disclaimer}}}</small>
					{{/if}}
				</div>
			</div>

			<!-- SUMMARY -->
			<div class="quote-details-summary-col">
				<div class="quote-details-summary-container">
					<h3 class="quote-details-summary-title">
						{{translate 'SUMMARY'}}
					</h3>
					<div class="quote-details-summary-subtotal">
						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-subtotal">
							{{summary.subtotal_formatted}}
							</span>
							{{translate 'Subtotal'}}
						</p>
					</div>

					{{#if showDiscount}}
						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-discount">
								{{summary.discounttotal_formatted}}
							</span>
							{{translate 'Discount'}}
						</p>
						<div class="quote-details-summary-grid">
							<div class="quote-details-summary-amount-discount-text-success">
								<span class="quote-details-summary-amount-discount-code">
								{{#if true}}
									({{model.discount.name}})
								{{/if}}
								</span>
							</div>
						</div>
					{{/if}}

					{{#if showPromocode}}
						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-promo-code">
								{{model.summary.discountrate_formatted}}
							</span>
							{{translate 'Promo Code Applied'}}
						</p>
						<div class="quote-details-summary-grid">
							<div class="quote-details-summary-promocode-text-success">
								<span class="quote-details-summary-promocode-code">#{{model.promocode.code}}</span>
							</div>
						</div>
					{{/if}}

					<p class="quote-details-summary-grid-float">
						<span class="quote-details-summary-amount-shipping">
						{{summary.shippingcost_formatted}}
						</span>
						{{translate 'Shipping'}}
					</p>

					{{#if showHandlingCost}}
					<p class="quote-details-summary-grid-float">
						<span class="quote-details-summary-handling-cost-formatted">
							{{summary.handlingcost_formatted}}
						</span>
						{{translate 'Handling'}}
					</p>
					{{/if}}

					<p class="quote-details-summary-grid-float">
						<span class="quote-details-summary-amount-tax">
						{{summary.taxtotal_formatted}}
						</span>
						{{translate 'Tax Total'}}
					</p>

					<div class="quote-details-summary-total">
						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-total">
							{{summary.total_formatted}}
							</span>
							{{translate 'Total'}}
						</p>
					</div>

				</div>
				<div class="quote-details-row-fluid">

					{{#if isOpen}}
						{{#unless model.purchasablestatus.isPurchasable}}
							<div data-type="quote-details-and-order-msg-placeholder">
								<div class="quote-details-msg">
									{{#if hasPermissionAndHasErrors}}
										<p>{{translate 'The following information is needed:'}}</p>
										<ul>
											{{#each purchaseValidationErrors}}
												<li>- {{this}}</li>
											{{/each}}
										</ul>
									{{/if}}

									{{#if hasSalesrep}}
										<p>{{translate 'To place the order please contact <strong>$(0)</strong> at <strong>$(1)</strong> or send an email to <strong>$(2)</strong>' salesrepName salesrepPhone salesrepEmail}}</p>
									{{else}}
										<p>{{{disclaimerSummary}}}</p>
									{{/if}}
								</div>

								{{#if showGiftCertificateMessage}}
									<div class="quote-details-msg-certificate">
										<p>
											<i class="quote-details-msg-certificate-icon"></i>
											{{translate 'Gift Certificate not allowed'}}
										</p>
									</div>
								{{/if}}
							</div>
						{{/unless}}

						{{#if hasPermission}}
							<a href="{{reviewQuoteURL}}" class="quote-details-button-review-and-order" {{#unless model.purchasablestatus.isPurchasable}}disabled{{/unless}}>{{translate 'Review and Place Order'}}</a>
						{{/if}}
					{{/if}}
					<a href="{{pdfUrl}}" target="_blank" class="quote-details-button-download-pdf">{{translate 'Download as PDF'}}</a>
				</div>
				<div class="quote-details-disclaimer-bottom">
					{{#if hasSalesrep}}
						<small class="quote-details-disclaimer-message">{{translate 'For immediate assistance contact <strong>$(0)</strong> at <strong>$(1)</strong>. For additional information, send an email to <strong>$(2)</strong>.' salesrepName salesrepPhone salesrepEmail}}</small>
					{{else}}
						<small class="quote-details-disclaimer-message">{{{disclaimer}}}</small>
					{{/if}}
				</div>
			</div>
		</div>
	</div>
</section>
