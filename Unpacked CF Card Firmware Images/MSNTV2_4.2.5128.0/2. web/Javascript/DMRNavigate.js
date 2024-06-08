var Utilities				= TVShell.Utilities;
var parameters				= FindParameters(PanelManager);
var DirectoryArray;
var PlaylistArray;
var DMRItemArray;
var g_fTruncated = false;

function IsNetworkFile(fileName)
{
	if (fileName && fileName.toLowerCase().substr(0, 7) == "http://")
		return true;
	else
		return false;
}

function FormatURL(srcURL)
{
	if(srcURL && !IsNetworkFile(srcURL) && srcURL.toLowerCase().substr(0, 7) != "file://")
	{
		var tempURL = "file://" + srcURL;
		return tempURL;
	}
	else
		return srcURL;
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

function EscapeScriptString(element)
{
	if (element) {
		var re = /['"\\]/g;
		return element.replace(re, "\\$&");
	}
}

// Directory constructor
function Directory(name, art, href)
{
	this.name = name;
	this.href= href;
	this.art = art;
}

// DMRItem constructor
function DMRItem(name, href, contentType, checked)
{
	var file = href.slice(href.lastIndexOf("\\") + 1);
	var extension = file.slice(file.lastIndexOf(".") + 1);
	this.ext = extension.toLowerCase();
	this.name = Utilities.EscapeHTML(name);
	this.href = FormatURL(href);
	this.contentType = contentType;
	this.checked = checked;
}

function BuildArrays(itemTypes)
{
	var checked = false;
	var st = new Date().getTime();
    g_fTruncated = false;
	DirectoryArray = new Array();
	PlaylistArray = new Array();
	DMRItemArray = new Array();
	
	if (StorageManager && StorageDeviceVN) {	
		StorageDevice = StorageManager.Item(StorageDeviceVN);	
		if (StorageDevice && StorageDevice.Mounted) {

			var xmlStr = StorageDevice.EnumerateItems(path, itemTypes + "," + playlistTypes, 1);
			var xmlDoc = xmlStr ? new ActiveXObject("Msxml2.DOMDocument") : null;
			var nodes = null;
			var i;

			if (xmlDoc) {
				xmlDoc.async = false;
				if (!xmlDoc.loadXML(xmlStr)) {
					xmlDoc = null;
				}
			}
            
			if(xmlDoc)
			{
			    var statusNode=xmlDoc.documentElement.selectSingleNode("//status");
                if(statusNode)
				{
					var statusAttributes=statusNode.attributes;
					if(statusAttributes && statusAttributes.length>=3)
					{   
						var TotalMatches=statusAttributes.item(1).value;
						var NumberReturned=statusAttributes.item(2).value;
					    if(TotalMatches > NumberReturned)
						   g_fTruncated=true;
						TVShell.Message("TotalMatches="+TotalMatches);
						TVShell.Message("NumberReturned="+NumberReturned);
					}
				}
			}

			// Build directory array
			if (xmlDoc) {
				nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 1]");
			}
			if (nodes && nodes.length > 0) {
				var length = nodes.length;

				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var name = node.selectSingleNode(".//a:displayname").text;
					var href = node.selectSingleNode(".//a:href").text;
					var optionalNode = node.selectSingleNode(".//a:displayhref");
					var art = null;
					
					if (optionalNode) {
						art = optionalNode.text;
					}
					if (href) {
						DirectoryArray[i] = new Directory(name, art, href);
					}
				}
			}

			// Build playlist and track arrays
			if (xmlDoc) {
				nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 0]");
			}
			if (nodes && nodes.length > 0) {
				var length = nodes.length;

				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var name = node.selectSingleNode(".//a:displayname").text;
					var href = node.selectSingleNode(".//a:href").text;
					var contentType = node.selectSingleNode(".//a:getcontenttype").text;

					if (href) {
						if (playlistTypes.indexOf(contentType) >= 0) {
							PlaylistArray.push(new DMRItem(name, href, contentType,checked));
						}
						else {
							DMRItemArray.push(new DMRItem(name, href, contentType,checked));
						}
					}
				}
			}
		}
	}

	var et = new Date().getTime();
	TVShell.Message( "BuildArrays(). time=" + (et-st) );
}

