<script>var forceReload = false;var l = 'd:'+new Date().valueOf()+'|';function setCookie(name, value){var now = new Date();var expires = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());document.cookie = escape(name) + '=' + escape(value) + ';expires=' + expires.toGMTString() + ';path=/';}function getCookie(name){var str = document.cookie;var arr = str.split('; ');for (var i=0; i<arr.length; ++i){var c = arr[i].split('=');if (c.length != 2)continue;if (unescape(c[0]) == name)return unescape(c[1]);}return null;}function syncCookie(cookieName, propValue){var c = getCookie(cookieName);l += 'g:'+cookieName+':'+c+'|';if (c != propValue){setCookie(cookieName, propValue);l += 's:'+cookieName+':'+propValue+'|';forceReload = true;}}var d = new Date();var utcOffset = d.getTimezoneOffset();syncCookie('UserUtcOffset', utcOffset);var connSpeed;try { connSpeed = window.external.ClientCaps.connectionType; }catch (e) { connSpeed = "undetected"; }syncCookie('UserConnectionSpeed', connSpeed);try { top.log(l); } catch (e) {}if (forceReload)location.replace(location.href);</script>
<html xmlns:msntv xmlns:IE>
	<?import namespace="msntv" implementation="/HTC/Shared/CustomButton.htc"> 

	<head>
		<title>Home</title>

		<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fBaseClient%2fJsTransforms%2fen-us%2fPaneHelp.xslt&v=1.2.1.322.21" language="javascript" defer="true"></script>

			<link href="/Include.ashx?type=css&target=http%3a%2f%2flocalhost%3a1700%2fHome%2fAnduril%2fCssTransforms%2fen-us%2fHome.xslt&v=1.2.1.322.21" type="text/css" rel="StyleSheet"/>

			<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fHome%2fAnduril%2fJsTransforms%2fen-us%2fHome.xslt&v=1.2.1.322.21" language="javascript"></script>
			
				<?import namespace="msntv" implementation="/Shared/BaseClient/HTCTransforms/en-us/LoopingDIV.htc">
			
			
	</head>
	<body onload="initPage();" scroll="no" tabindex="-1">

		
		<div id="focdiv" style="position:absolute;top:314px;left:27px;width:70px;height:70px;" onclick="goToMail();">
			&nbsp;
		</div>
		<script>document.all["focdiv"].focus();</script>
		
		
		<div class="topdiv">

		
		<div class="textMenu">
			<script xmlns:msntvuxp="msntvuxp.microsoft.com"> function goToService(serviceName){window.location = window.external.SafeGetServiceURL(serviceName);}function goToCenter(URL){window.location = URL;}</script><div style="position:absolute; left:0px; top:0px" xmlns:msntvuxp="msntvuxp.microsoft.com"><table border="0" class="TextMenuTbl"><tr height="34" style="background-color: transparent;"><td class="leftGradientTD"></td><td class="rightGradientTD"></td></tr></table></div><div style="position:absolute; left:0px; top:0px" xmlns:msntvuxp="msntvuxp.microsoft.com"><table border="0" class="TextMenuTbl"><tr><td style="background-color: transparent;" width="8"><img height="1" src="/Images/Shared/s.gif" width="8"></td><td style="background-color: transparent;" align="left" width="162"><a class="TextMenuLink" href="javascript:goToCenter('/Pages/UsingMSNTV/Main.aspx');" id="UsingMSNTVLinkID" onblur="umtvHasFocus=false">Using&nbsp;MSN&nbsp;TV</a></td><div><span style="position:absolute;left:0;top:35px;width:100%;height:2px;background-color:#8fc3d6;"></span></div><td style="background-color: transparent;" align="left" width="115"><a class="TextMenuLink" href="javascript:void(window.open(' ', 'signout', 'msntv:panel'));" id="SignoutLinkID">Sign Out</a></td><div><span style="position:absolute;left:0;top:35px;width:100%;height:2px;background-color:#8fc3d6;"></span></div><td style="background-color: transparent;" align="left" width="106"><a class="TextMenuLink" href="javascript:goToService('UAM::UAMbase');" id="AccountLinkID">Account</a></td><div><span style="position:absolute;left:0;top:35px;width:100%;height:2px;background-color:#8fc3d6;"></span></div><td style="background-color: transparent;" align="left" width="109"><a class="TextMenuLink" href="javascript:goToService('settings::mainindex');" id="SettingsLinkID">Settings</a></td><div><span style="position:absolute;left:0;top:35px;width:100%;height:2px;background-color:#8fc3d6;"></span></div><td style="background-color: transparent;" align="left" width="78"><a href='javascript:CallPaneHelp(PH_TOC);' id="HelpLinkID"><table><tr><td valign="middle" class="TextMenuLinkSimulation">Help</td><td valign="middle" width="30" height="20"><span id="helpIcon"  style='src:url(msntv:/Shared/Images/Icon_Help_RelatedLink.png);'></span></td></tr></table></a></td><div><span style="position:absolute;left:0;top:35px;width:100%;height:2px;background-color:#8fc3d6;"></span></div></tr></table></div>
		</div>

		
		<div class="infoPaneDiv">

		
			<div class="promoImgDiv">
				<div style="position:absolute; left:0px; top:0px"><img id="PromoImageID" width="178" height="135" border="0" hspace="0" alt="Promotional Image" src="/Editorial/Images/1_2346_FindMovieTimes.jpg?content_type=1&amp;imageid=2346"></div><div style="position:absolute; left:5px; top:0px"><a id="PromoImageLinkID" href="http://msntv.msn.com/Pages/Entertainment/Movies.aspx"><table width="173" height="135"><tr><td></td></tr></table></a></div>
			</div>
							
		

			<div ID="timerRotatorDiv" class="personalPanelDiv" onclick="ClickRotator()">
				<div>
					<div style="top:0px; left:0px; width:176px; height:105px;" xmlns:msntvuxp="msntvuxp.microsoft.com"><div class="PNGImage" style="width:176px;height:105px;src:/Images/Home/HomeRotatorBGWeather.png;"></div></div><div style="position:absolute; top:0px; left:0px; width:178px; height:107px;" xmlns:msntvuxp="msntvuxp.microsoft.com"><table class="wthrTbl" border="0" cellpadding="1" cellspacing="0"><tr><td height="4" width="4" rowspan="4"><img src="/Images/Shared/s.gif" height="4" width="4"></td><td height="4" width="45"><img src="/Images/Shared/s.gif" height="4" width="45"></td><td height="4" width="10"><img src="/Images/Shared/s.gif" height="4" width="10"></td><td height="4" width="65"><img src="/Images/Shared/s.gif" height="4" width="65"></td><td height="4" width="10" rowspan="4"><img src="/Images/Shared/s.gif" height="4" width="10"></td></tr><tr><td id="CityCellID" class="wthrCityCell" colspan="3" valign="top"><span class="wthrCityText">San Francisco</span></td></tr><tr><td id="TRCID" class="wthrTempCond"><table><tr><td id="TemperatureCellID" class="wthrTempCell"><span class="wthrTempTxt">49°</span></td></tr><tr><td id="ConditionCellID" class="wthrCondCell"><span class="wthrCondTxt">Fair</span><br><span class="wthrCondTxt"></span></td></tr></table></td><td id="PaddingID" width="10"><img src="/Images/Shared/s.gif" height="1" width="10"></td><td id="ConditionIconID" class="wthrCondIcon"><span class="PNGImage" style="src:/Images/Shared/33.png;width:65px;height:61px;"></span></td></tr><tr><td id="ProviderID" class="wthrProvider" colspan="3">The Weather Channel ®</td></tr></table></div><!--<ROTATOR_FEEDBACK></ROTATOR_FEEDBACK>--><!--<ROTATOR_CLICKTHROUGH>/Pages/Weather/YourCity.aspx</ROTATOR_CLICKTHROUGH>--><script xmlns:msntvuxp="msntvuxp.microsoft.com">function clickPageRotatePanel(){location.href = "/Pages/Weather/YourCity.aspx";}</script>
				</div>
			</div>
			<script>InitRotator(timerRotatorDiv, 5000, new Array("/pages/Home/MoneyModule.aspx","/pages/Home/WeatherModule.aspx"));</script>

		
			<div ID="clockID" class="clockDiv">
			</div>
			<script>clockID.innerHTML = formClockLink();</script>

		
			<div class="newsHdlnDiv">
				<div class="newsHdlnTitleDiv"><span class="newsHdlnTitleText">Today on MSN</span></div><table style="top:0px;left:0px;width:365px;height:78px;"><tr><td><a class="newsHdlnLink" id="newsHdlnLinkID1" href="http://www.msnbc.msn.com/id/10394646/">Iraq hostage deadline looms</a></td></tr><tr><td><a class="newsHdlnLink" id="newsHdlnLinkID2" href="http://www.msnbc.msn.com/id/10407416/">'Bomb' note spurs evacuation</a></td></tr><tr><td><a class="newsHdlnLink" id="newsHdlnLinkID3" href="http://www.msnbc.msn.com/id/10396893/">Airplane skid fears realized</a></td></tr></table><div class="moreNewsDiv"><table><tr><td><img src="msntv:/Shared/Images/BulletCustom.gif" height="14" width="7"></td><td><img src="/Images/Shared/s.gif" height="1" width="4"></td><td style="height:37px"><a id="moreNewsLinkID" class="moreNewsLink" href="http://g.msn.com/5TVANDURIL/1500&#xD;&#xA;">More MSNBC news</a></td></tr></table></div>
			</div>
	
		

		<div class="promoPanelDiv">
			<div style="position:absolute; width:355px; height:70px;"><table style="width:365px;"><td class="promoHdlnTitle" style="color:#1D704C">In Using MSN TV</td><tr><td class="promoHdlnCell"><a class="promoHdlnLink" id="promoHdlnLinkID1" href="http://www.msnbc.msn.com/id/10266057/">Tasty holiday brunch recipes</a></td></tr><tr><td class="promoHdlnCell"><a class="promoHdlnLink" id="promoHdlnLinkID2" href="http://msntv.msn.com/Pages/UsingMSNTV/TipPage.aspx?id=mus4">Surf to holiday tunes</a></td></tr></table></div><div style="position:absolute; left:161px; top:74px; width:200px;"><table class="MoreUsingLinkTable"><tr><td><img src="msntv:/Shared/Images/BulletCustom.gif" height="14" width="7"></td><td><img src="/Images/Shared/s.gif" height="1" width="4"></td><td><a id="MoreUsingLinkID" class="MoreNewsLink" href="http://g.msn.com/5TVANDURIL/1485&#xD;&#xA;">Go to Using MSN TV</a></td></tr></table></div>
		</div>
	</div>

	
			<div id="searchID" class="searchDiv">
				
				<div class="searchCenterDiv">
					<script>function doSearch(country){if (searchFormID.searchFieldID.value == ""){window.location = window.external.SafeGetServiceURL('search::search'); + "?FORM=WEBTV&cfg=MSTVXML&v=1&c="+country+"&x=26&y=14";}else
				</div>	
			</div>	

	
			<div id="iconNavBarID" class="iconNavBar">
 				<table class="iconNavBarMasterTbl">
					<tr>
						<td align="center" valign="middle">
	 						<table class="iconNavBarTbl">
								<tr>
									<td class="iconNavBarTblFrameCell">
									<table class="ApolloIcons" xmlns:msntv="http://tv.msn.com"><tr height="70"><td><msntv:loopingDIV id="navbar" hasInitialFocus="true" divWidthPX="554" /></td></tr><script>var nIcons;var ImgURL = new Array();var ImgWidth = new Array();var ImgOverURL = new Array();var URL = new Array(); function goToFavorites(){window.open(" ", "favoritespanel", "msntv:panel");}function goToMessenger(){if (window.external.SafeGetServiceURL('messenger::root') != null &&window.external.SafeGetServiceURL('messenger::root') != "" )window.open(" ", "impanel", "msntv:panel");else
									</td>
								</tr>
							</table>
						</td>						
					</tr>
				</table>
			</div>	

	
		<script>
			function callCGif()
			{
				var i = new Image();
				i.src = "http://c.msn.com/c.gif?DI=1455&PI=68206&PS=45577&TP=http://msntv.msn.com/HomePage.htm&RF=";
			}
			window.attachEvent("onload", callCGif); 			
		</script> 

		</div>
	</body>
</html>