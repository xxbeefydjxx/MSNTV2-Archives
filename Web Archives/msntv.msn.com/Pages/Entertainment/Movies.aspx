<script>var forceReload = false;var l = 'd:'+new Date().valueOf()+'|';function setCookie(name, value){var now = new Date();var expires = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());document.cookie = escape(name) + '=' + escape(value) + ';expires=' + expires.toGMTString() + ';path=/';}function getCookie(name){var str = document.cookie;var arr = str.split('; ');for (var i=arr.length-1; i>=0; i--){var c = arr[i].split('=');if (c.length != 2)continue;if (unescape(c[0]) == name)return unescape(c[1]);}return null;}function syncCookie(cookieName, propValue){var c = getCookie(cookieName);l += 'g:'+cookieName+':'+c+'|';if (c != propValue){setCookie(cookieName, propValue);l += 's:'+cookieName+':'+propValue+'|';var check = getCookie(cookieName);if(check == propValue)forceReload = true;}}var d = new Date();var utcOffset = d.getTimezoneOffset();syncCookie('UserUtcOffset', utcOffset);var connSpeed;try { connSpeed = window.external.ClientCaps.connectionType; }catch (e) { connSpeed = "undetected"; }syncCookie('UserConnectionSpeed', connSpeed);try { top.log(l); } catch (e) {}if (forceReload)location.replace(location.href);</script>