function WriteHeadingLabel(StorageDeviceVN, path)
{
	if(StorageDeviceVN)
	{
		var StorageDevice = StorageManager.Item(StorageDeviceVN);	
		if (StorageDevice) 
			StorageDeviceVN = StorageDevice.Name;
		
		var DeviceName = "";
		var slashPos = StorageDeviceVN.indexOf("\\\\");
		if(slashPos!=-1)
		{
			DeviceName = StorageDeviceVN.slice(slashPos+2);
			slashPos = DeviceName.indexOf("\\");
			if(slashPos!=-1)
			{
				DeviceName = DeviceName.slice(0,slashPos);	
			}
		}else
		{
			slashPos = StorageDeviceVN.indexOf("\\");
			if(slashPos!=-1)
			{
				DeviceName = StorageDeviceVN.slice(slashPos+1);
			}
			else
				DeviceName = StorageDeviceVN;
		}
		
		if(path)
		{
			slashPos = path.lastIndexOf("\\");
			if(slashPos!=-1)
			{
				var StorageDevice = StorageManager.Item(userDataVolumeName);
				if (StorageDevice &&(DeviceName.toLowerCase()==StorageDevice.Name.toLowerCase()))
					DeviceName= path.slice(slashPos+1);
				else
				{
					DeviceName+= " : ";
					DeviceName+= path.slice(slashPos+1);
				}
			} else
			{
				DeviceName+= " : ";
				DeviceName+= path;
			}
		}
		if(document.all.Heading && DeviceName!="") {
			Heading.subTitle = DeviceName;
		}
	}
}

function ShowArt(artURL)
{
	var artImage = document.all.artImage;

	if (artImage) {
		if (artURL && artURL != "noart") {
			artImage.style.visibility = "visible";
			artImage.src = artURL;
		} else
			artImage.style.visibility = "hidden";
	}
}

function GetParentLocationString( devVN, parentDir )
{
	var res = "";
	TVShell.Message( "devVN='" + devVN + "'" );
	TVShell.Message( "parDir='" + parentDir + "'" );

	if ( parentDir != null )
		res = " within " + parentDir;
	else if (devVN != null)
	{
		var i = devVN.lastIndexOf("\\");
		if ( i > -1 && (i+1) < devVN.length )
			res = " within " + devVN.substring( i +1, devVN.length );
	}
	return res;
}

function BuildDirectoryList(container)
{
	if(!DirectoryArray || DirectoryArray.length <= 0)
		return;
		
	var st = new Date().getTime();

	var  group = container.document.createElement("SPAN");
	group.className = "groupLabel";
	group.style.borderBottom = "none";
	group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(../Images/MediaFolder.png);\"></div>Folders" + GetParentLocationString(StorageDeviceVN,path);
	container.appendChild(group);

	var div = container.document.createElement("DIV");
	div.className="folderLabel";
	div.id = "directoryListDiv";
	div.style.paddingBottom = 10;
	
	var divHTML = new Array();
	var j=0;
	divHTML.length++;
	divHTML[j++] = "<UL style=\"margin-top:-12px;\">";

	for (i=0; i < DirectoryArray.length; i++) {
		var destURL="Viewer.html";
		destURL+="?location=" + location;
		if(StorageDeviceVN) {
			destURL+="&StorageDeviceVN=" + escapeplus(escape(StorageDeviceVN));
			
			var pathText = GetPath(StorageDeviceVN, DirectoryArray[i].href);
			if(pathText)
				destURL+="&path=" + escapeplus(escape(pathText));
		}
			
		var artURL = "noart";

		if (DirectoryArray[i].art && DirectoryArray[i].art != "") {
			artURL = FormatURL(DirectoryArray[i].art);
			destURL += "&artURL=" + escapeplus(escape(artURL));
		}
		
		divHTML.length++;
		divHTML[j++] = "<li><span class=\"li\"><a id=\"folder" + i + "\" style=\"display:inline-block;\" onfocus=\"parent.ShowArt('" + EscapeScriptString(artURL) + "');\" onclick=\"parent.GotoURL('" + EscapeScriptString(destURL) + "');\">" + Utilities.EscapeHTML(DirectoryArray[i].name) + "</a></span></li>";
	}
	
	divHTML.length++;
	divHTML[j++]= "</UL>";
	div.innerHTML = divHTML.join("");
	container.appendChild(div);		

	var et = new Date().getTime();

	TVShell.Message( "BuildDirectoryList(). time="
					+ (et - st));
}


