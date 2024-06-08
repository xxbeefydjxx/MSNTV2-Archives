//  favorites.js
// 
// requires TVShell.js
//
//  This file contain all of the Favorites functions (Add/Delete/Move/Rename) needed to interact with skydrive.
//

//======   global variables  ============================================================

var g_appID = "";
var g_CID_DEC = "";
var g_CID_HEX = "";
var g_Ticket = "";
var g_servicePolicy = "";
var g_serviceTarget = "";
var g_requestCount=0;
var g_oFavXml = null;
var g_RoamingAllowed=false;
var g_favoritesMgr = TVShell.UserManager.CurrentUser.Favorites;

// constants
var MAXIMUM_REQUEST_COUNT=3;
var UPDATE_FAV = true;	// indicate for update favorite
var NEW_FAV = false;		// it is for new favorite
var ASYNCHRONOUS = true;    // request will return immediately
var SYNCHRONOUS = false;		// wait for the request to return.
var A_FAVORITE = "favorite";
var A_FOLDER = "folder";

//======   Utility functions  ============================================================

// remove the .url from the end of the favorite name.
function cleanFavoriteName( s )
{
	if ( typeof( s ) == "undefined" || s == "" )
	{
		return ""
	}
	else
	{
		var dotURL = s.lastIndexOf(".url");

		if ( dotURL > 0 && s.substr(dotURL).length == 4 )
		{
			return s.substring(0, dotURL );
		}
	}

	// didn't find the .url
	return s;
}




//======   IDCRL functions  ============================================================

function RequestToken(fNetwork)
{
	g_requestCount++;
	var result;
	if(fNetwork)
	   result=TVShell.LoginManager.IDCRLAuthenticateToService(g_serviceTarget,g_servicePolicy,0);
	else
	   result=TVShell.LoginManager.IDCRLAuthenticateToService(g_serviceTarget,g_servicePolicy);

	if(result!=0 && g_requestCount<=MAXIMUM_REQUEST_COUNT)
		  setTimeout("RequestToken("+fNetwork+")",1000);
	else
	    g_requestCount=0;
}


function isIDCRLErrorCode( theCode )
{
	// when high bit is set, it is an error
	if ( theCode & 0x80000000 )
		return true;

	return false;
}

function getIDCRLCode( theCode )
{
	return (theCode & 0xFF);
}


function IDCRLOnAuthStateChanged(result,authState,requestStatus, user, serviceTarget,servicePolicy,token,webFlowUrl)
{
	if(TVShell.UserManager.CurrentUser.EMail!=user || g_serviceTarget!=serviceTarget || g_servicePolicy!= servicePolicy ||
		(isIDCRLErrorCode(authState)  || getIDCRLCode(authState) != 0x03) || 
		( isIDCRLErrorCode(requestStatus) || getIDCRLCode(requestStatus) != 0x00)){
		TVShell.EventLog.Important("IDCRLOnAuthStateChanged error.    Target=" + g_serviceTarget);
		return;
	}

	if ( token != "" ){
		g_Ticket = token;

		g_CID_HEX = TVShell.LoginManager.IDCRLGetCID( TVShell.LoginManager.User);
		g_CID_DEC = TVShell.Utilities.LLongToDecimalString( g_CID_HEX );

		TVShell.Message("target=" + g_serviceTarget + "   ticket: " + g_Ticket );
		TVShell.Message("          CID_HEX = " + g_CID_HEX + "      CID_DEC = " + g_CID_DEC );
		
	}
	else
		TVShell.EventLog.Important("target=" + g_serviceTarget + "       No token");
	
}

//======   Skydrive functions  ============================================================

// create a favorite/folder XML for sending to skydrive
function CreateFavoriteXML(sItemType, sTitle, isUpdate, sURL )
{
	var strArray = new Array();
	var i=0;
	var xmlString;
	
	strArray[i++] = "<?xml version=\"1.0\" encoding=\"utf-8\"?><entry xmlns:live=\"http://api.live.com/schemas\" xmlns=\"http://www.w3.org/2005/Atom\" ><title>";
	strArray[i++] = TVShell.Utilities.EscapeHTML(sTitle);
	TVShell.Message("EscapeHTML()  Title=" + TVShell.Utilities.EscapeHTML(sTitle));

	if ( sItemType == A_FAVORITE)
		strArray[i++] = ".url";

	strArray[i++] = "</title>";
	if ( sItemType == A_FAVORITE && typeof(isUpdate) != "undefined"  && isUpdate == false )
	{
		strArray[i++] = "<link rel=\"related\" href=\"";
		strArray[i++] = TVShell.Utilities.EscapeHTML(sURL);
		strArray[i++] = "\" />";
		TVShell.Message("EscapeHTML()  URL=" + TVShell.Utilities.EscapeHTML(sURL));
	}
	strArray[i++] = "<live:type>";
	strArray[i++] = sItemType;
	strArray[i++] = "</live:type></entry>";

	xmlString = strArray.join("");
	delete strArray;
	strArray = null;

	TVShell.Message("    CreateFavoriteXML() " + xmlString );
	return xmlString;
	
}


