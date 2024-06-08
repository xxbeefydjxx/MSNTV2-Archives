var OnlineStorageDevice	= GetOnlineStorageDevice();
var gXMLHttpRequest     = null;
var gASYNC				= true;
var gSpacesServer		= OnlineStorageDevice ? OnlineStorageDevice.URL : null;
var gSpacesNameSpace	= "http://spaces.msn.com/mediacenter/";
//var gSpacesServerURL	= "spaces.live-int.com";
var gSpacesServerURL	= "";
var gAbort				= false;
var gAuthCacheValue     = "";
var PanelManager		= TVShell.PanelManager;
var curUserName			= "";
var curUserFriendlyName = "";
var CurrentUser = TVShell.UserManager.CurrentUser;
if(CurrentUser)
{
	curUserName			= CurrentUser.Name;
	curUserFriendlyName = CurrentUser.FriendlyName;

	//var authServerEntry = TVShell.ActiveServiceList("onlinestorage::authServer"); //shinto
	var authServerEntry = TVShell.ActiveServiceList("Skydrive::AuthServer");
	if (authServerEntry && authServerEntry.URL != "" ){
		gSpacesServerURL = authServerEntry.URL;
	}
}
	
function CleanupXMLHTTPRequest()
{
	if (gXMLHttpRequest != null )
	{
		delete gXMLHttpRequest;
		gXMLHttpRequest = null;
	}
}


function GetSpacesDomain()
{
	var spacesDomain = gSpacesServerURL;
	var colonIdx;

	// make sure the domain does not contain http://
	if ( (colonIdx = gSpacesServerURL.indexOf("://")) > 0 )
		spacesDomain = gSpacesServerURL.substr( colonIdx + 3);

	return spacesDomain;
}


function StopSOAPProgress()
{
	TVShell.Message("Entry:StopSOAPProgress()");
	gAbort = true;
	HideProgressPanel();
	CleanupXMLHTTPRequest();
}
	
function SoapResponseHandler(httpRequest)
{
    TVShell.Message("Entry:SoapResponseHandler()");
	if(gAbort)
		return;
		
	var respNode = null;

	if ( httpRequest == null || ( httpRequest.status != 200 && httpRequest.status != 204 && httpRequest.status !=1223 ))
	{
		TVShell.Message("Rest api call failed httpRequest.status=" + httpRequest.status);
		if ( !httpRequest && httpRequest.responseText  != null ){
				alert(httpRequest.responseText);
		}
		StopSOAPProgress();
		alert("MSNTV experienced a technical problem. Please try again later.");
		return;
		
	}
	return;
}
/*	
function PostSoapAction(method, async, url, xmldoc, handler, soapAction)
{
	TVShell.Message("PostSoapAction " + method + " " + async + " " + url);		
	var httpReq;
	
 	try 
 	{
		httpReq = new ActiveXObject("Microsoft.XMLHTTP");
		httpReq.open(method,url, async );
		if ( async == true )
		{
			httpReq.onreadystatechange = function() 
			{
				if ( httpReq.readyState == 4 )
				{
				    SoapResponseHandler( httpReq );
				    if(!gAbort)
					    handler( httpReq );
				}
			}
		}
		
		var soapActionHeader = gSpacesNameSpace + soapAction;
					
		httpReq.setRequestHeader("MessageType" , "CALL");
		httpReq.setRequestHeader("Content-Type", "text/xml");
		httpReq.setRequestHeader("SOAPAction"  , soapActionHeader);
				
		httpReq.send(xmldoc);
		return httpReq;
	}
	catch(e)
	{
		//set an error message
		return null;
	}
}
*/
function SkyFolderAction(method, url, async, albumId, xmldoc, handler)
{
	TVShell.Message("SkyFolderAction " + method + " " + async + " " + albumId);
	var httpReq;
	var gTicket =  TVShell.Property.Item("SpacesToken");
	var appID = TVShell.ActiveServiceList("Skydrive::AppId");
	g_appID = appID.Description;
	
	TVShell.Message("url= " + url);
 	try 
 	{
		httpReq = new ActiveXObject("Microsoft.XMLHTTP");
		httpReq.open(method,url, async );
		if ( async == true )
		{
			httpReq.onreadystatechange = function() 
			{
				if ( httpReq.readyState == 4 )
				{
				    SoapResponseHandler( httpReq );
				    if(!gAbort)
					    handler( httpReq );
				}
			}
		}
		httpReq.setRequestHeader("AppID", g_appID);
		httpReq.setRequestHeader("Authorization", "WLID1.0 "+gTicket);
		httpReq.setRequestHeader("Content-Type", "application/atom+xml");
		httpReq.setRequestHeader("Accept", "application/atom+xml");
		httpReq.send(xmldoc);
		return httpReq;
	}
	catch(e)
	{
		//set an error message
		return null;
	}
}


function GetOnlineStorageDevice(spaceAlias)
{
   var sm=TVShell.StorageManager;
   var count= sm.Count;
   
   for(i=0;i<count;i++)
   {
	  var sd=sm.Item(i);
	  if(sd.Provider.toLowerCase()=="onlinestorage")
	  {
	    if(!spaceAlias || spaceAlias=="")
	    {
	        if(!sd.ReadOnly)
	            return sd;
	    }
	    else
	    {
	        var alias = sd.Property("Alias");
	        if(alias.toLowerCase()==spaceAlias.toLowerCase())
	            return sd;
	    }	    
	  }
   }   
   return null;
}
