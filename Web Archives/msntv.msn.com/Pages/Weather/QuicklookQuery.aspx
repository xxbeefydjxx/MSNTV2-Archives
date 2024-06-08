

<html xmlns:msntv>
	<?import namespace="msntv" implementation="/HTC/Shared/CustomButton.htc"> 
	<?import namespace="msntv" implementation="/Shared/Anduril/HTC/en-us/TruncatedHtml.htc">
	<head>
		<title>MSNTV Weather</title>

		<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fBaseClient%2fJsTransforms%2fen-us%2fPaneHelp.xslt&v=2.0.261.778" language="javascript" defer="true"></script>

		<link href="/Include.ashx?type=css&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fCssTransforms%2fen-us%2fStyles.xslt&v=2.0.261.778" type="text/css" rel="StyleSheet"/>
		<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fJsTransforms%2fen-us%2fScripts.xslt&v=2.0.261.778" language="javascript"></script>
	</head>
	<body>
		<table cellpadding="0" cellspacing="0" class="cntr">
			<tr class="cntrHdr">
				
				<td valign="top" colspan="2" class="cntrHdrWthr">
					<table class="cntrHdr" cellpadding="0" cellspacing="0" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr class="cntrHdrR1"><td valign="bottom"><span class="cntrHdrLnks"></span><img width="4" height="1" src="/Images/Shared/s.gif"><span class="cntrHdrHlp"><a href="javascript:CallPaneHelp(PH_TOC);" id="HelpLinkID" class="helpLink">Help<span id="helpIcon" style="src:url(msntv:/Shared/Images/Icon_Help_RelatedLink.png);"></span></a></span><img width="8" height="1" src="/Images/Shared/s.gif"></td></tr><tr class="cntrHdrR2"><td valign="top"><span class="cntrHdr"><span style="font-weight:600" class="hdrTxtWthr">Weather</span><img width="12" height="1" src="/Images/Shared/s.gif"><span class="cntrHdr2">Quick lookup</span></span></td></tr></table><div class="cntrHdr2" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"></div>
				</td>
			</tr>
			<tr class="cntrBdy">
				
				<td valign="top" class="cntrSdbrWthr">
					<table cellpadding="0" cellspacing="0" border="0" class="sdbr" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr><td class="sbDiv1Wthr"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td><a class="sbBtnLnk" href="../Weather/YourCity.aspx" id="topSidebarItem">My City</a></td></tr><tr><td class="sbDiv1Wthr"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td class="sbBtnHlFntWthr" style="background:#E8E9EA;font-weight:bold">Quick Lookup</td></tr><tr><td class="sbDiv1Wthr"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td><a class="sbBtnLnk" href="../Weather/OtherCities.aspx">More Cities</a></td></tr><tr><td class="sbDiv1Wthr"></td></tr><tr><td class="sbDiv2"></td></tr><tr><td><img width="151" height="1" src="/Images/Shared/s.gif"></td></tr></table><table cellpadding="5" cellspacing="0" class="sdbrRl" style="background-color:D3DEE0;border-color:468EA2" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr><td><b>Related Links:</b></td></tr><tr><td><a class="sbBtnLnk" href="../News/TopStories.aspx">News</a></td></tr></table><script xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">document.all["topSidebarItem"].focus();</script>
				</td>
				
				<td valign="top" class="cntrCnt">
					<table id="_ctl0__ctl0_contentRegion_contentRegion" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td>
	
		<script xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">function quickLook(){var f = document.quicklook;var q = f.elements["q"].value;if (!validCityStateEntry(q)){alert("Type a ZIP code that contains numbers only.");}else{f.submit();}}</script><form name="quicklook" onsubmit="quickLook();return false" action="../Shared/Settings.aspx" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><input type="hidden" name="pid" value="QuickLookWeatherResult"><table cellpadding="5" cellspacing="0" class="cntntTbl" border="0"><tr class="shrTxt"><td colspan="2">To see the weather forecast for a city, type the city name or ZIP code in the box below, and then choose <b>Get Forecast</b>.</td></tr><tr><td colspan="2"><input class="shrStngInpt" name="q" type="text" size="35" id="qlinput"></td></tr><tr><td colspan="2">Example: San Francisco, CA or 94117</td></tr><tr><td style="text-align:right;padding-top:15"><input type="button" id="symbol" onClick="javascript:location.href='../Weather/YourCity.aspx'" value="Cancel" /><img src="/Images/Shared/s.gif" height="1" width="15"><input type="button" id="symbol" onClick="quickLook();" value="Get Forecast" /></td></tr></table></form><script xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">document.all["qlinput"].focus();</script>			
		

<SCRIPT LANGUAGE=Javascript SRC="msntv:/Shared/Javascript/PreCache.js"></SCRIPT>

<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fJsTransforms%2fen-us%2fUtil.xslt&v=2.0.261.778" language="javascript"></script>

<!-- cgif tracking: load the cGif after the document loads -->     
<script>
	RegisterOnLoad(function() { callCGif("http://c.msn.com/c.gif?DI=1455&PI=68206&PS=73435&TP=http://msntv.msn.com/Weather/QuickLookup.htm&RF=http://msntv.msn.com/Pages/Weather/YourCity.aspx"); } );
</script>



	
</td></tr></table>
				</td>					
			</tr>
		</table>
	</body>
</html>


	

