﻿<html xmlns:msntv=""><head><script>var forceReload = false;var l = 'd:'+new Date().valueOf()+'|';function setCookie(name, value){var now = new Date();var expires = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());document.cookie = escape(name) + '=' + escape(value) + ';expires=' + expires.toGMTString() + ';path=/';}function getCookie(name){var str = document.cookie;var arr = str.split('; ');for (var i=arr.length-1; i>=0; i--){var c = arr[i].split('=');if (c.length != 2)continue;if (unescape(c[0]) == name)return unescape(c[1]);}return null;}function syncCookie(cookieName, propValue){var c = getCookie(cookieName);l += 'g:'+cookieName+':'+c+'|';if (c != propValue){setCookie(cookieName, propValue);l += 's:'+cookieName+':'+propValue+'|';var check = getCookie(cookieName);if(check == propValue)forceReload = true;}}var d = new Date();var utcOffset = d.getTimezoneOffset();syncCookie('UserUtcOffset', utcOffset);var connSpeed;try { connSpeed = window.external.ClientCaps.connectionType; }catch (e) { connSpeed = "undetected"; }syncCookie('UserConnectionSpeed', connSpeed);try { top.log(l); } catch (e) {}if (forceReload)location.replace(location.href);</script>
	
	<!--?import namespace="msntv" implementation="/Shared/Anduril/HTC/en-us/Progress.htc"-->

	
		<title>MSN Video</title>
		<script src="/Include.ashx?type=js&amp;target=http%3a%2f%2flocalhost%3a1700%2fShared%2fBaseClient%2fJsTransforms%2fen-us%2fPaneHelp.xslt&amp;v=2.0.261.900" language="javascript" defer="true"></script>
		<link href="/Include.ashx?type=css&amp;target=http%3a%2f%2flocalhost%3a1700%2fMSNVideo%2fAnduril%2fCssTransforms%2fen-us%2fMain.xslt&amp;v=2.0.261.900" type="text/css" rel="StyleSheet">
		<script src="/Include.ashx?type=js&amp;target=http%3a%2f%2flocalhost%3a1700%2fMSNVideo%2fAnduril%2fJsTransforms%2fen-us%2fMain.xslt&amp;v=2.0.261.900" language="javascript"></script>
		<script src="/VideoContent.ashx?contentType=showcase" language="javascript"></script>
		<script src="/VideoContent.ashx?contentType=topics&amp;client=Anduril" language="javascript"></script>
		<script>var initTimer;var initRetries = 0;function ValidTopics(){try{if (g_topics.length > 0)return true;}catch (exception){}return false;}function ValidSlideshow(){try{if (g_ssHeadlines.length > 0)return true;}catch (exception){}return false;}function ValidStylesheet(){try{var ss = document.styleSheets[0];if (ss.rules.length != 0)return true;}catch (exception){}return false;}function ValidScripts(){try{var testFunction = initApp;return true;}catch (exception){}return false;}function initPage(){window.clearTimeout(initTimer);var userAgent = "Mozilla/5.0 (compatible; heritrix/3.1.2-SNAPSHOT-20131029-0036 +http://archive.org/details/archive.org_bot)";var homeurl = "/pages/home/home.aspx";if (userAgent.indexOf("STB")!=-1) homeurl = window.external.SafeGetServiceURL('home::home');if (!isBroadband){pageMessageDiv.innerHTML = "";alert("Dial-up connections are not fast enough to play videos. Please press OK to return to the home page.");pageMessageDiv.innerHTML = "Please wait while we get the home page ready.";location.replace(homeurl);return;}if (!ValidTopics() || !ValidSlideshow() || !ValidStylesheet() || !ValidScripts()){initRetries++;if (initRetries == 5){var s = "MSN Video is temporarily unavailable. Please try again later.";if (userAgent.indexOf("MediaCenter")!=-1){var MCE = window.external.MediaCenter();MCE.Dialog(s,"",1,-1,true);MCE.NavigateToPage("b8eac38a-7fb8-4559-84b5-42999c6864bd",null);}else if (userAgent.indexOf("STB")!=-1){window.external.MessageBox(s, "", "OK", 0, 0x10, 0x1);location.replace(homeurl);}else
{alert(s);location.replace(homeurl);}}else
{initTimer = window.setTimeout(function(){ initPage(); }, 1000);}return;}pageMessageDiv.style.visibility = "hidden";initApp();}function onKeyEvent(code){try{onRemoteEvent(code)}catch (exception){}}</script><style>
			.body
			{
				margin:0;
				background-color:131517;
				color:F7F7F7;
				font-family:Segoe;
				width:550;
				height:455;
				overflow-x:hidden;
			}
			.pageMessageDiv
			{
				position:absolute;
				top:80;
				width:560;
				text-align:center;
				color:FFFFFF;
				font:bold 20;
				z-index:100;
			}
		</style>
		<script>var isBroadband = false;</script>
	</head>
	<body scroll="no" onload="initPage()" class="body">
		<object id="MediaPlayerOCX" classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" type="application/x-oleobject" width="320" height="240" style="position:absolute; z-index:-10; display:none;" viewastext="" tabindex="-10001">
			<param name="haswindow" value="1">
			<param name="ShowControls" value="0">
			<param name="ShowStatusBar" value="0">
		</object>
		<div id="trackingDiv"></div>
		<div class="bodyDiv">
			<div id="pageMessageDiv" class="pageMessageDiv">Please wait while we get the home page ready.</div>
			<div id="bkg1" style="visibility:hidden;"></div>
			<div id="bkg2" style="visibility:hidden;"></div>
			<div id="adManagerDiv" class="adManagerDiv" style="visibility:hidden;z-index:100"></div>
			<div id="bannerDiv" class="bannerDiv"></div>
			<div id="brandingDiv" class="brandingDiv" style="visibility:hidden"></div>
			<div id="browseHeaderDiv" class="browseHeaderDiv" style="visibility:hidden"></div>
			<div id="categoryChooserDiv" class="brwsCatDiv" style="visibility:hidden"></div>
			<div id="footerDiv" class="footerDiv" style="visibility:hidden"></div>
			<div id="mediaPlayerDiv" class="mediaPlayerDiv" style="visibility:hidden"></div>
			<div id="mpStatusDiv"></div>
			<div id="metadataPopupDiv" class="metadataPopupDiv" style="visibility:hidden"></div>
			<div id="navBarDiv" class="navBarDiv" style="visibility:hidden"></div>
			<div id="nowPlayingDiv" class="nowPlayingDiv" style="visibility:hidden"></div>
			<div id="onDeckDiv" class="onDeckDiv" style="visibility:hidden"></div>
			<div id="slideShowPanel" class="ssPanel"></div>
			<div id="slideShowAbstract" class="ssAbstract"></div>
			<div id="pbDiv" style="visibility:hidden"></div>
			<div id="transitionDiv" class="transitionDiv"></div>
			<div id="fullScreenPanelDiv" class="fullScreenPanelDiv" style="visibility:hidden"></div>
			<div id="videoControlsDiv" class="vcDiv" style="visibility:hidden"></div>
			
				<div id="videoMetadataDiv" class="vmDiv">
					<div id="videoMetadataInnerDiv" class="videoMetadataInnerDiv"></div>
				</div>
			
		</div>

		<div id="textGauge" style="position:absolute;top:500;left:600;display:none"></div>

		<script language="JScript" event="PlayStateChange(lOldState, lNewState)" for="MediaPlayerOCX">
			onPlayStateChange(lOldState, lNewState);
		</script>
		<script language="javascript" event="ReadyStateChange(lReadyState)" for="MediaPlayerOCX">
			onReadyStateChange(lReadyState);
		</script>
		<script language="javascript" event="Buffering(bStart)" for="MediaPlayerOCX">
			onBuffering(bStart);
		</script>

		<script for="document" event="onkeydown" language="JScript">
			
			var eventHandled;
			try
			{
				eventHandled = onRemoteEvent(event.srcElement, event.keyCode);
			}
			catch (exception)
			{
				eventHandled = false;
			}
			if (eventHandled)
			{
				event.returnValue=false;
				event.cancelBubble=true;
			}
			else
			{
				event.returnValue=true;
				event.cancelBubble=false;
			}

		</script>
	

</body></html>