//
// TVShell.js
//
var TVShell = new ActiveXObject("MSNTV.TVShell");
var mainPanel  = TVShell.PanelManager.Item("main");
var UNDER_CE = null;
var UNDER_NT = null;

if ( TVShell.SystemInfo.OSType == "CE" )
	UNDER_CE = TVShell.SystemInfo.OSVersion;
else if ( TVShell.SystemInfo.OSType == "NT" )
	UNDER_NT = TVShell.SystemInfo.OSVersion;

var ServiceShortName = TVShell.SystemInfo.ServiceShortName;
var ProductShortName = TVShell.SystemInfo.ProductShortName;
var ProductNickname = TVShell.SystemInfo.ProductNickname;
var ServiceFullName = TVShell.SystemInfo.ServiceFullName;
var CustomerCareNumber = "1-866-466-7688";



//
// Definitions for Message Boxes
//
var IDOK=1;
var IDCANCEL=2;
var IDABORT =3;
var IDRETRY =4;
var IDIGNORE =5;
var IDYES =6;
var IDNO  =7;
var IDCLOSE =8;
var IDHELP =9;

var MB_OK  =0x00;
var MB_OKCANCEL  =0x01;
var MB_ABORTRETRYIGNORE =0x02;
var MB_YESNOCANCEL =0x03;
var MB_YESNO =0x04;
var MB_RETRYCANCEL =0x05;
var MB_SPECIAL_SAFE = 0x0E;
var MB_SPECIAL = 0x0F;

var MGX_ICON_ERROR		= 0x10;
var	MGX_ICON_WARNING	= 0x30;
var	MGX_ICON_INFO		= 0x40;
var	MGX_ICON_PAGERESIZE	= 0x80;

var MGX_SIZE_LARGE = 0x0;
var MGX_SIZE_SMALL = 0x1;

function IsMCEPage( panel )
{
	var isMce = false;

	// Optimization:
	// Checks first thru our Panel property and if FALSE parse the Script to really be certain
	// Needed because this panel prop is 'put' upon 'window.external.mediacenter', which
	// could well be triggered after 'OnDocumentComplete' fired (i.e. inside <BODY 'onLoad=MyFunc()'>)
	isMce = panel.IsMCEEnabled;

	if( !isMce && !panel.HasLocalUrl )
	{	
		//TVShell.Message("Shell.html: IsMCEPage - Parsing Script...");

		if ( !panel.Document.parentWindow.IsMCEEnabled )
		{
			var CNEntry = TVShell.ActiveServiceList.Item("home::cinemanow");
			if (CNEntry && CNEntry.URL && panel.URL
			    && panel.URL.toLowerCase().indexOf(CNEntry.URL.toLowerCase()) == 0)
			{
				isMce = true;
			}
		}
		else
		{
			isMce = panel.Document.parentWindow.IsMCEEnabled();
		}
	}

	//TVShell.Message("Shell.html: IsMCEPage - IsMCEEnabled " + isMce);
	return isMce;
}

function SetFocusSafely( element )
{
	try {
		element.focus();
	} catch (ex) {
	}
}

function  PrinterAvailable()
{
 var PrintManager=TVShell.PrintManager;
 PrintManager.SearchPrinters();
 var count=PrintManager.Count;
 if(count>0 && PrintManager.CurrPrintDevice>=0)
 {
   var device=PrintManager.Item(PrintManager.CurrPrintDevice);
   if(device.driver=="unsupported")
     return false;
   else 
     return true; 
 }

  return false;
}

function IsMainPanelInDocViewer()
{	
	var currentURL = mainPanel.URL;	
	currentURL = currentURL.toLowerCase();	
	var retVal = (currentURL.indexOf("msntv:/docviewer/docviewer.htm") == 0) ? true : false;
	return retVal;
}

function IsMainPanelInPhotoViewer()
{	
	var currentURL = mainPanel.URL;	
	currentURL = currentURL.toLowerCase();	
	var retVal = (currentURL.indexOf("msntv:/photo/viewer.html") == 0) ? true : false;
	return retVal;
}

function IsMainPanelInWriteMail()
{	
	var CurrentUser	= TVShell.UserManager.CurrentUser;
	if (!CurrentUser)
		return false;
		
	var writemailURL = "";
	var writemailService = CurrentUser.ServiceList("mail::writemail");
	if (writemailService)
		writemailURL  = writemailService.URL;
		
	return(IsMainPanelOnPage(writemailURL));
}

function IsMainPanelInListMail()
{	
	var CurrentUser	= TVShell.UserManager.CurrentUser;
	if (!CurrentUser)
		return false;
		
	var listmailURL = "";
	var listmailService = CurrentUser.ServiceList("mail::listmail");
	if (listmailService)
		listmailURL  = listmailService.URL;
		
	return(IsMainPanelOnPage(listmailURL));
}

