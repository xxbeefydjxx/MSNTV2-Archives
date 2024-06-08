

var helpServer;
var email = TVShell.UserManager.CurrentUser ? TVShell.UserManager.CurrentUser.EMail : "";

if (email.indexOf("-int.com") > 0)
	helpServer= "https://help.msn-int.com";
else if (email.indexOf("-ppe.com") > 0)
	helpServer = "https://help.msn-ppe.com";
else
	helpServer = "https://help.msn.com";

var baseURL = helpServer + "/!data/en_us/data/msntvv1.its51/$content$/";	//	Example:  https://help.msn-int.com/!data/en_us/data/msntvv1.its51/$content$/
//var baseURL = "http://svc-roghu-12.northamerica.corp.microsoft.com:1800/PaneHelp/";

/*	Function: CallPaneHelp

	Purpose: Sets up the arguments for the DoHelp function located in helppane26.js
		This simplifies what the engineer needs to know when calling Pane Help.

		Used by non-panel pages
	
	Parameters: There are 3 ways to call this function. [] = optional
			
		To show a topic table of contents (MSNTV_TRS_TOC_feature.htm)
			CallPaneHelp(PH_topicTOC, HTM PaneHelp TOC page name, [subtopic name])
		
		To show the main table of contents (main menu)
			CallPaneHelp(PH_TOC)
			
		To show a diploma
			CallPaneHelp(PH_diploma, HTM PaneHelp page name, [full URL to jump to after diploma])
	
		To search for keyword: NOT SUPPORTED
			CallPaneHelp(PH_search, keyword, topic display string)
			
		To show specific page
			CallPaneHelp(PH_specificPage, HTML PaneHelp page name)

	Sets global values used by function doHelp:
		H_TOPIC: for searches (PH_search), this is the keyword to search for
				for non-searches, this is the name of the html page
		bSearch: true for searches (PH_search), false for non-searches
*/
var PH_search = 0;
var PH_specificPage = 1;
var PH_TOC = 2;
var PH_topicTOC = 3;
var PH_diploma = 4;

var clientVerAppendStr = "_v11";

function insertVersionInFilename(filename)
{
	var HTMsuffixPos = filename.indexOf(".htm");
	if (HTMsuffixPos == -1)
	{
		alert("filename not HTM: "+filename);
		return "";
	}
	var stuffBeforeSuffix = filename.substring(0, HTMsuffixPos);
	var suffix = filename.substring(HTMsuffixPos);

	var newFileName = stuffBeforeSuffix + clientVerAppendStr + suffix;
	return newFileName;
}



/////////////////////// CONSIDER ADDING ANOTHER PARAMETER indicating whether to use top.location or document.location
function CallPaneHelp(hmode)
{
	//	Remember where to come back to

	if (hmode == PH_topicTOC) 
	{
		//	TOC:	CallPaneHelp(PH_topicTOC, HTM PaneHelp TOC page name, [subtopic name])
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	No retURL will be passed, so the server will return to this page of origin from the sub-TOC via history.back
	}
	else
	if (hmode == PH_diploma) 
	{
		//	Diploma:	CallPaneHelp(PH_diploma, HTM PaneHelp page name, URL to go to after diploma)
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	retURL must be specified because diplomas can be more than 1 page
		if (arguments[2])
			//	Diplomas may jump to a new page rather than returning to page of origin
			PaneHelpURL += "?jumpURL=" + escape(arguments[2]);
		else
			//	Return to page of origin
			PaneHelpURL += "?retURL=" + encodeURIComponent(window.location.href);
	}
	else
	if (hmode == PH_TOC) 
	{
		//	Main TOC:		CallPaneHelp(PH_TOC)
		PaneHelpURL = baseURL + insertVersionInFilename('MSNTV_ALTTOC_main.htm');
		//	No retURL will be passed, so the server will return to this page of origin from the main TOC via history.back
	}
	else
	if (hmode == PH_search) 
	{
		alert("Help search is not supported");
		return;
	}
	else
	if (hmode == PH_specificPage) 
	{
		//	Specific page: CallPaneHelp(PH_specificPage, HTML PaneHelp page name)
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	retURL must be specified because detail pages can be more than 1 page
		//	Return to page of origin
		PaneHelpURL += "?retURL=" + encodeURIComponent(window.location.href);
	}

////alert("CallPaneHelp hmode="+hmode+", PaneHelpURL="+PaneHelpURL +"'");

	top.location = PaneHelpURL;
}


//	Returns URL to help page
//	Used by panels

function GetPaneHelpURL(hmode)
{
	
	if (hmode == PH_topicTOC) 
	{
		//	TOC:	CallPaneHelp(PH_topicTOC, HTM PaneHelp TOC page name, [subtopic name])
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	No retURL will be passed, so the server will return to this page of origin from the sub-TOC via history.back
	}
	else
	if (hmode == PH_diploma) 
	{
		//	Diploma:	CallPaneHelp(PH_diploma, HTM PaneHelp page name, URL to go to after diploma)
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	retURL must be specified because diplomas can be more than 1 page
		if (arguments[2])
			//	Diplomas may jump to a new page rather than returning to page of origin
			PaneHelpURL += "?jumpURL=" + escape(arguments[2]);
		else
			//	Return to page of origin
			PaneHelpURL += "?retURL=" + encodeURIComponent(window.location.href);
	}
	else
	if (hmode == PH_TOC) 
	{
		//	Main TOC:		CallPaneHelp(PH_TOC)
		PaneHelpURL = baseURL + insertVersionInFilename('MSNTV_ALTTOC_main.htm');
		//	No retURL will be passed, so the server will return to this page of origin from the main TOC via history.back
	}
	else
	if (hmode == PH_search) 
	{
		alert("Help search is not supported");
		return;
	}
	else
	if (hmode == PH_specificPage) 
	{
		//	Specific page: CallPaneHelp(PH_specificPage, HTML PaneHelp page name)
		PaneHelpURL = baseURL + insertVersionInFilename(arguments[1]);	//	HTM PaneHelp page name (non-search)
		//	retURL must be specified because detail pages can be more than 1 page
		//	Return to page of origin
		PaneHelpURL += "?retURL=" + encodeURIComponent(window.location.href);
	}

	return PaneHelpURL
}


function GetCompatPrinterListURL()
{

 if(TVShell.UserManager.CurrentUser && TVShell.UserManager.CurrentUser.IsAuthorized)
   return GetPaneHelpURL(PH_topicTOC,'MSNTV_PROC_SINGLE_Printing_CompatPrinters.htm');
 else
   return "msntv:/Help/MSNTV_PROC_SINGLE_Offline_printhelp.htm";		   

}

function GetDMRHelpURL(which)
{
	if (which == "")
		which = "MSNTV_TRS_TOC_Photos";

	if(TVShell.UserManager.CurrentUser && TVShell.UserManager.CurrentUser.IsAuthorized)
	{
		switch (which)
		{
			case "MSNTV_PROC_SINGLE_Photos_Albums":
				which = "MSNTV_TRS_TOC_Photos";
				break;
			case "MSNTV_PROC_SINGLE_Photos_MemoryCard":
				which = "MSNTV_PROC_SINGLE_Photos_CardReader";
				break;
		//	case "MSNTV_TRS_TOC_Videos":
		//	case "MSNTV_TRS_TOC_Music":
		//		return "msntv:/Help/" + which + "_Offline_v11.htm";	// for now, on online help
		}
		
		return GetPaneHelpURL(PH_topicTOC, which+".htm");
	}
	else
		return "msntv:/Help/" + which + "_Offline_v11.htm";		   
}
