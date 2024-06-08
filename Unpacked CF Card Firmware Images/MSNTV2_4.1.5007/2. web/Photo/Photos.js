var PanelManager			= TVShell.PanelManager;
var PhotoManager			= TVShell.PhotoManager;
var StorageManager			= TVShell.StorageManager;
var ThumbnailManager		= TVShell.ThumbnailManager;
var parameters				= FindParameters(PanelManager);
var Utilities				= TVShell.Utilities;
var mainPanel				= PanelManager.Item("main");
var CurrentUser				= TVShell.UserManager.CurrentUser;	

var ContentSync				= new ActiveXObject("MSNTV.ContentSync");
var userDataPath			= ContentSync.UserDataPath;
var userDataVolumeName		= userDataPath;
var slashPosInUserDataPath  = userDataPath.lastIndexOf("\\");
if(slashPosInUserDataPath!= -1)
	userDataVolumeName = userDataPath.slice(slashPosInUserDataPath+1);

var PhotoStorePath="Photo\\Albums";
var PhotoSettingsPath="Photo\\Settings";
var scFileName = "ScreenSaver.txt";
var topAlbumFileName="TopAlbum.txt";
var photoAreaHeight = 420;
var photoAreaWidth  = 560;
var MAX_PHOTOS_ON_LOCAL_STORAGE=100;
var Sink					= new ActiveXObject("MSNTV.MultipleEventSink");

//MUST MATCH CONSTANT IN CPhotoManager.cpp
var kDefaultPhotoName="file://\\web\\photo\\Assets\\PhotoLoadingImageBig.jpg";

function IsDefaultResizeFile( resizedImgURL )
{
  return resizedImgURL == kDefaultPhotoName;
}

function GetFileName(path)
{
  var index=path.lastIndexOf("\\");
  if(index<0)
    return path;
  if(path.length==(index+1))
    return "";
  
  return path.substr(index+1);
}

function SortNodes(node1, node2)
{
    var name1=node1.selectSingleNode(".//a:displayname").text.toLowerCase();
    var name2=node2.selectSingleNode(".//a:displayname").text.toLowerCase();

	if(name1>name2)
	   return 1;
	else if(name1==name2)
	   return 0;
	if(name1<name2)
	   return -1;
}

function GetFirstNonEmptyAlbum()
{

   var topAlbum="";

   var StorageDevice = TVShell.StorageManager.Item(userDataVolumeName);
   var xmlStr="";
   var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
   xmlDoc.async = false;

   if (!StorageDevice || !(xmlStr = StorageDevice.EnumerateItems(PhotoStorePath, "image/jpeg")) ||!xmlDoc.loadXML(xmlStr)) 
   { 
  		return "";
   }

	var nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 1]");
    var AlbumArray=new Array();    
	var len=nodes.length
    
	if(len<=0)
	    return "";
    var i=0;       
	for (i = 0; i < len; i++)
	    AlbumArray[i]=nodes.item(i);

	nodes=AlbumArray.sort(SortNodes);

	for(i=0;i<len;i++)
	{
	   var path=nodes[i].selectSingleNode(".//a:href").text;
       var item=GetFirstPhotoInAlbum(userDataVolumeName,path);

	   if(item && item[0] && item[1]=="image/jpeg")
	   {  
	      topAlbum = GetFileName(path); // return the first album name
		  break;
	   }

	}
	
	return topAlbum;
}

function GetFirstAlbum()
{

   var FirstAlbum="";

   var StorageDevice = TVShell.StorageManager.Item(userDataVolumeName);
   var xmlStr="";
   var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
   xmlDoc.async = false;

   if (!StorageDevice || !(xmlStr = StorageDevice.EnumerateItems(PhotoStorePath, "image/jpeg")) ||!xmlDoc.loadXML(xmlStr)) 
   { 
  		return "";
   }

	var nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 1]");
    var AlbumArray=new Array();    
	var len=nodes.length
    
	if(len<=0)
	    return "";
    var i=0;       
	for (i = 0; i < len; i++)
	    AlbumArray[i]=nodes.item(i);

	nodes=AlbumArray.sort(SortNodes);

	var path=nodes[0].selectSingleNode(".//a:href").text;
 	FirstAlbum=GetFileName(path); // return the first album name

	return FirstAlbum;
}

function GetFirstPhotoInAlbum(VolumeName, AlbumPath)
{
   	var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc.async = false;

    AlbumPath=AlbumPath.substr(VolumeName.length+2);

	xmlData=TVShell.StorageManager.Item(VolumeName).EnumerateItems(AlbumPath,"image/jpeg",-1,-1,-1,true);

	var item = new Array();

	if (xmlData && xmlDoc.loadXML(xmlData)) 
	{
       var FileNodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 0]");
	   var fileNode= FileNodes.item(0);

	   if(fileNode)
	   {  item[0] = fileNode.selectSingleNode(".//a:displayname").text;
	      var nodeObj=fileNode.selectSingleNode(".//a:getcontenttype");
	      if(nodeObj)
		    item[1]=nodeObj.text;
	      else
		    item[1]="Unknown";


          item[2] = fileNode.selectSingleNode(".//a:href").text;
		}	
    }
    
	delete xmlDoc;
	return item;
}