function IsMainPanelOnPage(pageURL)
{
	if (!pageURL)	
		return false;
	
	pageURL = pageURL.toLowerCase();	
			
	var currentURL = mainPanel.URL;	
	currentURL = currentURL.toLowerCase();	
		
	var retVal = (currentURL.indexOf(pageURL) == 0) ? true : false;	
	return retVal;
}

function NoPhotoSelected()
{	

	if(mainPanel.Document.PhotoSelected())
		 return false;
	else
		 return true;
}

function DisplayCompatiblePrinterDialog()
{
	if (TVShell.IsUserAuthorizedandConnected) {
		var content="<p><p>";
		content+="<p>To print, you need to have a compatible printer connected to your "+ProductShortName+", and the printer must be turned on.";
		content+="<p>To see a list of printers that are compatible with "+ ServiceShortName +", choose <EM>See Printers List</EM>.";

		if (TVShell.PanelManager.CustomMessageBox(content,"","See Printers List;OK;",1,"", true)==0) {
			TVShell.PanelManager.Show("main");
			TVShell.PanelManager.Item('main').GotoURL(GetCompatPrinterListURL());
		}
	} else {
		// offline does not have a printer list
		var content="<p><p>";
		content+="<p>To print, you need to have a compatible printer connected to your "+ProductShortName+", and the printer must be turned on.";
		content+="<p>To see a list of printers that are compatible with "+ ServiceShortName +", you must first sign-in, then press the Print key on " + 
			"your keyboard.";
		TVShell.PanelManager.CustomMessageBox(content,"","OK;",0,"", true);
	}
}

function GotoPrint()
{
	TVShell.Message(" GotoPrint ");
	if (IsMainPanelInDocViewer() && !mainPanel.Document.parentWindow.isDocumentLoaded) {
		TVShell.Message("document not loaded ");
		TVShell.DeviceControl.PlaySound("Page_Boundary");
		return;
	}

	if (IsMainPanelInPhotoViewer())
	{
		if(mainPanel.Document.parentWindow.zoomDivOpen == true)
		{
			// ignore the print button if the Photo zoom window is displayed
			TVShell.DeviceControl.PlaySound("Block");
			return;
		}
		else if (NoPhotoSelected()) 
		{
			// if there is already another modal dialog on, simply return and not show any message box
			if(TVShell.PanelManager.ModalDlgOn)
				return;
			
			var content="<p>";
			content+="<p>Please choose one or more photos.";
			PanelManager.CustomMessageBox(content,"No photo selected","OK",0,"", true)
			return;
		}
	}

	if (PrinterAvailable())
		TVShell.PanelManager.Show('printsettings');
	else {
		// if there is already another modal dialog on, simply return and not show any 
		// message box
		if(TVShell.PanelManager.ModalDlgOn)
			return;

		DisplayCompatiblePrinterDialog();
	}
}


function ConditionalizePrinterName(manufacturer, model)
{
   
   var mfc=manufacturer.toUpperCase();
   var mdl=model.toUpperCase();
   
   if(mdl.indexOf(mfc)==0)
	  mdl=model.substr(mdl.length+1);

   if(mfc=="HEWLETT-PACKARD")
		 mfc="HP";
   
   var re;
   
  if(mfc=="HP")
   {
     re=/DESKJET|DJ/gi;
     mdl=mdl.replace(re,"Deskjet");
   }
   else if(mfc=="EPSON")
   {
     mfc="Epson";
     re=/STYLUS/gi;
     mdl=mdl.replace(re,"Stylus");
   }

   return mfc+" "+mdl;
}

//
// GotoLANPage - Go to page that requires LAN access.  If LAN is unavailable, then
// go to an error page.
//
function GotoLANPage(page)
{
	var cause = "LAN::Goto";
	var entry = TVShell.BuiltInServiceList.Add(cause);
	entry.URL = page;

	TVShell.ConnectionManager.LANConnect(cause);

	return false;
}

function newDOMDocument()
{
	var xmlDoc = null;
	xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	return xmlDoc;
}


//This simply refreshes the cached state of the StorageDevice wrapper.
function IsMounted( StorageDevice )
{
	if ( StorageDevice && StorageDevice.StorageDevice != null ) {
		StorageDevice.Mounted = StorageDevice.AlwaysMounted
			|| StorageDevice.StorageDevice.Mounted;
	}

	return StorageDevice.Mounted;
}

function FindStorageDevice(userDataVolumeName)
{
	var sd = TVShell.StorageManager.Item(userDataVolumeName);
	return sd;
}

