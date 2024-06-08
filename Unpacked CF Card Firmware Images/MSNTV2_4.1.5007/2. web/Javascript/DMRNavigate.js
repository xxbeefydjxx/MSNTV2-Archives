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
function DMRItem(name, href, contentType)
{
	this.name = name;
	this.href = href;
	this.contentType = contentType;
}

function BuildArrays(itemTypes)
{
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
							PlaylistArray.push(new DMRItem(name, href, contentType));
						}
						else {
							DMRItemArray.push(new DMRItem(name, href, contentType));
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

function BuildDirectoryList(scrollListDiv)
{
	if(!DirectoryArray || DirectoryArray.length <= 0)
		return;
		
	var st = new Date().getTime();

	var  group = document.createElement("SPAN");
	group.className = "groupLabel";
	group.style.borderBottom = "none";
	group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(../Images/MediaFolder.png);\"></div>Folders";
	scrollListDiv.appendChild(group);

	var div = document.createElement("DIV");
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
		divHTML[j++] = "<li><span class=\"li\"><a id=\"folder" + i + "\" style=\"display:inline-block;\" onfocus=\"ShowArt('" + EscapeScriptString(artURL) + "');\" onclick=\"GotoURL('" + EscapeScriptString(destURL) + "');\">" + Utilities.EscapeHTML(DirectoryArray[i].name) + "</a></span></li>";
	}
	
	divHTML.length++;
	divHTML[j++]= "</UL>";
	div.innerHTML = divHTML.join("");
	scrollListDiv.appendChild(div);		

	var et = new Date().getTime();

	TVShell.Message( "BuildDirectoryList(). time="
					+ (et - st));
}


function BuildPlaylistList(scrollListDiv, icon)
{
	if(!PlaylistArray || PlaylistArray.length <= 0)
		return;
		
	var  group = document.createElement("DIV");
	group.className = "groupLabel"
	if (icon) {
		group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(" + icon + ");\"></div>Playlists";
	}
	else {
		group.innerHTML = "<div style=\"width:1px; height:31px; display:inline;\"></div>Playlists";
	}
	scrollListDiv.appendChild(group);

	var div = document.createElement("DIV");
	div.className="playlistLabel";
	div.id = "playlistListDiv";
	div.style.paddingBottom = 25;
	
	var divHTML = new Array();
	var j=0;

	for (i = 0; i < PlaylistArray.length; i++) {
		var href = PlaylistArray[i].href;
		var file = href.slice(href.lastIndexOf("\\") + 1);
		var extension = file.slice(file.lastIndexOf(".") + 1);

		divHTML.length++;
		divHTML[j++] = "<table cellspacing=0 cellpadding=0 style=\"width:100%;\">" +
						"<tr style=\"padding:2px 0px;\">";
		divHTML.length++;
		divHTML[j++]= "<td style=\"padding-left:10px;\"><a id=\"playlist" + i + "\" href=\"" + FormatURL(href) + 
						 "\" onclick=\"PlayOne();\" contentType=\"" + PlaylistArray[i].contentType + "\">" +
						"<span class=\"ellipsis\" style=\"width:50px;\">" + Utilities.EscapeHTML(PlaylistArray[i].name) + "</span></a></td>";
		divHTML.length++;
		divHTML[j++]= "<td style=\"width:50px; text-align:right;\">" + extension.toLowerCase() + "</td>"
		divHTML.length++;
		divHTML[j++]= "<td style=\"width:25px; text-align:right;\"></td>"
		divHTML.length++;
		divHTML[j++]= "</tr></table>";
	}

	div.innerHTML = divHTML.join("");
	scrollListDiv.appendChild(div);

	var nameWidth = scrollListDiv.clientWidth - 78 - 23;
	var spans = div.all.tags("span");
	for (i = 0; i < spans.length; i++) {
		spans[i].style.pixelWidth = nameWidth;
	}
}