// create a SkyDrive favorite object containing the id and modified date
function SkyDriveEntryInfo( id, updated)
{
	this.url = id;	// id of the new or updated favorite/folder
	this.updated = updated;  // modified date of the favorite/folder
}


// given the response XML extract the ID of the favorite/folder and the modified date
function GetSkyDriveEntryInfo( entryXML )
{
	var doc = TVShell.CreateXmlDocument();
	doc.async = false;
	doc.loadXML( entryXML );

	TVShell.Message("  GetSkyDriveEntryInfo()    " + entryXML);
	
	var idNode = doc.selectSingleNode("//id");
	var updateNode = doc.selectSingleNode("//updated");

	var idTxt = "";
	var updateTxt = "";

	if ( idNode != null )
		idTxt = idNode.text ;
	if ( updateNode != null )
		updateTxt = updateNode.text;

	TVShell.Message("   idTxt = " + idTxt + "      updateTxt = " + updateTxt);
	var skyDriveEntry = new SkyDriveEntryInfo( idTxt, updateTxt );

	idNode = null;
	updateNode = null;
	doc = null;

	return skyDriveEntry;
}


// Save favorites to the box
function SaveFavorites()
{
	g_favoritesMgr.saveFavorites();
}


// update the favorites count
function UpdateFavoriteCount()
{
	var favoritesList=g_oFavXml.selectNodes("//favorite");
	var folderList=g_oFavXml.selectNodes("//favfolder");
	
	TVShell.UserManager.CurrentUser.FavoritesCount=favoritesList.length+folderList.length;
}


// update the favorite in the local box.
//   take the given id of the favorite and add a "u" attribute and update the recent
//   modified date to the root of the favorites.
//
function UpdateLocalFavorites( id, skyDriveInfo)
{
	var hr = false;
	
	if ( id != null && skyDriveInfo != null )
	{
		var node = g_oFavXml.selectSingleNode("//*[@id='" + id + "']");
		if ( node != null )
		{
			node.setAttribute("u", skyDriveInfo.url );
		}

		node = g_oFavXml.selectSingleNode("/favorites");
		node.setAttribute("v", skyDriveInfo.updated);

		hr = true;
	}

	return hr;
}



// Create an XML request
function XmlRequest( cmdVerb, async, apiURL, data, asynchandler, headerArray)
{
    var httpRequest = null;

    try
    {
    		TVShell.Message("Favorites.html      CmdVerb = " + cmdVerb );
		TVShell.Message("        URL = " + apiURL );

		// make sure there is an URL
		if ( apiURL == null || apiURL == "" )
			return httpRequest;
		
		if ( cmdVerb.toLowerCase() == "get")
		{
			// need to clear the cache for the URL before calling a GET
			TVShell.ClearInternetCache( apiURL, false);
		}

		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		
		httpRequest.open( cmdVerb, apiURL, async);

		// for Async request
		if ( async == true )
		{
			httpRequest.onreadystatechange = function() {
				if ( httpRequest.readyState == 4 )
					asynchandler( httpRequest );
			}
		}

		// headers for skydrive
		httpRequest.setRequestHeader("AppID", g_appID);
		httpRequest.setRequestHeader("Authorization", "WLID1.0 " + g_Ticket);
		httpRequest.setRequestHeader("Content-Type", "application/atom+xml");
		httpRequest.setRequestHeader("Accept", "application/atom+xml");

		// add additional headers if available.  headerArray is an array of strings
		//   each string is in the following format  "header:value"
		//
		if ( typeof(headerArray) != "undefined" && headerArray.length > 0 )
		{
			
			for( var i=0; i < headerArray.length; i++)
			{
				var header = headerArray[i];
				var colonIdx = header.indexOf(":");
				if ( colonIdx > 0 ){
					httpRequest.setRequestHeader( header.slice(0,colonIdx) , header.slice(colonIdx+1));
				}
			}
		}
     
        httpRequest.send( data );
    }
    catch( e )
    {
        TVShell.Message("favorites.html    XmlRequest()   Exception: " + e.message);
	 httpRequest = null;
    }
    
    return httpRequest;
}