function FormatURL (srcURL)
{
	if(srcURL && !IsNetworkFile(srcURL) && srcURL.toLowerCase().substr(0, 7) != "file://")
	{
		var tempURL = "file://" + srcURL;
		return tempURL;
	}
	else
		return srcURL;
}

function IsNetworkFile(fileName)
{
	if (fileName && fileName.toLowerCase().substr(0, 7) == "http://")
		return true;
	else
		return false;
}

function ResizeAndGetURL(imageURL, photoAreaHeight, photoAreaWidth, fGetItNow)
{
	if(imageURL)
	{	
		if(IsInRotatedImageList(imageURL))
		{
			return FormatURL(PhotoManager.GetRotatedImageURL(imageURL));
		}

		// shrink by maintaining proportions
		var tempURL = PhotoManager.RequestResizedImage(imageURL, fGetItNow);
		tempURL = FormatURL(tempURL);
		//TVShell.Message("returning tempURL " + tempURL);
		return tempURL;
		
	}
	return "";
}

			
function ChangeForwardToBackwardSlash( element ) 
{
	if(element)
	{
		var re = /[/]/g; 
		return element.replace(re, '\\');
	}
}

function ChangeBackwardToForwardSlash( element ) 
{
	if(element)
	{
		var re = /[\\]/g; 
		return element.replace(re, '/');
	}
}

function EscapeScriptString(element)
{
	if (element) {
		var re = /['"\\]/g;
		return element.replace(re, "\\$&");
	}
}

function IsInRotatedImageList(srcURL)
{
	var UID = srcURL;
	if(XMLFileURL && PhotoManager.FingerPrint)
	{
		UID = PhotoManager.FingerPrint;
		var indexPos  = srcURL.lastIndexOf("&msntvIndex=");
		if(indexPos != -1)
		{
			UID+= srcURL.slice(indexPos);
		}
	}
	var retVal= PhotoManager.IsInRotatedImageList(UID);
	return retVal;
}

// UNC share related code

var HomeNetworkObj	= TVShell.ConnectionManager.HomeNetworking;

function Mount(i,j)
{
	
	var he = HomeNetworkObj.Item(i);
	if(he)
	{
		TVShell.Message( "mount " + i + " " + j );
		var se = he.Item(j);
		if(se)
		{
			TVShell.Message("mounting " + se.Name);
			SetProgressStopFunction(null);
			SetProgressText(PROGRESS_PLEASE_WAIT + "Connecting...");
			SetProgressPercent(50);
			ShowProgressPanel();
			se.Mount();
		}
	} 
}

function GotoURL(destURL)
{
	if(destURL)
		document.location = destURL;
}

function GetPath( StorageDeviceVN, hrefText)
{
	var hrefTextLC = hrefText.toLowerCase();
	var pathText = hrefText;
	var slashPos = hrefTextLC.indexOf(StorageDeviceVN.toLowerCase());
	if(slashPos != -1)
		pathText = hrefText.slice(slashPos+StorageDeviceVN.length + 1);
		
	return pathText;
}

// Picker/select Device panel related code

function HidePickerPanel()
{
	TVShell.Message("hiding photo picker panel");
	PanelManager.Hide("PhotoPickerPanel");
}

function OnCancel()
{
	if(fileOpen)
		PanelManager.CloseGetFileOpen(IDCANCEL);
	HidePickerPanel();
}
			
function ConfirmSignOn()
{
	if(!CurrentUser || !CurrentUser.IsAuthorized)
	{
		var msgTxt = "You must be signed in to perform this action.  Select <b>Sign In</b> to stop what you are doing and go to the Sign In screen."
		var result = PanelManager.CustomMessageBox(msgTxt,"","Sign In;Cancel;",1,"", false, 0x30, 1);
		if(result==0)
			GotoSignOn();
		return;	
	}
}

function GetImageHREFNodes(StorageDevice, path)
{
	var result="";
	
	if (StorageDevice) 
	{
		var xmlStr = StorageDevice.EnumerateItems(path, "image/jpeg");
		if (xmlStr) 
		{
			var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
			xmlDoc.async = false;

			if (xmlDoc.loadXML(xmlStr)) 
			{
				var nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 0]");
				if (nodes && nodes.length > 0) 
				{
					var i;
					for (i = 0; i < nodes.length; i++)
					{
						var node= nodes.item(i);
						var hrefNodeText    = node.selectSingleNode(".//a:href").text;
						
						result+=hrefNodeText;
						result+="\n";
					}
				}
			}
		}
	}
	return result;						
}
