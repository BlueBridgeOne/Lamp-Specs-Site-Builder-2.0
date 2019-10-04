//BB1 - G Truslove
//This is code provided by NS
function service(request, response) {
   var returnval = null;
   var c = request.getParameter("c");
   var n = request.getParameter("n");
   var frame = request.getParameter("frame");

   try {
      var shoppingSession = nlapiGetWebContainer().getShoppingSession();
      var orderHandlerUrl = shoppingSession.getAbsoluteUrl('checkout', 'bb1_lampspecs_placeorder.ss?frame=true&t=' + (new Date().getTime()) + '&c=' + c + '&n=' + n);
      var orderSetting = {
         paymentauthorization: {
            type: 'threedsecure',
            noredirect: 'T',
            termurl: orderHandlerUrl
         }
      };
      returnval = shoppingSession.getOrder().submit(orderSetting);
   } catch (e) {
      var nle = nlapiCreateError("ERR_PLACEORDER", e);
      returnval = {
         status: 'error',
         reasoncode: nle.getCode(),
         message: nle.getDetails()
      };
   }
   nlapiLogExecution("DEBUG", "returnval", JSON.stringify(returnval));

   if (returnval.statuscode == "success") {
      var body = "";
      body += "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"https://lspecs.eu2.webstorecheckout.com/ls-store/bb1_lampspecs_popup.css\" />";
body+="<script type='text/javascript'>window.top.location='checkout.ssp#confirmation?force=true&last_order_id=" + returnval.confirmationnumber + "';</script></head><body>";
      body += "<button onclick=\"window.top.location='checkout.ssp#confirmation?force=true&last_order_id=" + returnval.confirmationnumber + "';\">Continue</button>";
      body += "<!-- " + JSON.stringify(returnval) + " -->";
      response.writeLine(body);
   } else {
      if (returnval.reasoncode == "ERR_PLACEORDER"&&frame=="true") {
         var body = "";
         body += "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"https://lspecs.eu2.webstorecheckout.com/ls-store/bb1_lampspecs_popup.css\" />";
         body += "</head><body style='font-family:sans-serif;'>";
         body += "<h4>Something went Wrong</h4>";
         body += "<p>Your card has been declined, this can be for a number of reasons. Please check that you have entered the correct credit card number, expiry date and security code. If this does not work please try a different method of payment.</p><p>If you require further assistance please call the sales office on 020 8391 7411.</p>";
         body += "<!-- " + JSON.stringify(returnval) + " -->";
         response.writeLine(body);
      } else {
         response.writeLine(JSON.stringify(returnval));
      }
   }
}