function ProcessXmlRequest( httpReq, expectStatus, ignoreResponse )
{
	if ( (typeof(httpReq) == "undefined" || httpReq == null) && typeof(expectStatus) == "undefined" )
		return null;

	var skyDriveEntry = null;
	
	if ( httpReq != null )
	{
		if ( httpReq.status == expectStatus )
		{
			if ( ignoreResponse == false )
			{
				skyDriveEntry = GetSkyDriveEntryInfo( httpReq.responseText );
			}
			else
			{
				// create an empty skyDriveEntry
				skyDriveEntry = new SkyDriveEntryInfo( "", "" );
			}

			return skyDriveEntry;
		}
		
		if (httpReq.status == 403 )
		{
			// did the server said it is something that already exists.  The subcode is 2.
			var subCodeStr = httpReq.responseText;
			if ( subCodeStr != "" )
			{
				var subCodeArray = subCodeStr.split(":");
				if ( subCodeArray[0] == 2 )
				{
					TVShell.Message(httpReq.responseText);					
					TVShell.PanelManager.CustomMessageBox("<p>A favorite or folder with that name already exists.</p>Please choose a different name.","", "OK", 0,"", false, MGX_ICON_WARNING, MGX_SIZE_SMALL);

					return skyDriveEntry;
				}
			}
		}
		//If the requested item not found
		if (httpReq.status == 404 && expectStatus == 204) // 204-No Content
		{
			// This scenario is to handle a delete request failure, item already deleted.
			// create an empty skyDriveEntry
			skyDriveEntry = new SkyDriveEntryInfo( "", "" );
			return skyDriveEntry;
		}
		else if (httpReq.status == 404 && (expectStatus == 201 || expectStatus == 200) )
		{	// expectStatus == 201: The target folder does no exist - move to folder or create fav in folder
			// expectStatus == 200: while editing a fav or folder
			skyDriveEntry = null;
			TVShell.PanelManager.CustomMessageBox("<P>The operation could not be completed because your Favorites are out of sync with SkyDrive. To synchronize you’ll need to Sign-out and Sign back in.","", "OK", 0,"", false, MGX_ICON_WARNING, MGX_SIZE_SMALL);
			return skyDriveEntry;
		}
		
		
		TVShell.Message("ProcessXmlRequest()   expecting status= " + expectStatus + "    response status=" + httpReq.status );
		TVShell.Message(httpReq.responseText);
		TVShell.PanelManager.CustomMessageBox("<P>Your request cannot be completed at this time.</P>Please try again later.","", "OK", 0,"", false, MGX_ICON_WARNING, MGX_SIZE_SMALL);
		
	}

	return skyDriveEntry;

}


// Add a favorite to a given node
function AddFavorite( folderNode, favName, url, thumbnailURL )
{
	var sFavoriteID = null;

	if ( folderNode && favName && url )
	{
		var hr=0;
		var skydriveStatus = null;
		
		if ( g_RoamingAllowed ){
			hr = 1;
			var folderAPI = folderNode.getAttribute("u");
			var favXMLStr = CreateFavoriteXML(A_FAVORITE, favName, NEW_FAV, url );
			
			TVShell.Message(favXMLStr);
			var httpReq = XmlRequest("POST", SYNCHRONOUS, folderAPI, favXMLStr );
			var skydriveStatus = ProcessXmlRequest(httpReq, 201, false);
			if ( skydriveStatus != null ){
				hr = 0;
			}
			httpReq = null;
		}

		if (hr == 0 )
		{
			sFavoriteID = g_favoritesMgr.newFavorite(folderNode, favName, url, thumbnailURL);
			if ( g_RoamingAllowed ){
				UpdateLocalFavorites( sFavoriteID, skydriveStatus );
				skydriveStatus = null;
			}

			SaveFavorites();
			UpdateFavoriteCount();
		}
		
	}

	return sFavoriteID;
}


