var OnlineStorageDevice	= GetOnlineStorageDevice();
var gXMLHttpRequest     = null;
var gASYNC				= true;
var gSpacesServer		= OnlineStorageDevice ? OnlineStorageDevice.URL : null;
var gSpacesNameSpace	= "http://spaces.msn.com/mediacenter/";
var gSpacesServerURL	= "http://spaces.msn-int.com/";
var gDefaultPUID		= "1970326999525869";
var gAbort				= false;
var PanelManager		= TVShell.PanelManager;
var curUserName			= "";
var curUserFriendlyName = "";
var CurrentUser = TVShell.UserManager.CurrentUser;
if(CurrentUser)
{
	curUserName			= CurrentUser.Name;
	curUserFriendlyName = CurrentUser.FriendlyName;
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
					handler( httpReq );
			}
		}
		
		var soapActionHeader = gSpacesNameSpace + soapAction;
					
		httpReq.setRequestHeader("MessageType" , "CALL");
		httpReq.setRequestHeader("Content-Type", "text/xml");
		httpReq.setRequestHeader("SOAPAction"  , soapActionHeader);
	
		// The following is a hack to set the PUID in the user-agent string to circumvent IDCRL support 
		var PUID = TVShell.Property.Item("PUID");
		if(!PUID || PUID=="")
			PUID = 	gDefaultPUID;
		
		TVShell.Message("Using PUID " + PUID );
		httpReq.setRequestHeader("User-Agent", PUID);
		// End Hack
			
		TVShell.Message("sending to " + url);
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
	var soapReqBody = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>';
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