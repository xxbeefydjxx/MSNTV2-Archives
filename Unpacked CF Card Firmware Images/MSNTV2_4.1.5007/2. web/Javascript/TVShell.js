//
// TVShell.js
//
var TVShell = new ActiveXObject("MSNTV.TVShell");
var mainPanel  = TVShell.PanelManager.Item("main");

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

var MGX_SIZE_LARGE = 0x0;
var MGX_SIZE_SMALL = 0x1;

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

function NoPhotoSelected()
{	

	if(mainPanel.Document.PhotoSelected())
		 return false;
	else
		 return true;
}

function GotoPrint()
{
  TVShell.Message(" GotoPrint ");
  if(IsMainPanelInDocViewer() && !mainPanel.Document.parentWindow.isDocumentLoaded)
  {
	TVShell.Message("document not loaded ");
	TVShell.DeviceControl.PlaySound("Page_Boundary");
	return;
  }
  
  if(IsMainPanelInPhotoViewer() && NoPhotoSelected())
  {
  
	  // if there is already another modal dialog on, simply return and not show any 
	  // message box
	  if(TVShell.PanelManager.ModalDlgOn)
		  return;
	  var content="<p>";
	  content+="<p>Please choose one or more photos.";
 	  PanelManager.CustomMessageBox(content,"No photo selected","OK",0,"", true)
	  return;
  }

  if(PrinterAvailable())
     TVShell.PanelManager.Show('printsettings');
  else{
      // if there is already another modal dialog on, simply return and not show any 
	   // message box
      if(TVShell.PanelManager.ModalDlgOn)
	      return;

	  var content="<p><p>";
	  content+="<p>To print, you need to have a compatible printer connected to your "+ProductShortName+", and the printer may need to be turned on.";
 	  content+="<p>To see a list of printers that are compatible with " + ServiceShortName + ", choose <EM>See Printers List</EM>.";
	  if(TVShell.PanelManager.CustomMessageBox(content,"","See Printers List;OK;",1,"", true)==0){
	     TVShell.PanelManager.Show("main");
		 TVShell.PanelManager.Item('main').GotoURL(GetCompatPrinterListURL());
	  }

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