// Add a favorite folder to a given node
function AddFavoriteFolder(folderNode, newFolderName)
{
	var sFolderID = null;
	
	if ( folderNode && newFolderName )
	{
		var hr = 0;
		var skydriveStatus = null;
		
		if ( g_RoamingAllowed )
		{
			hr = 1;
			var folderAPI = folderNode.getAttribute("u");
		
			var fldXmlStr = CreateFavoriteXML(A_FOLDER, newFolderName, NEW_FAV, "");
			var httpReq = XmlRequest("POST", SYNCHRONOUS, folderAPI, fldXmlStr);

			skydriveStatus = ProcessXmlRequest(httpReq, 201, false);
			if ( skydriveStatus != null )
				hr = 0;
			httpReq = null;
		}
	
		if ( hr == 0 )
		{
			sFolderID = g_favoritesMgr.newFolder(folderNode, newFolderName);

			if ( g_RoamingAllowed ){
				UpdateLocalFavorites( sFolderID, skydriveStatus);
				skydriveStatus = null;
			}
			
			SaveFavorites();
			UpdateFavoriteCount();
		}
	}
	
	return sFolderID;
}



// this will delete a favorite or a favorite folder.
function DeleteFavorite( deleteNode )
{
	var delOK = 0;
	// make sure the it is the root node before deleting
	if ( deleteNode != null && deleteNode.tagName != "favorites")
	{
		var skydriveStatus = null;
		
		
		if ( g_RoamingAllowed ){
			delOK = 1;
			var deleteAPI = deleteNode.getAttribute("u");
			var httpReq = XmlRequest("DELETE", SYNCHRONOUS, deleteAPI, "");

			skydriveStatus =  ProcessXmlRequest(httpReq, 204, true);
			if ( skydriveStatus != null )
				delOK = 0;
			
			httpReq = null;
			skydriveStatus = null;
		}

		if ( delOK == 0 )
		{
			g_favoritesMgr.deleteItem( deleteNode);
			SaveFavorites();
			UpdateFavoriteCount();			
		}
	}

	return delOK;
}




// this will rename either a favorite or a favorite folder.  
//  The newURL will not be use for now, since Skydrive API doesn't support it yet.
//
function RenameFavorite( renameNode, newName, newURL )
{
	var renameOK = 0;

	if ( renameNode != null && newName != "" )
	{
		var skydriveStatus = null;

		if ( g_RoamingAllowed )
		{
			renameOK = 1;
			var favAPI = renameNode.getAttribute("u");
			var nodeType = A_FAVORITE;

			// check to see if it is a folder
			if( renameNode.tagName == "favfolder")
				nodeType = A_FOLDER;
			
			var favXmlStr = CreateFavoriteXML(nodeType, newName, UPDATE_FAV, "");
			var httpReq = XmlRequest("PUT", SYNCHRONOUS, favAPI, favXmlStr);

			skydriveStatus = ProcessXmlRequest(httpReq, 200, true);
			if ( skydriveStatus != null )
				renameOK = 0;

			skydriveStatus = null;
			httpReq = null;

		}

		if ( renameOK == 0 )
		{
			g_favoritesMgr.renameItem(renameNode, newName, newURL);
			SaveFavorites();
		}
	}
	
	return renameOK;

}




// moving favorites requires 2 actions, 
//  1) create a new favorite in the destination folder
//  2) delete the favorite.
//
function MoveFavorite( destFolderNode, favNode )
{
	var moveOK = 0;
	if ( destFolderNode != null && favNode != null )
	{
		var skydriveStatus = null;
		
		if ( g_RoamingAllowed ){

			moveOK = 1;
			
			var destFolderAPI = destFolderNode.getAttribute("u");
			var favName = favNode.selectSingleNode("title").text;
			var favURL = favNode.selectSingleNode("href").text;
			var favXmlstring = CreateFavoriteXML(A_FAVORITE, favName, NEW_FAV, favURL);
			
			var httpReq = XmlRequest("POST", SYNCHRONOUS, destFolderAPI, favXmlstring);
			skydriveStatus = ProcessXmlRequest(httpReq, 201, false);
			httpReq = null;

			if ( skydriveStatus != null )
			{
				// now delete the original favorite
				var delFavoriteAPI = favNode.getAttribute("u");
				var httpReq2 = XmlRequest("DELETE", SYNCHRONOUS, delFavoriteAPI, "");

				var skydriveStatus2 = ProcessXmlRequest(httpReq2, 204, true);
				if ( skydriveStatus2 != null )
				{
					moveOK = 0;
					skydriveStatus2 = null;
					UpdateLocalFavorites(favNode.getAttribute("id"), skydriveStatus);
				}
				httpReq2 = null;
				skydriveStatus = null;
			}
		}

		if ( moveOK == 0 )
		{
			g_favoritesMgr.moveItem(favNode, destFolderNode);
			SaveFavorites();
		}
	}

	return moveOK;
}