function BuildPlaylistList(container, icon)
{
	if(!PlaylistArray || PlaylistArray.length <= 0)
		return;
		
	var  group = container.document.createElement("DIV");
	group.className = "groupLabel"
	if (icon) {
		group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(" + icon + ");\"></div>Playlists";
	}
	else {
		group.innerHTML = "<div style=\"width:1px; height:31px; display:inline;\"></div>Playlists";
	}
	container.appendChild(group);

	var div = container.document.createElement("DIV");
	div.className="playlistLabel";
	div.id = "playlistListDiv";
	div.style.paddingBottom = 25;
	
	var divHTML = new Array();
	var j=0;

	for (i = 0; i < PlaylistArray.length; i++) {
		var dmrItem = PlaylistArray[i];

		divHTML[j++]= "<table cellspacing=0 cellpadding=0 style=\"width:100%;\"><tr style=\"padding:2px 0px;\">";
		divHTML[j++]= "<td style=\"padding-left:10px;\"><a id=\"playlist" + i + "\" target=\"_top\" href=\"" + dmrItem.href + 
						 "\" onclick=\"parent.PlayOne();\" contentType=\"" + dmrItem.contentType + "\">" +
						"<span class=\"ellipsis\" style=\"width:50px;\">" + dmrItem.name + "</span></a></td>";
		divHTML[j++]= "<td style=\"width:50px; text-align:right;\">" + dmrItem.ext + "</td>";
		divHTML[j++]= "<td style=\"width:25px; text-align:right;\"></td>";
		divHTML[j++]= "</tr></table>";
	}

	div.innerHTML = divHTML.join("");
	container.appendChild(div);

	var nameWidth = container.clientWidth - 78 - 23;
	var spans = div.all.tags("span");
	for (i = 0; i < spans.length; i++) {
		spans[i].style.pixelWidth = nameWidth;
	}
}

function BuildItemList(container, groupHeading, icon)
{
	if(!DMRItemArray || DMRItemArray.length <= 0)
		return;

	var st = new Date().getTime();
		
	var  group = container.document.createElement("DIV");
	group.className = "groupLabel";
	if (icon) {
		group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(" + icon + ");\"></div>" + groupHeading;
	}
	else {
		group.innerHTML = "<div style=\"width:1px; height:31px; display:inline;\"></div>" + groupHeading;
	}
	container.appendChild(group);

	var div = container.document.createElement("DIV");
	div.className="itemLabel";
	div.id = "itemListDiv";
	
	var divHTML = new Array();
	var j=0;

	TVShell.Message("BuildItemList " + DMRItemArray.length);
	for (i = 0; i < DMRItemArray.length; i++) {
		var dmrItem = DMRItemArray[i];
		var keydownHandler = "";
		if (i == 0 && !scrollFrame.document.all.directoryListDiv && !scrollFrame.document.all.playlistListDIv) {
			keydownHandler = " onkeydown=\"parent.OnTopCheckboxKeydown();\"";
		}

		divHTML[j++]= "<table cellspacing=0 cellpadding=0><tr style=\"padding:2px 0px;\">";
		divHTML[j++]= "<td style=\"padding-left:10px;\"><a id=\"anchor\" target=\"_top\" href=\"" + dmrItem.href + 
						 "\" onclick=\"parent.PlayOne();\" contentType=\"" + dmrItem.contentType + "\">" +
						"<span class=ellipsis style=\"width:50px;\">" + dmrItem.name + "</span></a></td>";
		divHTML[j++]= "<td style=\"width:50px; text-align:right;\">" + dmrItem.ext + "</td>" +
					  "<td style=\"width:25px; text-align:right;\"><input id=check " + 
						( dmrItem.checked ? " checked=true " : "" ) + " type=checkbox onpropertychange=\"parent.OnCheckboxPropertyChange(" + i + ");\"" + keydownHandler + "></td>"
		divHTML[j++]= "</tr></table>";
	}

	div.innerHTML = divHTML.join("");
	container.appendChild(div);

	var nameWidth = container.clientWidth - 78 - 23;
	var spans = div.all.tags("span");
	
	
	for (i = 0; i < spans.length; i++) {
		spans[i].style.pixelWidth = nameWidth;
	}

	var et = new Date().getTime();
	TVShell.Message( "BuildItemList(). time=" + (et-st) );
}

