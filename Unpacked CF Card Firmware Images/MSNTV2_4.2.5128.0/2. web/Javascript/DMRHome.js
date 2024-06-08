function Mount(i,j)
{

	var he = HomeNetworkObj.Item(i);
	if(he)
	{
		TVShell.Message( "mount " + i + " " + j );
		var se = he.Item(j);
		if(se) {
			TVShell.Message("mounting " + se.Name);
			ShowProgressPanel();
			SetProgressPercent(50);
			SetProgressStopFunction(null);
			SetProgressText(PROGRESS_PLEASE_WAIT + "Connecting...");
			se.Mount();
		}
	} 
}
		
function BuildUSBList(helpURL)
{
	var numUSBDevice = 0;
	var str="<div style=\"display:block; line-height:22px; padding-bottom:12px;\">";
	var result;

	for (var i=0; i<StorageManager.Count; i++) {
		var StorageDevice = StorageManager.Item(i);

		if (StorageDevice && StorageDevice.Removable && !StorageDevice.IsNetwork && StorageDevice.Mounted) 	{

			numUSBDevice++;

			var destURL="Viewer.html";					
			destURL+="?location=0&StorageDeviceVN=";
			destURL+=escapeplus(escape(StorageDevice.VolumeName));
				
			str+="<a id=link" + linkNum++ + " onclick=\"GotoURL('" + destURL + "')\"; class=ellipsis style='width:350px;'>";
			str+=StorageDevice.Name;
			str+="</a>";
		}
	}	  
	
	str+="</div>";
	
	if (numUSBDevice == 0) {
		result = "<span style=\"display:block; padding-top:5px;\"><UL class=links><LI><a href='msntv:/Help/" + helpURL + "'>Learn More</a></LI></ul></span>";
	}
	else {
		result = str;
	}

	return result;
}
	
function BuildHomeNetworkList(helpURL)
{	
	var numHomeNetwork = 0;
	var result = "";
	var str = "<div style=\"display:block; line-height:22px; padding-bottom:5px;\">";

	TVShell.Message("BuildHomeNetlist start");
	
	for (var i = 0; i < StorageManager.Count; i++) {
		var StorageDevice = StorageManager.Item(i);
		if (!StorageDevice.Removable && 
			StorageDevice.IsNetwork && 
			StorageDevice.Mounted) {

			numHomeNetwork++;
			
			var destURL="Viewer.html";					
			destURL+="?location=2&StorageDeviceVN=";
			destURL+=escapeplus(escape(StorageDevice.VolumeName));
				
			str+="<a id=link" + linkNum++ + " onclick=\"GotoURL('" + destURL + "')\"; class=ellipsis style='width:350px;'>";
			str+=StorageDevice.Name;
			str+="</a>";	
		}
	}
		
	TVShell.Message("BuildHomeNetlist end");
	for (var i=0; i<HomeNetworkObj.Count; i++) {
		var he = HomeNetworkObj.Item(i);
		for (var j=0; j<he.Count; j++) {
			var se = he.Item(j);

			numHomeNetwork++;
		
			str+="<a id=link" + linkNum++ +" onclick=Mount(" + i + "," + j +") class=ellipsis style='width:350px;'>";
			str+=se.Name;
			str+=" on ";
			str+=he.Name;
			str+="</a>";
		}
	}

	str += "</div>";

	if (numHomeNetwork == 0) {
		result = "<span style=\"display:block; padding-top:5px;\"><UL class=\"links\"><LI><a href=\"msntv:/Help/" + helpURL + "\">Learn More</a></LI>";
	}
	else {
		result = str;
		result += "<span style=\"display:block; padding-top:5px;\"><UL class=\"links\">";
	}

	result += "<LI><a onClick='GotoLANPage(\"msntv:/Settings/Network/HomeNetworking.html\");' style=\"width:350px;\">Manage your home network</a></UL></span>";

	return result;
}

function ConfirmSignOn(serviceName, appName)
{
	var CurrentUser = TVShell.UserManager.CurrentUser;

	if(!CurrentUser || !CurrentUser.IsAuthorized)
	{
		var msgTxt = "You are currently not signed in. Do you want to exit <EM>" + appName + "</EM> and sign in, or return to <EM>" + appName + "</EM>?"
		var result = PanelManager.CustomMessageBox(msgTxt,"","Return to " + appName + ";Sign In;",0,"", true, 0x30, 1);
		if(result==1)
			GotoSignOn();
		return;	
	}
	else {
		var entry = TVShell.ActiveServiceList.Item(serviceName);
		if (entry && entry.URL) {
			GotoURL(entry.URL);
		}
	}
}

//
// HomeNetworking - Eventhandler for Host events
//
function OnHostHandler(hnx, he, evt, status)
{
}

//
// HomeNetworking - Eventhandler for Service events
//
function OnServiceHandler(he, se, evt, status)
{
    switch (evt) {
	case HN_EVT_MOUNTED:
		HideProgressPanel();
	    if (status==0) {
       		var sd = se.NetStorage;

       		var destURL="Viewer.html";					
	        destURL+="?location=2&StorageDeviceVN=";
	        destURL+=escapeplus(escape(sd.VolumeName));
		
       		document.location = destURL;	
       	}
		else {
			ShareUnavailableMessageBox(he, se, status, false)
		}   			
		break;
	case HN_EVT_NEWSERVICE:
		// status == 1 indicates that share was removed
		if (document.all.scrollArea) {
			scrollArea.innerHTML = BuildScrollArea();
			SetDefaultFocus();
		}
		break;
	}
}	

function SynchronizeShares()
{
	for (var i = 0; i < HomeNetworkObj.Count; i++) {
		HomeNetworkObj.Item(i).AutoDetect(1);
	}
}