function GotoTarget(serviceName, parameter, forceSignin)
{
	var CurrentUser = TVShell.UserManager.CurrentUser;
	var entry = TVShell.ActiveServiceList.Item(serviceName);
	var isLocal = entry && entry.URL && entry.URL.indexOf("msntv:") == 0;
	
	if ((!isLocal || forceSignin) && (!CurrentUser || !CurrentUser.IsAuthorized)) {
		var entry = TVShell.BuiltinServiceList.Add("home::target");
		if (!serviceName)
			serviceName = "home::home";		
		if (parameter)
			entry.URL = serviceName + "?" + parameter;
		else
			entry.URL = serviceName;
		var signon = TVShell.BuiltinServiceList.Item("SignOn");
		var panel = TVShell.PanelManager.FocusedPanel;
		var atLogin = false;
		if ( signon && panel && panel.Name == "main" )
		{
			if ( IsMainPanelOnPage( signon.URL ) ) atLogin = true;
		}
		if ( !atLogin ) ShowSigninPanel();
	}
	else if (entry && entry.URL) {
		if (parameter)
			GotoURL(entry.URL + "?" + parameter);
		else
			GotoURL(entry.URL);
	}
}



function OutputTimeStamp()
{
    var NOW=new Date();
	TVShell.Message(NOW.toLocaleDateString()+"  "+NOW.toLocaleTimeString());
}
var TRIM_LEADING_SPACE =0x01;
var TRIM_TAILING_SPACE =0x02;
var TRIM_BOTH_END = 0x03;

function TrimSpace(data, mode)
{
  var len;
  var begin;
  var end;
  if(mode&TRIM_LEADING_SPACE)
  {
	  len=data.length
	  for(begin=0;begin<len;begin++)
		  if(data.charAt(begin)!=' ')
			 break;
	  data=data.substr(begin);
  }
  if(mode&TRIM_TAILING_SPACE)
  {
	len=data.length
	for(end=len-1;end>begin;end--)
	  if(data.charAt(end)!=' ')
		 break;
	 data=data.substr(0,end+1)
  }
  return data;
}

// don't add prefix if there appears to be some type of scheme
function addHTTP( url )
{
	var mURL = "http://" + url;
	var cIndex = url.indexOf( ":" );
	if ( cIndex > 15 ) return mURL;
	if ( cIndex < 0 ) return mURL;
	var sIndex = url.indexOf( "/" );
	if ( sIndex == -1 ) return url;
	if ( sIndex > cIndex ) return url;
	return mURL;
}

function ValidateUrl(data)
{
	var url = TrimSpace(data);
	var scheme=TVShell.Utilities.SchemeofUrl(url);
	if(!scheme)
		url= addHTTP( url );

	TVShell.Message("url = "+ url);
	var temp = url.toLowerCase();

	TVShell.Message("scheme = "+ scheme);

	if (temp != "http://" && temp != "" && temp != "http://www.") {   
	    if (temp.indexOf("http://") == 0) {
		    temp = temp.substr(7);
	    }
	    else if (temp.indexOf("https://") == 0) {
	    	temp = temp.substr(8);
	    }
        
		temp = TrimSpace(temp,TRIM_BOTH_END);

        // block javascript from entering URL textbox
		if ((TVShell.SystemInfo.Flavor == "release" || TVShell.SystemInfo.Flavor == "ppe") &&
			(temp.indexOf("javascript:") == 0 || temp.indexOf("jscript:") == 0 ||
			 temp.indexOf("vbscript:") == 0 || temp.indexOf("msntv:") == 0))
	       return null;
		else 
		   return url;
	}

	return null;
}

function GetMSNTVScale()
{
	var zm = 1.0;
	if (TVShell && TVShell.DeviceControl && TVShell.DeviceControl.FullScreen)
	{
		//Base this off of the MCE scaling factor
		var mainPanel = TVShell.PanelManager.Item("main");
		zm = mainPanel.Scaled * 1024.0 / 550.0;
	}
	return zm;
}

function SetMSNTVScale()
{
	//Do not call IsMSNTVScalingEnabled() since it can be overridden
	try {
		if (UNDER_NT)
			document.body.style.zoom = GetMSNTVScale();
	} catch (ex) {
		//TVShell.Message( "SetMSNTVScale: Encountered error " + ex );
	}
}

//Analogous functions to MCE 
//Return true if MSNTV Scaling is to be done.
//This function can be overridden by clients and returned false to
//prohibit Shell.html from calling onMSNTVScaleEvent.
function IsMSNTVScalingEnabled()
{
	return UNDER_NT;
}

//Override this function to provide custom scaling
function onMSNTVScaleEvent()
{
	SetMSNTVScale();
}

function IsOnlineStorageAvailable()
{
	var spacesToken = TVShell.Property.Item("SpacesToken");
	var retVal = (!spacesToken || spacesToken=="") ? false : true;
	return retVal;
}

var AdapterType_Modem = 1
function IsWebAccelerationAllowed()
{
	if(TVShell.ConnectionManager.WANAdapter.Type == AdapterType_Modem && TVShell.ConnectionManager.WebAcceleration)
	  return true;
	else 
	  return false;
}



function IsWMPPlaying()
{
	var result=false;
	var mediapanel=TVShell.PanelManager.Item("mediapanel");
	if(mediapanel && mediapanel.Document)
	{
		if(mediapanel.Document.parentWindow.IsMediaPlaying())
		  result=true;
		else if(mediapanel.Document.parentWindow.IsAudioPlaying())
		  result=true;
	}

	return result;
}