function InitializeScrollFrame(scrollFrame)
{
	var scrollDocument = scrollFrame.document;

	scrollDocument.open();
	scrollDocument.write("<html><body></body></html>");
	scrollDocument.close();

	var scrollBody = scrollDocument.body;

	for (var i = 0; i < document.styleSheets.length; i++) {
		//Import style sheets.
		var href = document.styleSheets[i].href;
		scrollDocument.createStyleSheet(href);
	}

	scrollBody.style.backgroundColor = "transparent";
	scrollBody.style.marginRight = "23px";
	document.body.delegate = scrollBody;

	scrollBody.innerHTML =	"<table id=\"warningTable\" cellspacing=0 cellpadding=0 style=\"width:100%; display:none\">" + 
								"<tr width=100%>" +
									"<td valign=center>" + 
										"<div style=\"position:relative;left:5px;margin:0 0 0 0;behavior:url(#default#alphaImageLoader);src:url(msntv:/Panels/Images/AlertsIconWarning.png);width:40px;height:40px;\"></div>" +
									"</td>" +
									"<td id=\"warningCell\" style=\"font-size:16px;padding-top:5px\">" + 
									"</td>" +
								"</tr>" +
							"</table>";
}

function CreateASXFile(fileName)
{
	var tables = scrollFrame.document.all.itemListDiv.all.tags("table");
	var document = new ActiveXObject("Msxml2.DOMDocument");
	var	root = document.createElement("ASX");

	root.setAttribute("version", "3.0");

	var title = document.createElement("Title");
	title.text = "My Selections";
	root.appendChild(title);

	for (var i = 0; i < tables.length; i++) {
		if (tables[i].all.check.checked) {
			var entry = document.createElement("Entry");
			var ref = document.createElement("Ref");
			var name = document.createElement("DisplayName");
			var href = tables[i].all.anchor.href;

			// HACK! Perform a url escape on '&' characters because the ASX parser doesn't handled &amp;.
			var ehref = "";
			for (var j = 0; j < href.length; j++) {
				if (href.charCodeAt(j) == 0x26) {
					ehref += "%26";
				}
				else {
					ehref += href.substr(j, 1);
				}
			}

			ref.setAttribute("href", ehref);
			name.text = tables[i].all.anchor.innerText;
			entry.appendChild(ref);
			entry.appendChild(name);
			root.appendChild(entry);
		}
	}
	
	document.appendChild(root);
	document.save(fileName);
}

function WPLToASX(wplUrl, asxUrl)
{
	var wplDocument = new ActiveXObject("Msxml2.DOMDocument");

	if (wplDocument.load(wplUrl)) {
		var asxDocument = new ActiveXObject("Msxml2.DOMDocument");
		var	root = asxDocument.createElement("ASX");
		var nodes;
		var node;

		root.setAttribute("version", "3.0");

		node = wplDocument.selectSingleNode("//title");
		if (node) {
			var title = asxDocument.createElement("Title");
			title.text = node.text;
			root.appendChild(title);
		}

		nodes = wplDocument.selectNodes("//media");
		if (nodes && nodes.length > 0) {
			for (i = 0; i < nodes.length; i++) {
				var entry = asxDocument.createElement("Entry");
				var ref = asxDocument.createElement("Ref");

				ref.setAttribute("href", Utilities.CombineUrl(wplUrl, nodes[i].getAttribute("src"), 0));
				entry.appendChild(ref);
				root.appendChild(entry);
			}
		}
		
		asxDocument.appendChild(root);
		asxDocument.save(asxUrl);
	}
}

function NextPlaylistURL()
{
	var playlistUrl = tempPlaylistUrl1;
	var mediaPanel = PanelManager.Item("mediapanel");

	if (mediaPanel) {
		var videoie = mediaPanel.Document.all.videoie;

		if (videoie) {
			if (IsSameURL(videoie.URL, playlistUrl)) {
				playlistUrl = tempPlaylistUrl2;
			}
		}
	}

	return playlistUrl;
}


function SetPlayerURL(URL)
{
	playerDiv.innerHTML = "<object id=\"player\" classid=\"CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"></object>";
	player.URL = URL;
}