function BuildItemList(scrollListDiv, groupHeading, icon)
{
	if(!DMRItemArray || DMRItemArray.length <= 0)
		return;

	var st = new Date().getTime();
		
	var  group = document.createElement("DIV");
	group.className = "groupLabel";
	if (icon) {
		group.innerHTML = "<div style=\"width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(" + icon + ");\"></div>" + groupHeading;
	}
	else {
		group.innerHTML = "<div style=\"width:1px; height:31px; display:inline;\"></div>" + groupHeading;
	}
	scrollListDiv.appendChild(group);

	var div = document.createElement("DIV");
	div.className="itemLabel";
	div.id = "itemListDiv";
	
	var divHTML = new Array();
	var j=0;

	for (i = 0; i < DMRItemArray.length; i++) {
		var href = DMRItemArray[i].href;
		var file = href.slice(href.lastIndexOf("\\") + 1);
		var extension = file.slice(file.lastIndexOf(".") + 1);
		var keydownHandler = "";

		if (i == 0 && !document.all.directoryListDiv && !document.all.playlistListDIv) {
			keydownHandler = " onkeydown=\"OnTopCheckboxKeydown();\"";
		}

		divHTML.length++;
		divHTML[j++]= "<table cellspacing=0 cellpadding=0>" +
						"<tr style=\"padding:2px 0px;\">";
		divHTML.length++;
		divHTML[j++]= "<td style=\"padding-left:10px;\"><a id=\"anchor\" href=\"" + FormatURL(href) + 
						 "\" onclick=\"PlayOne();\" contentType=\"" + DMRItemArray[i].contentType + "\">" +
						"<span class=\"ellipsis\" style=\"width:50px;\">" + Utilities.EscapeHTML(DMRItemArray[i].name) + "</span></a></td>";
		divHTML.length++;
		divHTML[j++]= "<td style=\"width:50px; text-align:right;\">" + extension.toLowerCase() + "</td>"
		divHTML.length++;
		divHTML[j++]= "<td style=\"width:25px; text-align:right;\"><input id=\"check\" type=\"checkbox\" onpropertychange=\"OnCheckboxPropertyChange();\"" + keydownHandler + "></td>"
		divHTML.length++;
		divHTML[j++]= "</tr></table>";
	}

	div.innerHTML = divHTML.join("");
	scrollListDiv.appendChild(div);

	var nameWidth = scrollListDiv.clientWidth - 78 - 23;
	var spans = div.all.tags("span");
	for (i = 0; i < spans.length; i++) {
		spans[i].style.pixelWidth = nameWidth;
	}

	var et = new Date().getTime();
	TVShell.Message( "BuildItemList(). time=" + (et-st) );
}

function CreateASXFile(fileName)
{
	var tables = itemListDiv.all.tags("table");
	var document = new ActiveXObject("Msxml2.DOMDocument");
	var	root = document.createElement("ASX");

	root.setAttribute("version", "3.0");

	var title = document.createElement("Title");
	title.text = "My Selections";
	root.appendChild(title);

	for (i = 0; i < tables.length; i++) {
		if (tables[i].all.check.checked) {
			var entry = document.createElement("Entry");
			var ref = document.createElement("Ref");
			var name = document.createElement("DisplayName");

			ref.setAttribute("href", tables[i].all.anchor.href);
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

function SetPlayerURL(URL)
{
	playerDiv.innerHTML = "<object id=\"player\" classid=\"CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"></object>";
	player.URL = URL;
}

function PlayOne()
{
	if (window.event.srcElement.contentType == "application/vnd.ms-wpl") {
		// Translate Windows Media Playlists.
		SetPlayerURL("");
		WPLToASX(window.event.srcElement.href, tempPlaylistUrl);
		SetPlayerURL(tempPlaylistUrl);
	}
	else {
		SetPlayerURL(window.event.srcElement.href);
	}
	window.event.returnValue = false;
}

function PlaySelected(itemName, fileUrl)
{
	if (CheckSelection("Play", itemName)) {
		SetPlayerURL("");
		CreateASXFile(fileUrl);
		SetPlayerURL(fileUrl);
	}
}

function CheckSelection(action, itemName)
{
	if (document.all.itemListDiv) {
		var tables = itemListDiv.all.tags("table");

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

function OnCheckboxPropertyChange()
{
	var event = window.event;

	inOnCheckboxPropertyChange++;

	if (event.propertyName == "checked") {
		for (var element = event.srcElement; element != null; element = element.parentElement) {
			if (element.tagName == "TABLE") {
				if (event.srcElement.checked) {
					element.className = "selected";
				}
				else {
					element.className = "";
				}
				break;
			}
		}
	}

	if (!inOnSelectAllPropertyChange && document.all.itemListDiv) {
		var tables = itemListDiv.all.tags("table");

		for (i = 0; i < tables.length; i++) {
			if (!tables[i].all.check.checked) {
				break;
			}
		}

		selectAll.checked = (i == tables.length);
	}
		
	inOnCheckboxPropertyChange--;
}

function OnSelectAllPropertyChange()
{
	var event = window.event;

	inOnSelectAllPropertyChange++;

	if (event.propertyName == "checked" && !inOnCheckboxPropertyChange) {
		var checked = event.srcElement.checked;
		var checkboxes = itemListDiv.all.tags("input");
	
		for (var i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = checked;
		}
	}

	inOnSelectAllPropertyChange--;
}

function OnTopCheckboxKeydown()
{
	var event = window.event;

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
		if (document.all.directoryListDiv) {
			var tabbables = directoryListDiv.all.tags("a");
		}
		else if (document.all.playlistListDiv) {
			var tabbables = playlistListDiv.all.tags("a");
		}
		else if (document.all.itemListDiv) {
			var tabbables = itemListDiv.all.tags("input");
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
