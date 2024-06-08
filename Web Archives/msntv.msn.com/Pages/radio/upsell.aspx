<html xmlns:msntv=""><!--?import namespace="msntv" implementation="/Shared/Anduril/HTC/en-us/CustomButton.htc"--><!--?import namespace="msntv" implementation="/Shared/Anduril/HTC/en-us/ScrollingDIV.htc"--><head>
		<title>Radio</title>

		<link href="/Include.ashx?type=css&amp;target=http%3a%2f%2flocalhost%3a1700%2fShared%2fAnduril%2fCssTransforms%2fen-us%2fStyles.xslt&amp;v=2.0.261.788" type="text/css" rel="StyleSheet">

	

	</head>
	<body onload="page_load();">
		<script></script>
	<div class="radCntr">
		
			<div class="cntrHdrRad">
				<table cellpadding="0" cellspacing="0" border="0">
					<tbody><tr class="cntrHdr">
						
						<td valign="top">
							<table class="cntrHdr" cellpadding="0" cellspacing="0" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:msntvuxp="msntvuxp.microsoft.com">
								<tbody><tr class="cntrHdrR1">
									<td valign="bottom">
										<span class="radCntrHdr">
											<a href="javascript:top.CallPaneHelp(top.PH_topicTOC, 'MSNTV_TRS_TOC_Radio.htm');" id="HelpLinkID" class="radHdrLinks">
												Help<span id="helpIcon" style="src:url(msntv:/Shared/Images/Icon_Help_RelatedLink.png)"></span>
											</a>
										</span>
										<img width="8" height="1" src="/Images/Shared/s.gif">
									</td>
								</tr>
								<tr class="cntrHdrR2">
									<td valign="top">
										<span class="radHdr">
										<span class="cntrHdr hdrTxtRad">Music</span>
										<span class="radHdr">Radio&nbsp;
											<script>
												// get the url path
												var urlPath = location.pathname.toLowerCase();
												// get the sub title param
												var currentSubTitle = top.getQueryParam("SubTitle");											
												
												if (urlPath == "/pages/radio/categorystationlist.aspx")
													{
														var currentSubTitle = top.getQueryParam("SubTitle");
														var decodeSubTitle = top.decodeAmp(currentSubTitle);
												
														document.write(decodeSubTitle);
													}
												
												else if (urlPath == "/pages/radio/managestationlist.aspx" && top.actionState == "add")
													document.write("Add Stations");
												
												else if (urlPath == "/pages/radio/managestationlist.aspx" && top.actionState == "remove")
													document.write("Remove Stations");
												
												else if (urlPath == "/pages/radio/mystations.aspx" )
													document.write("My Stations");
												
												else if (urlPath == "/pages/radio/mystationsnone.aspx" )
													document.write("All Categories");
												
												else if (urlPath == "/pages/radio/localcitychooser.aspx" )
													document.write("MSN Local Sounds");																			
											</script>
										</span>
									</span></td>
								</tr>
							</tbody></table>
						</td>
					</tr>
				</tbody></table>								
			</div>		
		
			<div class="scrollAreaBkg">
				<table id="Tvcontentcontainer1__ctl0_left_left" cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td>

		
		<!-- page_load() is required; it gets called by RadioTemplate.ascx -->
		<script>
			function page_load()
			{
				var cancelBtn = document.all["cancel"];
				cancelBtn.focus();
			}
		</script> 
		<div class="cntrRadTxt upsellTextArea">	
				
			MSN Radio Plus subscribers get access to commercial-free, high fidelity music for as little as $2.50/month billed yearly at $29.99.
			<p>
			Listen to scores of stations across dozens of music genres - all without interruption.
			</p><p>
			Get a one-month free trial of MSN Radio Plus now! See offer details.	
		</p></div>
	
</td></tr></tbody></table>
			</div>
			<div class="sideBarBkg">
				<table id="Tvcontentcontainer1__ctl0_right_right" cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td>
	
		
			<input type="button" class="sideBarButton" id="try" value="Try it Now" onclick="alert('This functionality is only available on an MSNTV device.');">
			<input type="button" class="sideBarButton" id="cancel" value="Cancel" onclick="top.loadInWindow('home.aspx')">
		
</td></tr></tbody></table>	
			</div>							
		</div>
</body></html>