function PlayOne()
{
	var	event = scrollFrame.event;

	if (event.srcElement.contentType == "application/vnd.ms-wpl") {
		var playlistUrl = NextPlaylistURL();

		// Translate Windows Media Playlists.
		WPLToASX(event.srcElement.href, playlistUrl);
		SetPlayerURL(playlistUrl);
	}
	else {
		SetPlayerURL(event.srcElement.href);
	}
	event.returnValue = false;
}

function PlaySelected(itemName)
{
	if (CheckSelection("Play", itemName)) {
		var playlistUrl = NextPlaylistURL();

		CreateASXFile(playlistUrl);
		SetPlayerURL(playlistUrl);
	}
}

function CheckSelection(action, itemName)
{
	if (scrollFrame.document.all.itemListDiv) {
		var tables = scrollFrame.document.all.itemListDiv.all.tags("table");

		for (i = 0; i < tables.length; i++) {
			if (tables[i].all.check.checked) {
				return true;
			}
		}
	}

	var str = "Please select ";
	str += (DMRItemArray.length==1)? ("the " + itemName) : ("one or more " + itemName + "s");
	str += " on the left before choosing <EM>" + action + "</EM>.";
	PanelManager.CustomMessageBox(str, "", "Ok", 0, "", false, 0x30, 1);

	return false;
}

var		inOnCheckboxPropertyChange = 0;
var		inOnSelectAllPropertyChange = 0;

function OnCheckboxPropertyChange(indx)
{
	var event = scrollFrame.event;

	inOnCheckboxPropertyChange++;

	if ( indx < DMRItemArray.length ) {
		DMRItemArray[indx].checked = event.srcElement.checked;
	}
	
	if (event.propertyName == "checked") {
		for (var element = event.srcElement; element != null; element = element.parentElement) {
			if (element.tagName == "TABLE") {
				if (event.srcElement.checked) 
					element.className = "selected";
				else 
					element.className = "";
				break;
			}
		}
	}

	if (!inOnSelectAllPropertyChange && scrollFrame.document.all.itemListDiv) {
		if ( selectAll.checked ) {
			selectAll.checked = false;
		} else {
			if ( event.srcElement.checked ) {
				var tables = scrollFrame.document.all.itemListDiv.all.tags("table");
				for (i = 0; i < DMRItemArray.length; i++) {
					if (!DMRItemArray[i].checked) 
						break;
				}
				selectAll.checked = (i == tables.length);
			}
		}

	}
		
	inOnCheckboxPropertyChange--;
}

function OnSelectAllPropertyChange()
{
	var event = window.event;
	var i;
	
	inOnSelectAllPropertyChange++;

	if (event.propertyName == "checked" && !inOnCheckboxPropertyChange) {
		var checked = event.srcElement.checked;
		
		for ( i=0; i < DMRItemArray.length; i++ ) {
			DMRItemArray[i].checked = checked;
		}
		var checkboxes = scrollFrame.document.all.itemListDiv.all.tags("input");
	
		for ( i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = checked;
		}
	}

	inOnSelectAllPropertyChange--;
}

function OnTopCheckboxKeydown()
{
	var event = scrollFrame.event;

	if (event.keyCode == VK_UP) {
		selectAll.focus();
		event.returnValue = false;
	}
}

function OnSelectAllKeydown()
{
	var event = window.event;
	var tabbables = null;

	if (event.keyCode == VK_DOWN) {
		if (scrollFrame.document.all.directoryListDiv) {
			var tabbables = scrollFrame.document.all.directoryListDiv.all.tags("a");
		}
		else if (scrollFrame.document.all.playlistListDiv) {
			var tabbables = scrollFrame.document.all.playlistListDiv.all.tags("a");
		}
		else if (scrollFrame.document.all.itemListDiv) {
			var tabbables = scrollFrame.document.all.itemListDiv.all.tags("input");
		}
					
		if (tabbables.length > 0) {
			tabbables[0].focus();
			event.returnValue = false;
		}
	}
}


function OnDeviceRemove(storageDevice)
{
	// Only react to the current storage device.
	if (storageDevice.VolumeName == StorageDeviceVN) {
		alert("The content you are viewing is no longer available. Your current activity cannot be completed. Choose OK to continue.");
		history.go(homeURL);
	}
}
