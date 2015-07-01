// ==UserScript==
// @name         NavyFederal Secure Login
// @namespace    https://horner.tj/
// @version      0.3
// @description  A secure autofill for Navy Federal
// @author       TJ Horner
// @match        *://*.navyfederal.org/*
// @require      https://raw.githubusercontent.com/mdp/gibberish-aes/master/dist/gibberish-aes-1.0.0.min.js
// @require      https://code.jquery.com/jquery.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
 
SecureLogin = (function(){
  if($("#logon").length || $("#Login").length){
    if(!GM_getValue("nfed_crypto_p")){
      var tempPhrase = prompt("NFed Secure Login\n" + 
                              "Please enter a secure passphrase used to encrypt your username and password:");
      alert("Passphrase set, sign in normally.");
      var credSet = false;
      $("#logon, #Login").submit(function(e){
        if(!credSet)
          e.preventDefault();
        GM_setValue("nfed_crypto_p", GibberishAES.enc($("#password").val(), tempPhrase));
        GM_setValue("nfed_crypto_u", GibberishAES.enc($("#user").val(), tempPhrase));
        alert("NFed Secure Login credentials saved, next time you login, type in the passphrase you chose earlier.");
        credSet = true;
        $("#logon, #Login").submit();
      });
    }else{
      var p = GM_getValue("nfed_crypto_p"),
          u = GM_getValue("nfed_crypto_u"),
          passphrase = prompt("Enter key passphrase:");
      
      try{
        $("body").append("<style>#overlay{text-align:center;position:fixed;padding-top:50px;font-size:3em;color:white;top:0;left:0;width:100%;height:100%;background-color:#000;filter:alpha(opacity=50);-moz-opacity:.5;-khtml-opacity:.5;opacity:.5;z-index:10000}</style>");
        
        var $overlay = $("<div>");
        var $overlayButton = $("<a>");
        
        $overlayButton.text("Cancel")
                      .css("cursor", "pointer")
                      .click(function(){
                        $overlay.fadeOut();
                      });
        
        $overlay.attr("id", "overlay")
                .append("Logging you in securely...<br><br>")
                .append($overlayButton);
        
        $("body").append($overlay);
        
        var pass = GibberishAES.dec(p, passphrase),
            user = GibberishAES.dec(u, passphrase);
        $("#user").val(user);
        $("#password").val(pass);
        $($("#logon")[0]).submit();
        $($("#Login")[0]).submit();
      }catch(e){
        alert(e);
      }  
    }
  }
}());
