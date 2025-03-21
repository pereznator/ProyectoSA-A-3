const getEmailHTML = (id) => {
  return `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <!-- NAME: CASL SUBSCRIBER ALERT -->
          <!--[if gte mso 15]>
          <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>*|MC:SUBJECT|*</title>
          
  
  
          <!-- ////// OUTLOOK-SPECIFIC STYLES ///// -->
          <!--[if gte mso 7]>
          <style type="text/css">
          </style>
          <![endif]-->
      <style type="text/css">
          p{
              margin:10px 0;
              padding:0;
          }
          table{
              border-collapse:collapse;
          }
          h1,h2,h3,h4,h5,h6{
              display:block;
              margin:0;
              padding:0;
          }
          img,a img{
              border:0;
              height:auto;
              outline:none;
              text-decoration:none;
          }
          body,#bodyTable,#bodyCell{
              height:100%;
              margin:0;
              padding:0;
              width:100%;
          }
          .mcnPreviewText{
              display:none !important;
          }
          #outlook a{
              padding:0;
          }
          img{
              -ms-interpolation-mode:bicubic;
          }
          table{
              mso-table-lspace:0pt;
              mso-table-rspace:0pt;
          }
          .ReadMsgBody{
              width:100%;
          }
          .ExternalClass{
              width:100%;
          }
          p,a,li,td,blockquote{
              mso-line-height-rule:exactly;
          }
          a[href^=tel],a[href^=sms]{
              color:inherit;
              cursor:default;
              text-decoration:none;
          }
          p,a,li,td,body,table,blockquote{
              -ms-text-size-adjust:100%;
              -webkit-text-size-adjust:100%;
          }
          .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
              line-height:100%;
          }
          a[x-apple-data-detectors]{
              color:inherit !important;
              text-decoration:none !important;
              font-size:inherit !important;
              font-family:inherit !important;
              font-weight:inherit !important;
              line-height:inherit !important;
          }
          a.mcnButton{
              display:block;
          }
          .mcnImage,.mcnRetinaImage{
              vertical-align:bottom;
          }
          .mcnTextContent{
              word-break:break-word;
          }
          .mcnTextContent img{
              height:auto !important;
          }
          .mcnDividerBlock{
              table-layout:fixed !important;
          }
      /*
      @tab Page
      @section background style
      @tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
      */
          body,#bodyTable{
              /*@editable*/background-color:#F2F2F2;
          }
      /*
      @tab Page
      @section background style
      @tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
      */
          #bodyCell{
              /*@editable*/border-top:5px solid #FFFFFF;
          }
      /*
      @tab Page
      @section heading 1
      @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
      @style heading 1
      */
          h1{
              /*@editable*/color:#FFFFFF !important;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:26px;
              /*@editable*/font-style:normal;
              /*@editable*/font-weight:bold;
              /*@editable*/line-height:125%;
              /*@editable*/letter-spacing:normal;
              /*@editable*/text-align:left;
          }
      /*
      @tab Page
      @section heading 2
      @tip Set the styling for all second-level headings in your emails.
      @style heading 2
      */
          h2{
              /*@editable*/color:#FFFFFF !important;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:22px;
              /*@editable*/font-style:normal;
              /*@editable*/font-weight:bold;
              /*@editable*/line-height:125%;
              /*@editable*/letter-spacing:normal;
              /*@editable*/text-align:left;
          }
      /*
      @tab Page
      @section heading 3
      @tip Set the styling for all third-level headings in your emails.
      @style heading 3
      */
          h3{
              /*@editable*/color:#D55258 !important;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:18px;
              /*@editable*/font-style:normal;
              /*@editable*/font-weight:bold;
              /*@editable*/line-height:125%;
              /*@editable*/letter-spacing:normal;
              /*@editable*/text-align:left;
          }
      /*
      @tab Page
      @section heading 4
      @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.
      @style heading 4
      */
          h4{
              /*@editable*/color:#D55258 !important;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:16px;
              /*@editable*/font-style:normal;
              /*@editable*/font-weight:bold;
              /*@editable*/line-height:125%;
              /*@editable*/letter-spacing:normal;
              /*@editable*/text-align:left;
          }
      /*
      @tab Preheader
      @section preheader style
      @tip Set the background color and borders for your email's preheader area.
      */
          #templatePreheader{
              /*@editable*/background-color:#F2F2F2;
              /*@editable*/border-top:0;
              /*@editable*/border-bottom:0;
          }
      /*
      @tab Preheader
      @section preheader text
      @tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
      */
          .preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{
              /*@editable*/color:#404040;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:12px;
              /*@editable*/line-height:125%;
              /*@editable*/text-align:left;
          }
      /*
      @tab Preheader
      @section preheader link
      @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
      */
          .preheaderContainer .mcnTextContent a{
              /*@editable*/color:#404040;
              /*@editable*/font-weight:normal;
              /*@editable*/text-decoration:underline;
          }
      /*
      @tab Header
      @section header style
      @tip Set the background color and borders for your email's header area.
      */
          #templateHeader{
              /*@editable*/background-color:#F2F2F2;
              /*@editable*/border-top:0;
              /*@editable*/border-bottom:0;
          }
      /*
      @tab Header
      @section header container
      @tip Set the background color and bottom border for your email's header text container.
      */
          .headerFrontBackground,.headerRearBackground{
              /*@editable*/background-color:#D55258;
          }
      /*
      @tab Header
      @section header container
      @tip Set the background color and bottom border for your email's header text container.
      */
          .headerFrontBackground{
              /*@editable*/border-bottom:2px solid #BD4046;
          }
      /*
      @tab Header
      @section header text
      @tip Set the styling for your email's header text. Choose a size and color that is easy to read.
      */
          .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
              /*@editable*/color:#FFFFFF;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:16px;
              /*@editable*/line-height:150%;
              /*@editable*/text-align:left;
          }
      /*
      @tab Header
      @section header link
      @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
      */
          .headerContainer .mcnTextContent a{
              /*@editable*/color:#FFFFFF;
              /*@editable*/font-weight:normal;
              /*@editable*/text-decoration:underline;
          }
      /*
      @tab Body
      @section body style
      @tip Set the background color and borders for your email's body area.
      */
          #templateBody{
              /*@editable*/background-color:#F2F2F2;
              /*@editable*/border-top:0;
              /*@editable*/border-bottom:0;
          }
      /*
      @tab Body
      @section body text
      @tip Set the styling for your email's body text. Choose a size and color that is easy to read.
      */
          .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
              /*@editable*/color:#606060;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:14px;
              /*@editable*/line-height:150%;
              /*@editable*/text-align:left;
          }
      /*
      @tab Body
      @section body link
      @tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.
      */
          .bodyContainer .mcnTextContent a{
              /*@editable*/color:#D55258;
              /*@editable*/font-weight:normal;
              /*@editable*/text-decoration:underline;
          }
      /*
      @tab Footer
      @section footer style
      @tip Set the background color and borders for your email's footer area.
      */
          #templateFooter{
              /*@editable*/background-color:#F2F2F2;
              /*@editable*/border-top:0;
              /*@editable*/border-bottom:0;
          }
      /*
      @tab Footer
      @section footer text
      @tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
      */
          .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
              /*@editable*/color:#AAAAAA;
              /*@editable*/font-family:Helvetica;
              /*@editable*/font-size:10px;
              /*@editable*/line-height:125%;
              /*@editable*/text-align:center;
          }
      /*
      @tab Footer
      @section footer link
      @tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
      */
          .footerContainer .mcnTextContent a{
              /*@editable*/color:#AAAAAA;
              /*@editable*/font-weight:normal;
              /*@editable*/text-decoration:underline;
          }
      @media only screen and (max-width: 480px){
          body,table,td,p,a,li,blockquote{
              -webkit-text-size-adjust:none !important;
          }
  
  }	@media only screen and (max-width: 480px){
          body{
              width:100% !important;
              min-width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .templateContainer{
              max-width:600px !important;
              width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnRetinaImage{
              max-width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImage{
              width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
              max-width:100% !important;
              width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnBoxedTextContentContainer{
              min-width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageGroupContent{
              padding:9px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
              padding-top:9px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
              padding-top:18px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageCardBottomImageContent{
              padding-bottom:9px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageGroupBlockInner{
              padding-top:0 !important;
              padding-bottom:0 !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageGroupBlockOuter{
              padding-top:9px !important;
              padding-bottom:9px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnTextContent,.mcnBoxedTextContentColumn{
              padding-right:18px !important;
              padding-left:18px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
              padding-right:18px !important;
              padding-bottom:0 !important;
              padding-left:18px !important;
          }
  
  }	@media only screen and (max-width: 480px){
          .mcpreview-image-uploader{
              display:none !important;
              width:100% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section heading 1
      @tip Make the first-level headings larger in size for better readability on small screens.
      */
          h1{
              /*@editable*/font-size:24px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section heading 2
      @tip Make the second-level headings larger in size for better readability on small screens.
      */
          h2{
              /*@editable*/font-size:20px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section heading 3
      @tip Make the third-level headings larger in size for better readability on small screens.
      */
          h3{
              /*@editable*/font-size:18px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section heading 4
      @tip Make the fourth-level headings larger in size for better readability on small screens.
      */
          h4{
              /*@editable*/font-size:16px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section Boxed Text
      @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
      */
          .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
              /*@editable*/font-size:18px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section Preheader Visibility
      @tip Set the visibility of the email's preheader on small screens. You can hide it to save space.
      */
          #templatePreheader{
              /*@editable*/display:block !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section Preheader Text
      @tip Make the preheader text larger in size for better readability on small screens.
      */
          .preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{
              /*@editable*/font-size:14px !important;
              /*@editable*/line-height:115% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section Header Text
      @tip Make the header text larger in size for better readability on small screens.
      */
          .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
              /*@editable*/font-size:18px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section Body Text
      @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
      */
          .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
              /*@editable*/font-size:18px !important;
              /*@editable*/line-height:125% !important;
          }
  
  }	@media only screen and (max-width: 480px){
      /*
      @tab Mobile Styles
      @section footer text
      @tip Make the body content text larger in size for better readability on small screens.
      */
          .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
              /*@editable*/font-size:14px !important;
              /*@editable*/line-height:115% !important;
          }
  
  }</style>
  <script>!function(){function o(n,i){if(n&&i)for(var r in i)i.hasOwnProperty(r)&&(void 0===n[r]?n[r]=i[r]:n[r].constructor===Object&&i[r].constructor===Object?o(n[r],i[r]):n[r]=i[r])}try{var n=decodeURIComponent("%7B%0A%20%20%20%20%20%22ResourceTiming%22%3A%7B%0A%20%20%20%20%20%20%20%20%20%20%20%22comment%22%3A%20%22Clear%20RT%20Buffer%20on%20mPulse%20beacon%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22clearOnBeacon%22%3A%20true%0A%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%22AutoXHR%22%3A%7B%0A%20%20%20%20%20%20%20%20%20%20%20%22comment%22%3A%20%22Monitor%20XHRs%20requested%20using%20FETCH%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22monitorFetch%22%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22comment%22%3A%20%22Start%20Monitoring%20SPAs%20from%20Click%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22spaStartFromClick%22%3A%20true%0A%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%22PageParams%22%3A%7B%0A%20%20%20%20%20%20%20%20%20%20%20%22comment%22%3A%20%22Monitor%20all%20SPA%20XHRs%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%22spaXhr%22%3A%20%22all%22%0A%20%20%20%20%20%7D%0A%7D");if(n.length>0&&window.JSON&&"function"==typeof window.JSON.parse){var i=JSON.parse(n);void 0!==window.BOOMR_config?o(window.BOOMR_config,i):window.BOOMR_config=i}}catch(r){window.console&&"function"==typeof window.console.error&&console.error("mPulse: Could not parse configuration",r)}}();</script>
                                <script>!function(a){var e="https://s.go-mpulse.net/boomerang/",t="addEventListener";if("True"=="True")a.BOOMR_config=a.BOOMR_config||{},a.BOOMR_config.PageParams=a.BOOMR_config.PageParams||{},a.BOOMR_config.PageParams.pci=!0,e="https://s2.go-mpulse.net/boomerang/";if(window.BOOMR_API_key="QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA",function(){function n(e){a.BOOMR_onload=e&&e.timeStamp||(new Date).getTime()}if(!a.BOOMR||!a.BOOMR.version&&!a.BOOMR.snippetExecuted){a.BOOMR=a.BOOMR||{},a.BOOMR.snippetExecuted=!0;var i,_,o,r=document.createElement("iframe");if(a[t])a[t]("load",n,!1);else if(a.attachEvent)a.attachEvent("onload",n);r.src="javascript:void(0)",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="width:0;height:0;border:0;display:none;",o=document.getElementsByTagName("script")[0],o.parentNode.insertBefore(r,o);try{_=r.contentWindow.document}catch(O){i=document.domain,r.src="javascript:var d=document.open();d.domain='"+i+"';void(0);",_=r.contentWindow.document}_.open()._l=function(){var a=this.createElement("script");if(i)this.domain=i;a.id="boomr-if-as",a.src=e+"QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA",BOOMR_lstart=(new Date).getTime(),this.body.appendChild(a)},_.write("<bo"+'dy onload="document._l();">'),_.close()}}(),"400".length>0)if(a&&"performance"in a&&a.performance&&"function"==typeof a.performance.setResourceTimingBufferSize)a.performance.setResourceTimingBufferSize(400);!function(){if(BOOMR=a.BOOMR||{},BOOMR.plugins=BOOMR.plugins||{},!BOOMR.plugins.AK){var e=""=="true"?1:0,t="",n="xy4hloaxhu2oazqplvzq-f-c5cba4afb-clientnsv4-s.akamaihd.net",i="false"=="true"?2:1,_={"ak.v":"37","ak.cp":"405185","ak.ai":parseInt("307432",10),"ak.ol":"0","ak.cr":194,"ak.ipv":4,"ak.proto":"h2","ak.rid":"721c2d8f","ak.r":47629,"ak.a2":e,"ak.m":"x","ak.n":"essl","ak.bpcip":"190.56.117.0","ak.cport":44426,"ak.gh":"23.44.6.166","ak.quicv":"","ak.tlsv":"tls1.3","ak.0rtt":"","ak.csrc":"-","ak.acc":"","ak.t":"1712282995","ak.ak":"hOBiQwZUYzCg5VSAfCLimQ==w+DQv+iYDXUpr7Bgaf2C7chv5ewgpHXaoBcOZG84IWG9lN64qB/zeQE0RgGcmBhHcMFpWGMmbSrqdGvGSOGzaWe80ISGyj1Z4FhV6ah4wrNWs6KKhgNm3LifBTJTOmeY1bHDEuWEKhNApLWWV5UnaD+uUtA4rxzrd+KAwI0CRY9vEFN5hdYMzW1Is12oMXVXzDm4gx3p88fJ691+vd0kGKiCMGYe0K1OHc+Nj1ZylZ0yx/TVXyeLTdEKFLD11K9w9wD62BGua+XtMisQXXGUV3gNfdUWcROKqEnlSlGQY+Gf82E6ROPinoTi41VcBAWJ0EMU6bXE9bL/btXMJ2zoAOoGHBh5cZX5cVL0WYb5uZgkeYkoOjZGKGn5tarTe+mHtoN3/c0G1KFx7Swc9HKkP147GeTaXexrWykBo7fA7kw=","ak.pv":"76","ak.dpoabenc":"","ak.tf":i};if(""!==t)_["ak.ruds"]=t;var o={i:!1,av:function(e){var t="http.initiator";if(e&&(!e[t]||"spa_hard"===e[t]))_["ak.feo"]=void 0!==a.aFeoApplied?1:0,BOOMR.addVar(_)},rv:function(){var a=["ak.bpcip","ak.cport","ak.cr","ak.csrc","ak.gh","ak.ipv","ak.m","ak.n","ak.ol","ak.proto","ak.quicv","ak.tlsv","ak.0rtt","ak.r","ak.acc","ak.t","ak.tf"];BOOMR.removeVar(a)}};BOOMR.plugins.AK={akVars:_,akDNSPreFetchDomain:n,init:function(){if(!o.i){var a=BOOMR.subscribe;a("before_beacon",o.av,null,null),a("onbeacon",o.rv,null,null),o.i=!0}return this},is_complete:function(){return!0}}}}()}(window);</script></head>
      <body>
          <!--*|IF:MC_PREVIEW_TEXT|*-->
          <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->
          <!--*|END:IF|*-->
          <center>
              <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                  <tr>
                      <td align="center" valign="top" id="bodyCell">
                          <!-- BEGIN TEMPLATE // -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                  <td align="center" valign="top">
                                      <!-- BEGIN PREHEADER // -->
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templatePreheader">
                                          <tr>
                                              <td align="center" valign="top">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer">
                                                      <tr>
                                                          <td valign="top" class="preheaderContainer" style="padding-top:10px; padding-bottom:10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                  <tr>
                  <![endif]-->
                  
                  <!--[if mso]>
                  <td valign="top" width="600" style="width:600px;">
                  <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                          
                              <div style="text-align: center;"><strong>CIBERVIDEOGAME</strong></div>
  
                          </td>
                      </tr>
                  </tbody></table>
                  <!--[if mso]>
                  </td>
                  <![endif]-->
                  
                  <!--[if mso]>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
      </tbody>
  </table></td>
                                                      </tr>
                                                  </table>
                                              </td>                                            
                                          </tr>
                                      </table>
                                      <!-- // END PREHEADER -->
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top">
                                      <!-- BEGIN HEADER // -->
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateHeader">
                                          <tr>
                                              <td align="center" valign="top" style="padding-top:20px; padding-bottom:20px;">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer">
                                                      <tr>
                                                          <td align="center" height="10" valign="top" width="10">
                                                              <img src="https://cdn-images.mailchimp.com/template_images/gallery/d4042106-8117-4b79-b76b-91f8d64c5dff.gif" height="10" width="10" style="display:block; line-height:0px;">
                                                          </td>
                                                          <td align="center" height="10" valign="top" class="headerRearBackground" style="opacity:0.5;">
                                                              <img src="https://cdn-images.mailchimp.com/template_images/gallery/640a7ee0-db88-4905-a550-89e571c94697.png" class="mcnImage" height="10" width="580" style="display:block; line-height:0px;">
                                                          </td>
                                                          <td align="center" height="10" valign="top" width="10">
                                                              <img src="https://cdn-images.mailchimp.com/template_images/gallery/d4042106-8117-4b79-b76b-91f8d64c5dff.gif" height="10" width="10" style="display:block; line-height:0px;">
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="center" colspan="3" valign="top">
                                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="headerFrontBackground">
                                                                  <tr>
                                                                      <td align="center" valign="top">
                                                                          <!-- BEGIN HEADER // -->
                                                                          <table border="0" cellpadding="0" cellspacing="0" width="100%" id="">
                                                                              <tr>
                                                                                  <td valign="top" class="headerContainer" style="padding-top:20px; padding-bottom:20px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                  <tr>
                  <![endif]-->
                  
                  <!--[if mso]>
                  <td valign="top" width="600" style="width:600px;">
                  <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                          
                              <h1>RECUPERAR CONTRASEÑA</h1>
  
                          </td>
                      </tr>
                  </tbody></table>
                  <!--[if mso]>
                  </td>
                  <![endif]-->
                  
                  <!--[if mso]>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
      </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                  <tr>
                  <![endif]-->
                  
                  <!--[if mso]>
                  <td valign="top" width="600" style="width:600px;">
                  <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                          
                              Usted está recibiendo este correo ya que se nos notificó que ud. perdió su contraseña.<br>
  <br>
  Para recuperar su contraseña, haga click en el botón blanco de abajo y este le redireccionará hacia una página donde podrá recuperar su contraseña.<br>
  <br>
  <br>
  Si usted considera que este es un error, simplemente ignore este correo.
                          </td>
                      </tr>
                  </tbody></table>
                  <!--[if mso]>
                  </td>
                  <![endif]-->
                  
                  <!--[if mso]>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
      </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
      <tbody class="mcnButtonBlockOuter">
          <tr>
              <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                  <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border: 2px solid #F2F2F2;border-radius: 4px;background-color: #FFFFFF;">
                      <tbody>
                          <tr>
                              <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 16px; padding: 20px;">
                                  <a class="mcnButton " title="CAMBIAR CONTRASEÑA" href="http://localhost:4200/auth/recovery/${id}" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #D55258;">CAMBIAR CONTRASEÑA</a>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table></td>
                                                                              </tr>
                                                                          </table>
                                                                          <!-- // END HEADER -->
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                      <!-- // END HEADER -->
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top">
                                      <!-- BEGIN BODY // -->
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateBody">
                                          <tr>
                                              <td align="center" valign="top">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer">
                                                      <tr>
                                                          <td valign="top" class="bodyContainer" style="padding-top:10px; padding-bottom:10px;"></td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                      <!-- // END BODY -->
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="padding-bottom:40px;">
                                      <!-- BEGIN FOOTER // -->
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateFooter">
                                          <tr>
                                              <td align="center" valign="top">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="600" class="templateContainer">
                                                      <tr>
                                                          <td valign="top" class="footerContainer" style="padding-top:10px; padding-bottom:10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
      <tbody class="mcnDividerBlockOuter">
          <tr>
              <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                  <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 1px solid #AAAAAA;">
                      <tbody><tr>
                          <td>
                              <span></span>
                          </td>
                      </tr>
                  </tbody></table>
  <!--            
                  <td class="mcnDividerBlockInner" style="padding: 18px;">
                  <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
  -->
              </td>
          </tr>
      </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                  <tr>
                  <![endif]-->
                  
                  <!--[if mso]>
                  <td valign="top" width="600" style="width:600px;">
                  <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                          
                              <em>Copyright © CiberVideoGame, All rights reserved.</em><br>
  &nbsp;
                          </td>
                      </tr>
                  </tbody></table>
                  <!--[if mso]>
                  </td>
                  <![endif]-->
                  
                  <!--[if mso]>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
      </tbody>
  </table></td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                      <!-- // END FOOTER -->
                                  </td>
                              </tr>
                          </table>
                          <!-- // END TEMPLATE -->
                      </td>
                  </tr>
              </table>
          </center>
      <script type="text/javascript"  src="/rMux9lGSpcM2LRWJAdIA2kDi/Ju9tt6bQpfiS/TiMYOnwD/VjNwc/TQhOBs"></script></body>
  </html>
  
    `;
};

module.exports = { getEmailHTML };