<html xmlns:msntv>
	<?import namespace="msntv" implementation="/HTC/Shared/CustomButton.htc"> 
	<?import namespace="msntv" implementation="/Shared/Anduril/HTC/en-us/TruncatedHtml.htc">
	<head>
		<title>MSNTV Entertainment</title>

		<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fBaseClient%2fJsTransforms%2fen-us%2fPaneHelp.xslt&v=2.0.261.788" language="javascript" defer="true"></script>

		<link href="/Include.ashx?type=css&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fCssTransforms%2fen-us%2fStyles.xslt&v=2.0.261.788" type="text/css" rel="StyleSheet"/>
		<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fJsTransforms%2fen-us%2fScripts.xslt&v=2.0.261.788" language="javascript"></script>
	</head>
	<body>
		<table cellpadding="0" cellspacing="0" class="cntr">
			<tr class="cntrHdr">
				
				<td valign="top" colspan="2" class="cntrHdrEnt">
					<table class="cntrHdr" cellpadding="0" cellspacing="0" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr class="cntrHdrR1"><td valign="bottom"><span class="cntrHdrLnks"></span><img width="4" height="1" src="/Images/Shared/s.gif"><span class="cntrHdrHlp"><a href="javascript:CallPaneHelp(PH_TOC);" id="HelpLinkID" class="helpLink">Help<span id="helpIcon" style="src:url(msntv:/Shared/Images/Icon_Help_RelatedLink.png);"></span></a></span><img width="8" height="1" src="/Images/Shared/s.gif"></td></tr><tr class="cntrHdrR2"><td valign="top"><span class="cntrHdr"><span style="font-weight:600" class="hdrTxtEnt">Entertainment</span><img width="12" height="1" src="/Images/Shared/s.gif"><span class="cntrHdr2">Movies</span></span></td></tr></table><div class="cntrHdr2" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"></div>
				</td>
			</tr>
			<tr class="cntrBdy">
				
				<td valign="top" class="cntrSdbrEnt">
					<table cellpadding="0" cellspacing="0" border="0" class="sdbr" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr><td class="sbDiv1Ent"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td><a class="sbBtnLnk" href="../Entertainment/Home.aspx" id="topSidebarItem">Main</a></td></tr><tr><td class="sbDiv1Ent"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td><a class="sbBtnLnk" href="../Entertainment/TV.aspx">TV</a></td></tr><tr><td class="sbDiv1Ent"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td class="sbBtnHlFntEnt" style="background:#E8E9EA;font-weight:bold">Movies</td></tr><tr><td class="sbDiv1Ent"></td></tr><tr><td class="sbDiv2"></td></tr><tr class="sbBtn"><td><a class="sbBtnLnk" href="../Entertainment/Celebrities.aspx">Celebrities</a></td></tr><tr><td class="sbDiv1Ent"></td></tr><tr><td class="sbDiv2"></td></tr><tr><td><img width="151" height="1" src="/Images/Shared/s.gif"></td></tr></table><table cellpadding="5" cellspacing="0" class="sdbrRl" style="background-color:DAE2E9;border-color:4797BF" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com"><tr><td><b>Related Links:</b></td></tr><tr><td><a class="sbBtnLnk" href="javascript:window.location = window.external.SafeGetServiceURL('Music::Home');">Music</a></td></tr><tr><td><a class="sbBtnLnk" href="../radio/home.aspx">Radio</a></td></tr></table><script xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">document.all["topSidebarItem"].focus();</script>
				</td>
				
				<td valign="top" class="cntrCnt">
					<table id="_ctl0__ctl0_contentRegion_contentRegion" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td>
	
		<!-- broadband module -->
		

		<!-- "Find movies" ZIP code entry and Featured Movie Selections -->
		<script>function quickLook(){var f = document.quicklook;var q = f.elements["q"].value;if (!validCityStateEntry(q)){alert("Enter a valid ZIP code");}else{f.submit();}}</script><form id="findMovieFormID" name="quicklook" onsubmit="quickLook();return false" action="../Shared/Settings.aspx"><input type="hidden" name="pid" value="QuickLookTheaterResult"><table class="entTvPt"><tr><td style="width:100%;"><div class="cntntTtlEnt" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">Find local movie showtimes</div></td></tr><tr><td><table><tr><td>Enter city name or ZIP code:</td><td valign="middle"><input id="findMovieInputID" class="shrStngInpt" type="text" name="q" size="10"></td><td valign="middle"><input type="button" id="GoButtonID" onClick="quickLook();return false;" value="Go" /></td></tr></table></td></tr></table></form><table class="entNws"><tr><td class="entNwsC1" height="5"><hr></td><td class="entNwsC2"></td></tr></table><table class="entTvPt"><tr><td style="width:100%;"><div class="cntntTtlEnt" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">Featured movie selections</div></td></tr><tr><td><ul><li><a class="shrLnk1" href="http://g.msn.com/5TVANDURIL/1325">Movie News</a></li><li><a class="shrLnk1" href="http://g.msn.com/5TVANDURIL/1330">Now Playing</a></li><li><a class="shrLnk1" href="http://g.msn.com/5TVANDURIL/1335">Coming Soon</a></li><li><a class="shrLnk1" href="http://g.msn.com/5TVANDURIL/1340">New on DVD/Video</a></li></ul></td><td width="20"></td></tr></table>

		<!-- Rule -->
		<table class="entNws">
			<tr>
				<td class="entNwsC1" height="5">
					<hr/>
				</td>
			</tr>
		</table>

		<!-- Movie box office gross -->
		<table cellspacing="0" cellpadding="0" class="cntntTbl"><tr><td style="width:100%;"><div class="cntntTtlEnt" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">Top-grossing movies</div></td></tr><tr><td><ol style="position:relative;left: -5px;"><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=560901">Spider-Man 3 -- $148M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2071025">Disturbia -- $5.7M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2067803">Fracture -- $3.4M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=1423410">The Invisible -- $3.1M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2066825">Next -- $2.8M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=582462">Lucky You -- $2.5M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2064384">Meet the Robinsons -- $2.5M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2062505">Blades of Glory -- $2.3M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2067415">Hot Fuzz -- $2.1M</a></li><li style="padding: 5 0 0 0;"><a class="shrLnk1" href="http://entertainment.msn.com/movies/movie.aspx?m=2066804">Are We Done Yet? -- $1.7M</a></li></ol></td></tr></table>
		

<SCRIPT LANGUAGE=Javascript SRC="msntv:/Shared/Javascript/PreCache.js"></SCRIPT>

<script src="/Include.ashx?type=js&target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fJsTransforms%2fen-us%2fUtil.xslt&v=2.0.261.788" language="javascript"></script>

<!-- cgif tracking: load the cGif after the document loads -->     
<script>
	RegisterOnLoad(function() { callCGif("http://c.msn.com/c.gif?DI=1455&PI=68206&PS=73398&TP=http://msntv.msn.com/Entertainment/Movies.htm&RF="); } );
</script>



	
</td></tr></table>
				</td>					
			</tr>
		</table>
	</body>
</html>


	



