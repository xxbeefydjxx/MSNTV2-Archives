var OnlineStorageDevice	= GetOnlineStorageDevice();
var gXMLHttpRequest     = null;
var gASYNC				= true;
var gSpacesServer		= OnlineStorageDevice ? OnlineStorageDevice.URL : null;
var gSpacesNameSpace	= "http://spaces.msn.com/mediacenter/";
var gSpacesServerURL	= "spaces.live-int.com";
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

	var authServerEntry = TVShell.ActiveServiceList("onlinestorage::authServer");
	if (authServerEntry && authServerEntry.URL != "" ){
		gSpacesServerURL = authServerEntry.URL;
	}
}
	
function CleanupXMLHTTPRequest()
{
	if (gXMLHttpRequest != null )
	{
		gXMLHttpRequest.abort();
		delete gXMLHttpRequest.onreadystatechange;
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
	gAbort = true;
	HideProgressPanel();
	CleanupXMLHTTPRequest();
}
	
function SoapResponseHandler(httpRequest)
{
    TVShell.Message("SoapResponseHandler");
	if(gAbort)
		return;
		
	var respNode = null;
	var responseXML = httpRequest.responseXML;
	if (responseXML)
	{
		respNode = responseXML.selectSingleNode("//faultstring");
	}
	if (respNode)
	{
		StopSOAPProgress();
		alert("MSNTV experienced a technical problem. Please try again later.");		
		return;
	}	
	respNode = responseXML.selectSingleNode("//CacheValue");
	if (respNode)
	{	    
		gAuthCacheValue = respNode.text;
		TVShell.Message("gAuthCacheValue = " + gAuthCacheValue);
	}	
	return;
}
	
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

function CreateSoapRequest(paramsStr)
{
	var soapReqBody = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	soapReqBody+='<soap:Header><AuthCacheHeader xmlns="http://spaces.msn.com/mediacenter"><CacheValue>';
	if(gAuthCacheValue && gAuthCacheValue!="")
	    soapReqBody+=gAuthCacheValue;
	soapReqBody+='</CacheValue></AuthCacheHeader><AuthTokenHeader xmlns="http://spaces.msn.com/mediacenter"><Token>';
	var spacesToken = TVShell.Property.Item("SpacesToken");
	if(!spacesToken || spacesToken=="")
	{
		TVShell.Message("No Spaces token available : bailing out ");
		HideProgressPanel();
		alert("Some user information may have expired.Please sign out, and then sign in and try again.");
		return;
	}
	else
	    soapReqBody+=spacesToken;
	    	
	soapReqBody+='</Token></AuthTokenHeader></soap:Header><soap:Body>';
	if(paramsStr && paramsStr!="")
		soapReqBody+=paramsStr;
	soapReqBody+='</soap:Body></soap:Envelope>';
	
	return soapReqBody;
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
