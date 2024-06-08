var count=0;
var nPhotos = 0;
var fileOpen;
var nThumbnailReady = 0;
var selectedPhotoIndex=0;
var XMLFileURL;
var scrollingDiv = null;

var dimension = 3; 
var cellSpanWidth=92;
var cellSpanHeight=69; 

var nImageOnPage = dimension*dimension + dimension;		
var scrollIndex = 0;
var highestScrollTopSofar = 0;	

var CheckedItemCount = 0;
var selectedRadioIndex = -1;
var MAX_NUM_TO_ATTACH_ON_BROADBAND=36;
var MAX_NUM_TO_ATTACH_ON_NARROWBAND=36;

var StorageDeviceVN=parameters.StorageDeviceVN;
var path = parameters.path;
TVShell.Message("path = " + path);
// LOCATION = 0 := ON_THE_BOX (i.e. the unit's internal flash drive)
// LOCATION = 1 := REMOVABLE_LOCAL_STORAGE (i.e. memory card)
// LOCATION = 2 := OTHER (i.e. network, mail, or ... )
var location = parameters.location;
var fromMail = parameters.fromMail;	
var ATTACHMENT_LIST_FILENAME = "\\temp\\photo\\TempSelectedPhotoList.txt";		
var IDOK=1;
var IDCANCEL=2;
				
var fFlattenDirectories		= false;
var g_fTruncated =false;

var dayList = new Array("Sun", "Mon", "Tue", "Wed","Thu", "Fri", "Sat");
var monthList = new Array("Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov" , "Dec");
var DifferentDatesList = new Array();
var DifferentDatesCount=0;
var currentGroup="";
var currentGroupID=0;
var MaxGroupNum = 15;
var currentGranularity = "date";

Sink.AttachEvent(PhotoManager, "OnThumbnailReady"   , OnThumbnailReady);
Sink.AttachEvent(PhotoManager, "OnResizedImageReady"   , OnResizedImageReady);
var QUERY_TAG = "tag";
var QUERY_NAMED_ITEM = "namedItem";

var AttachmentImageFileNames = new Object();
var AttachmentItemCount = 0;
var AttachmentFileList = null;

if (fromMail)
{
	AttachmentFileList = Utilities.ReadTextFile(ATTACHMENT_LIST_FILENAME);  
	if(AttachmentFileList)
	{
		AttachmentFileList = AttachmentFileList.toLowerCase();
		var fileList = AttachmentFileList.split('\n');				
		AttachmentItemCount = Math.floor(fileList.length / 2);
		var fileName;
		var reWebready = /^\\temp\\photo\\webready/g; 
		var reRotated = /^\\temp\\photo\\rotated/g; 
		for(i=0; i< AttachmentItemCount; i++)
		{
			fileName = fileList[2*i].replace(reWebready,'');
			fileName = fileName.replace(reRotated,'');

			AttachmentImageFileNames[fileName]=true;
		}
	}
} 

var foundRules = new Object();
function GetIFrameStyleRule( tag )
{
	var rule = foundRules[tag];
	if ( rule )
		return rule != "-" ? rule : null;

	var subFrame = window.frames['scrollListIFrame'];
	var subDoc = subFrame.document;

	var style;
	for (var i = 0; i < subDoc.styleSheets.length; i++)
	{
		style = subDoc.styleSheets[i];
		for ( var j in style.rules )
		{
			if ( style.rules[j].selectorText == tag ) {
				foundRules[tag] = style.rules[j];
				return foundRules[tag];
			}
		}
	}
	foundRules[tag] = "-";
	return null;
}

function GetItems( queryType, tag )
{
	var res = null;
	if ( queryType == QUERY_TAG ) {
		res = scrollListDiv.all.tags( tag );
	} else {
		var i = scrollListDiv.all.namedItem( tag );
		if ( i == null )
		{
			res = new Array();
		}
		else if ( i.length == null )
		{
			res = new Array();
			res[0] = i;
		}
		else
		{
			res = i;
		}
	}
	if ( res == null )
		res = new Array();

	return res;
}

var cachedCells = null;
var cachedThumbnails = null;
function GetCells() 
{
	return cachedCells;
}

function GetCellSpans() 
{
	return GetItems( QUERY_NAMED_ITEM, "CellSpan");
}

function GetThumbnailImages() 
{
	return cachedThumbnails;
}

function GetCheckboxes() 
{
	return GetItems( QUERY_NAMED_ITEM, "chk");
}

var thumbnailNodesImgMap = null;
function LookupThumbnailURL(fileName)
{
	if (thumbnailNodesImgMap==null && PhotosItemArray != null)
	{
		thumbnailNodesImgMap = new Object();
		var thumbnailNodes = mainPanel.Document.GetThumbnailNodes();
		for( var i = 0; i < nPhotos; i++ )
		{
			var node = thumbnailNodes.item(i);	
			if (node && PhotosItemArray[i] && PhotosItemArray[i].href)
			{
				thumbnailNodesImgMap[PhotosItemArray[i].href]= node.text;
			}
		}
	}
	var imgThumbURL = null;
	if ( thumbnailNodesImgMap )
		imgThumbURL = thumbnailNodesImgMap[fileName];
	if(imgThumbURL == null)
		imgThumbURL = PhotoManager.RequestThumbnail(fileName);

	return imgThumbURL;
}

var indexMap = null;
function LookupIndex(imgSrcURL)
{
	if (indexMap==null && PhotosItemArray != null)
	{
		indexMap = new Object();
		for( var i = 0; i < nPhotos; i++ )
		{
			if (PhotosItemArray[i] && PhotosItemArray[i].href)
			{
				indexMap[PhotosItemArray[i].href] = i;
			}
		}
	}
	var ref;
	if ( indexMap )
		ref = indexMap[imgSrcURL];
	return ref != null ? ref : nPhotos;
}

function CallBuildTable()
{
	//dummy
}

function OnResizedImageReady(imgSrcURL)
{
	TVShell.Message("OnResizedImageReady " + imgSrcURL);
	if ( sendPhotosWaitOnImgSrcURL == imgSrcURL )
	{
		SendPhotosOnResizedImageReady(imgSrcURL);
	}
}


function OnThumbnailReady(imgSrcURL)
{
	//TVShell.Message("OnThumbnailReady " + imgSrcURL);
	index = LookupIndex(imgSrcURL);
	if ( index < nPhotos )
	{
		//TVShell.Message("i=" + index + " n= " + nPhotos + " F= " + PhotosItemArray[index].href);
		//TVShell.Message("imgSrcURL = " + imgSrcURL);
		var thumbURL  = FormatURL(PhotoManager.GetThumbnailImageURL(imgSrcURL));
		//TVShell.Message("thumbURL = " + thumbURL);
		
		var thumbnails = GetThumbnailImages();
		var imgThumbnailElement = thumbnails[index];
		if(imgThumbnailElement)
		{
			nThumbnailReady++;
			imgThumbnailElement.src = thumbURL;
				
			//TVShell.Message("here3 nThumbnailReady = " + nThumbnailReady + " " + thumbURL);
				
			if(nThumbnailReady==count)
			{
				//TVShell.Message("calling1 " +  nThumbnailReady);
				setTimeout(CallBuildTable,1000); 
			}
		}
	}	
}

function RequestThumbnail(fileName)
{
	var imgThumbURL=PhotoManager.DefaultPhotoThumbURL;
	
	if(IsInRotatedImageList(fileName))
	{
		var dstURL = PhotoManager.GetRotatedImageURL(fileName);
		imgThumbURL = PhotoManager.RequestThumbnail(dstURL, true, true);
	}
	else if(XMLFileURL)
	{
		var found = false;
		imgThumbURL = LookupThumbnailURL(fileName);

		//TVShell.Message("found= " + found + " " + imgThumbURL);
	}
	else
	{	
		imgThumbURL = PhotoManager.RequestThumbnail(fileName);
		//TVShell.Message("Requested " + fileName);
		//TVShell.Message("Got " + imgThumbURL);
	}
	
	return imgThumbURL;
}


var DirectoryArray = new Array();
var PhotosItemArray = new Array();

// Directory constructor
function Directory(name, href, nameLowerCase)
{
	this.name = name;
	this.href= href;
	this.nameLowerCase = nameLowerCase;
}

// PhotosItem constructor
function PhotosItem(name, href, contentType, date, time)
{
	this.name = name;
	this.href = href;
	this.mimeType = contentType;
	this.date = date;
	this.checked = false;
	this.time = time;
}

function GetCheckedPhotoIndices( list )
{
	var checkedIndices = new Array();
	if ( CheckedItemCount > 0 )
	{
		var j=0;
		for (var i = 0 ; i < PhotosItemArray.length; i++)
		{
			if ( PhotosItemArray[i].checked )
				checkedIndices[j++] = i;
		}
	}

	return checkedIndices;
}

function ToNewlineSeparatedList( list, checkedOnly )
{
	var fileList = new Array();
	var j=0;
	if (checkedOnly)
	{
		for ( var i = 0; i < list.length; i++)
		{
			if ( list[i].checked )
			{
				fileList[j++] = list[i].href;
			}
		}
	}
	else
	{
		for ( var i = 0; i < list.length; i++)
		{
			fileList[j++] = list[i].href;
		}
	}
	fileList[j++]="";

	return fileList.join("\n");
}

function DescendingASCIISort(item1, item2)
{
	if(item1.nameLowerCase>item2.nameLowerCase)
	   return 1;
	else if(item1.nameLowerCase==item2.nameLowerCase)
		return 0;
	else
	   return -1;
}

function SortItemsByTime(item1, item2)
{
	if(item1.time>item2.time)
	   return 1;
	else if(item1.time==item2.time)
		return 0;
	else
	   return -1;
}

function BuildArrays(mimeType)
{
	var fStartTime = new Date().getTime();
	TVShell.Message( "BuildArrays. ENTER" );
	g_fTruncated=false;
	if (StorageManager && StorageDeviceVN) {	
		StorageDevice = StorageManager.Item(StorageDeviceVN);	
		if (StorageDevice && StorageDevice.Mounted) {

			var xmlStr = StorageDevice.EnumerateItems(path, mimeType, 1);
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
						TVShell.Message("BuildArrays: TotalMatches="
										+ TotalMatches
										+ " NumberReturned="+NumberReturned);
					}
				}

			}
			// Build directory array
			if (xmlDoc) { 
				nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 1]");
			}

			if (nodes && nodes.length > 0) {
				var length = nodes.length;

				var maybeMemoryCard =
				  StorageDevice.Removable && !StorageDevice.IsNetwork && 
				  StorageDevice.Mounted;
				fFlattenDirectories = false;
				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var href = node.selectSingleNode(".//a:href").text;

					if (href) {
						var name = node.selectSingleNode(".//a:displayname").text;
						var nameLowerCase = name.toLowerCase();
						if (maybeMemoryCard && nameLowerCase == "dcim")
							fFlattenDirectories = true;

						DirectoryArray[i] = new Directory(name, href,
														  nameLowerCase);
					}
				}
 			}

			// sort the DirectoryArray in ascending, ASCII character order
			if(DirectoryArray && DirectoryArray.length>1)
				DirectoryArray.sort(DescendingASCIISort);
			// Build photoItem array
			
			if(fFlattenDirectories)
			{
				xmlStr = StorageDevice.EnumerateItems(path, mimeType);
				xmlDoc = xmlStr ? new ActiveXObject("Msxml2.DOMDocument") : null;
				nodes = null;

				if (xmlDoc) {
					xmlDoc.async = false;
					if (!xmlDoc.loadXML(xmlStr)) {
						xmlDoc = null;
					}
				}
			}
			
			if (xmlDoc) {
				nodes = xmlDoc.selectNodes("//a:response[a:propstat/a:prop/a:iscollection = 0]");
			}

			if (nodes && nodes.length > 0) 
			{
				var length = nodes.length;
				CheckedItemCount = 0;

				var j=0;
				var fileName;
				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var href = node.selectSingleNode(".//a:href").text;
					if (href) {
						var name = node.selectSingleNode(".//a:displayname").text;
						var contentType = node.selectSingleNode(".//a:getcontenttype").text;
						var dateNode = node.selectSingleNode(".//a:getlastmodified");
						if(!dateNode)
							dateNode = node.selectSingleNode(".//a:creationDate");
						var date = "";
						if(dateNode)
							date = dateNode.text;

						var timeV =new Date(ChangeHyphenToSlash(date));

						PhotosItemArray[j] = new PhotosItem(name, href, contentType, date, timeV.getTime());

						if ( AttachmentFileList
							&& AttachmentImageFileNames[href.toLowerCase()] )
						{
							//Don't count these attachment images as part
							//of the checked item count. These aren't selected
							//CheckedItemCount++;
							PhotosItemArray[j].attachment = true;
						}
						j++;
					}
				}
				nPhotos = PhotosItemArray.length;

				if(PhotosItemArray && PhotosItemArray.length>0)
				{
					PhotosItemArray.sort(SortItemsByTime);
				}
			}	
		}
	}

	var fEndTime = new Date().getTime();
	TVShell.Message( "BuildArrays(" + mimeType + ") LEAVE. time="
					 + (fEndTime-fStartTime) );
}

function ChangeHyphenToSlash(element)
{
	if(element)
	{
		var re = /[-]/g; 
		return element.replace(re, '/');
	}
}
	
function formatDate(date)
{
	if(date=="")
		return "Undated";
		
	date = ChangeHyphenToSlash(date);
	var currentDate = new Date (date);
	var result = "";
	
	if(currentGranularity=="year")
		result = currentDate.getYear();
	else if(currentGranularity=="month")
		result = monthList[currentDate.getMonth()] + ", " + currentDate.getYear();
	else
		result = currentDate.getDate() + " " + monthList[currentDate.getMonth()] + ", " + currentDate.getYear();
	
	return result;
}


function GenerateGroups()
{
	//TVShell.Message("GenerateGroups " + currentGranularity);
	
	if(!PhotosItemArray || PhotosItemArray.length<=0)
		return;
	
	var continueGenerateGroups = true;	
	while( continueGenerateGroups )
	{
		DifferentDatesCount = 0;
		DifferentDatesList = new Array();
				
		var formattedDate = formatDate(PhotosItemArray[0].date);
		//TVShell.Message("formattedDate = " + formattedDate);
		DifferentDatesList[DifferentDatesCount] =formattedDate;
		
		var i;
		for(i=1; i<PhotosItemArray.length; i++)
		{
			formattedDate = formatDate(PhotosItemArray[i].date);
			if(DifferentDatesList[DifferentDatesCount]!=formattedDate)
			{
				DifferentDatesCount++;
				DifferentDatesList[DifferentDatesCount] = formattedDate;
			}
		}
		
		if(DifferentDatesCount > MaxGroupNum)
		{
			if(currentGranularity=="date")
			{
				currentGranularity = "month";
				GenerateGroups();
			}
			else if (currentGranularity=="month")
			{
				currentGranularity = "year";
				GenerateGroups();
			}
			else
				continueGenerateGroups = false;	
		}
		else
			continueGenerateGroups = false;
	}
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
				{
					DeviceName= "Album: " + path.slice(slashPos+1);
				}
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
		if(document.all.Heading && DeviceName!="")
			Heading.label = DeviceName;
	}
}


function GetParentLocationString( devVN, parentDir )
{
	var res = "";
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

function BuildDirectoryList(scrollListDiv, source)
{
	if(!DirectoryArray || DirectoryArray.length <= 0)
		return;

	var st = new Date().getTime();

	var div = scrollListDiv.document.createElement("DIV");		
	
	//currentGroupID++;					
	var j = 0;
	var divHTML = new Array();

	divHTML[j++] = "<span class=groupLabel style='font-size:18px; border-top:none;'><div style='width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(../Images/MediaFolder.png);'></div>Folders" + GetParentLocationString(StorageDeviceVN,path) + "</span>";

	divHTML[j++]="<UL style='padding:10px 0 0 9px;'>"

	var basicDestURL =source=="Picker" ? "Picker.html" : "Viewer.html";

	basicDestURL+="?location=" + location;

	if(StorageDeviceVN)
	{
		basicDestURL+="&StorageDeviceVN=" + escapeplus(escape(StorageDeviceVN));
	}
			
	if(source=="Picker")
	{
		if(fileOpen)
			basicDestURL+="&fileOpen=true";
		else
			basicDestURL+="&fromMail=true";
	}
		
	var destURL;
	var pathText;
	for(i=0; i < DirectoryArray.length; i++) {
		destURL = basicDestURL;
		if(StorageDeviceVN)
		{
			pathText = GetPath(StorageDeviceVN, DirectoryArray[i].href);
			if(pathText)
				destURL+="&path=" + escapeplus(escape(pathText));
		}
			
		//TVShell.Message("dest = " + pathText);
		//TVShell.Message("destURL = " + destURL);
		divHTML[j++]="<li><span class=\"li\"><a id=\"folder" + i + "\" style=\"display:inline-block;\" onclick=\"parent.GotoURL('" + EscapeScriptString(destURL) + "');\">" + DirectoryArray[i].name + "</a></span></li>";
	}

	divHTML[j++]="</UL>";
	div.innerHTML = divHTML.join("");
	scrollListDiv.appendChild(div);		

	var et = new Date().getTime();
	TVShell.Message( "BuildDirectoryList(). time=" + (et-st));
}
								
function BuildCompleteTable()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "BuildCompleteTable: ENTER" );

	var div = scrollListDiv.document.createElement("DIV");		
	div.id = "photoDiv";
	BuildPhotoTable( div );

	scrollListDiv.appendChild(div);		

	cachedCells = GetItems( QUERY_NAMED_ITEM, "Cell");
	cachedThumbnails = GetItems( QUERY_NAMED_ITEM, "imgThumbnail");

	var fsEnd = new Date().getTime();
	TVShell.Message( "BuildCompleteTable: LEAVE. time=" + (fsEnd-fsStart) );
}


function CreateCellTemplate( checked, enabled )
{
	var imgTemplate = new Object();
	var divHTML = new Array();
	imgTemplate.divHTML = divHTML;
	var indexList = new Array();
	imgTemplate.indexList = indexList;
	var j = 0;
	var index = -1;

	divHTML[j++]="<span class=imgThumbnailCell style='border:1px solid #666666;";
	if(checked)
	{
		divHTML[j++]="xbackground-color: #C3D5BA;";
	}

	divHTML[j++] = " padding:2px; margin: 4px;' id=Cell >";
	divHTML[j++]="<span style='xbackground-color:red; height:100%; padding-right:2px;'>";

	if(checked)
	{
		if(fileOpen)
		{
			divHTML[j++]= "<INPUT TYPE=radio onclick='parent.OnClickedRadio(";
			indexList.push( j );//remeber the indices that must be updated.
			divHTML[j++]= index;
			divHTML[j++]= ");'";
			if ( enabled == false )
				divHTML[j++]= " DISABLED=true";
			divHTML[j++]= " CHECKED=true NAME=radio>";
		}
		else			
		{
			divHTML[j++]= "<INPUT TYPE=checkbox onclick='parent.OnClickedCheckBox(";
			indexList.push( j );//remeber the indices that must be updated.
			divHTML[j++] = "" + index;
			divHTML[j++] = ",window.event.srcElement.checked);'";
			if ( enabled == false )
				divHTML[j++]= " DISABLED=true";
			divHTML[j++] = " CHECKED=true NAME=chk >";
		}
	}
	else 
	{
		if(fileOpen)
		{
			divHTML[j++]= "<INPUT TYPE=radio onclick='parent.OnClickedRadio(";
			indexList.push( j );//remeber the indices that must be updated.
			divHTML[j++] = index;
			divHTML[j++] = ");'";
			if ( enabled == false )
				divHTML[j++]= " DISABLED=true";
			divHTML[j++] = " NAME=radio>";
		}
		else
		{
			divHTML[j++]= "<INPUT TYPE=checkbox onclick='parent.OnClickedCheckBox(";
			indexList.push( j );//remember the indices that must be updated.
			divHTML[j++] = index;
			divHTML[j++] = ",window.event.srcElement.checked);' ";
			if ( enabled == false )
				divHTML[j++]= " DISABLED=true";
			divHTML[j++] = " NAME=chk >";
		}
	}
	
	divHTML[j++]="</span>";
	divHTML[j++]= "<span id=CellSpan class=imgThumbnailCellSpan style='overflow-x:hidden;'>";
	divHTML[j++]= "<img class=imgThumbnailCell id=imgThumbnail LOWSRC='";
	divHTML[j++]= PhotoManager.DefaultPhotoThumbURL;
	divHTML[j++]="' onmouseover='parent.UpdateCountStr(";
	indexList.push( j );//remember the indices that must be updated.
	divHTML[j++] = index;
	divHTML[j++] = ");' xonClick=parent.GotoSlideShow(); ></span>";
	
	divHTML[j++]="</span>";

	return imgTemplate;
}

function AppendTemplate( divHTML, imgTemplate, index )
{
	for (var i =0; i < imgTemplate.indexList.length;i++)
	{
		imgTemplate.divHTML[imgTemplate.indexList[i]] = index;
	}
	var j = divHTML.length;
	for ( var i = 0; i < imgTemplate.divHTML.length; i++ )
	{
		divHTML[j++] = imgTemplate.divHTML[i];
	}
	return j;
}

function BuildPhotoTable( div )
{
	var fsStart = new Date().getTime();
	TVShell.Message( "BuildPhotoTable: ENTER" );

	var j = 0;
	var divHTML = new Array();
	
	//Reset the current groups
	currentGroup="";
	currentGroupID=0;

	var unselectedCell = CreateCellTemplate( false, true );
	var selectedCellEnabled = CreateCellTemplate( true, true );
	var selectedCellDisabled = CreateCellTemplate( true, false );

	for( var index = 0; index < nPhotos ; index++ )
	{
		var formattedDate = formatDate(PhotosItemArray[index].date);
		if(!XMLFileURL && currentGroup!=formattedDate)
		{
			currentGroup=formattedDate;
			divHTML[j++]="<a class='groupLabel' id='group"
				+ currentGroupID + "'";
			if ( index == 0 && DirectoryArray.length == 0)
			{
				divHTML[j++]=" style='borderTop: none;' ";
			}
			divHTML[j++]=">" + currentGroup + "</a>";
			currentGroupID++;	
		}

		if(PhotosItemArray[index].attachment)
			j = AppendTemplate( divHTML, selectedCellDisabled, index );
		else if (PhotosItemArray[index].checked)
			j = AppendTemplate( divHTML, selectedCellEnabled, index );
		else
			j = AppendTemplate( divHTML, unselectedCell, index );
	}

	div.innerHTML = divHTML.join("");


	UpdateSelectedCountStr();
		
	count = nPhotos;

	var fsEnd = new Date().getTime();
	TVShell.Message( "BuildPhotoTable: LEAVE. time=" + (fsEnd-fsStart) );
}

function IsHighSpeed()
{
	return (TVShell.ConnectionManager.WANAdapter.RXSpeed >= 100000);
}

var sendPhotoIndex = 0;
var sendPhotosCheckedItems = null;
var sendPhotosFileInfo = "";
var sendPhotosQuality = null;
var sendPhotosAction = null;
var sendPhotosWaitOnImgSrcURL = null;

function SendPhotos(quality, action)
{
	if(!CurrentUser || !CurrentUser.IsAuthorized)
	{
		ConfirmSignOn();
		return;
	}
	if (CheckedItemCount<=0)
	{
		return;
	}
	sendPhotosCheckedItems = GetCheckedPhotoIndices(PhotosItemArray);

	var ucAction = action.substring(0,1).toUpperCase() + action.substring(1,action.length);

	var maxNum = IsHighSpeed() ? MAX_NUM_TO_ATTACH_ON_BROADBAND:MAX_NUM_TO_ATTACH_ON_NARROWBAND;

	if ( (AttachmentItemCount+CheckedItemCount) > maxNum )
	{
		PanelManager.CustomMessageBox(" You are attempting to " + action + " more than the maximum " + maxNum + " photos. Choose fewer photos and then choose " + ucAction + " Photos." ,"Too Many Photos", "OK", 1,"");
		return;
	}


	var progressMsg = "";
	if ( action == "send" )
	{
		progressMsg = "Creating empty email and attaching photos.";
	}
	else if ( action == "attach" )
	{
		progressMsg = "Attaching photos to email.";
	}
	else
	{
		progressMsg = ucAction + "ing photos.";
	}

	SetProgressStopFunction(null);
	SetProgressText(PROGRESS_PLEASE_WAIT + progressMsg );
	SetProgressPercent(0);
	ShowProgressPanel();

	sendPhotoIndex = 0;
	sendPhotosFileInfo = "";
	sendPhotosQuality = quality;
	sendPhotosAction = action;

	setTimeout( SendPhotos1, 10 );
}

function SendPhotos1()
{
	var quality = sendPhotosQuality;
	var action = sendPhotosAction;
	var i = sendPhotosCheckedItems[sendPhotoIndex];
	try
	{
		var srcURL = PhotosItemArray[i].href;

		if (CheckedItemCount == 0)
		{
			SendPhotosContinue();
			return;
		}

		if(IsInRotatedImageList(srcURL))
		{
			srcURL = PhotoManager.GetRotatedImageURL(srcURL);
		}
		else
		{
			sendPhotosWaitOnImgSrcURL = srcURL;
			srcURL= ResizeAndGetURL(srcURL, photoAreaHeight, photoAreaWidth, false);
		}
		if (IsDefaultResizeFile(srcURL) == false )
		{
			Heartbeat();
			SendPhotos2(srcURL);				
		}
		else
		{
			TVShell.Message( "Send Photos waiting for resize to complete. file = "
			                 + PhotosItemArray[i].href );
		}
	}
	catch ( ex )
	{
		TVShell.Message( "SendPhoto1: Got exception " + ex + " i=" + i );
						 
		SendPhotosContinue();
	}
}

function SendPhotosOnResizedImageReady( imgSrcURL )
{
	sendPhotosWaitOnImgSrcURL = null;
	TVShell.Message( "SendPhotosOnResizedImageReady(" + imgSrcURL + ")");
	SendPhotos2( ResizeAndGetURL(imgSrcURL, photoAreaHeight, photoAreaWidth, true) );
}

function SendPhotos2(srcURL)
{
	sendPhotosWaitOnImgSrcURL = null;
	var quality = sendPhotosQuality;
	var action = sendPhotosAction;
	var i = sendPhotosCheckedItems[sendPhotoIndex];
	try
	{
		var fileLocation = "";
		var origURL = PhotosItemArray[i].href;
	
		if(quality)
		{
			fileLocation = PhotoManager.GetResizedImageLocation(quality);
		}

		var dstURL = fileLocation + PhotoManager.GetFileName(origURL);
		if(ThumbnailManager.CopyFileToURL(srcURL, dstURL))
		{
			sendPhotosFileInfo+=dstURL;
			sendPhotosFileInfo+='\n';
			sendPhotosFileInfo+=Utilities.DetermineFileSize(dstURL);
			sendPhotosFileInfo+='\n';	
		}

		var percentComplete = Math.round( ( 100 * sendPhotoIndex )/CheckedItemCount);
		TVShell.Message( "% complete=" + percentComplete );
		SetProgressPercent( percentComplete );
		SendPhotosContinue();
	}
	catch ( ex )
	{
		TVShell.Message( "SendPhoto1: Got exception " + ex + " i=" + i );
						 
		SendPhotosContinue();
	}
}

function SendPhotosContinue()
{
	sendPhotoIndex++;
	if ( sendPhotoIndex < CheckedItemCount )
	{
TVShell.Message( "Goto next item" );
TVShell.Message( "CheckedItemCount=" + CheckedItemCount );
		setTimeout( SendPhotos1, 10 );
	}
	else
	{
		//Warning failing silently if no photos were attached or
		// if an error occurred in send mail. 
TVShell.Message( "Done with photos. files=" + sendPhotosFileInfo );
		try
		{
			if (sendPhotosFileInfo != "" )
				SendMail(sendPhotosFileInfo);
			else
				TVShell.Message( "WARNING: SendPhotos() could not attach any photos" );
		}
		catch (ex)
		{
TVShell.Message( "error sendMail: ex" + ex );
		}
		HideProgressPanel();
	}
}

function UpdateCountStr(index)
{
	selectedPhotoIndex = index;
	var CountStr = document.all.CountStr;
	if(CountStr)
		CountStr.innerText = (index+1) + " of " + nPhotos ;
}

function UpdateSelectedCountStr()
{
	var SelectedCountStr = document.all.SelectedCountStr;
	if(SelectedCountStr)
	{
		SelectedCountStr.innerText = CheckedItemCount + " selected";
	}		
}

function GenerateNewTable(newDimension)
{
	var fsStart = new Date().getTime();
	TVShell.Message( "GenerateNewTable: ENTER" );

	if(newDimension == dimension) {
		TVShell.DeviceControl.PlaySound("Page_Boundary");
		return;
	}
	else if (newDimension > dimension) {
		TVShell.DeviceControl.PlaySound("DecreaseTextSize");
	}
	else {
		TVShell.DeviceControl.PlaySound("IncreaseTextSize");
	}

	dimension = newDimension;
	nImageOnPage = dimension*dimension + dimension;
	
	if(dimension==1)
	{
		cellSpanWidth=320;
		cellSpanHeight=240; 
		
		//cellSpanWidth=356;
		//cellSpanHeight=267; 
		
	}
	else if(dimension==2)
	{
		cellSpanWidth=156;
		cellSpanHeight=117; 
		//scrollListDiv.scrollincrement=135;
	}
	else if (dimension==3)
	{
		cellSpanWidth=92;
		cellSpanHeight=69;
		//scrollListDiv.scrollincrement=87;
	}
	else if (dimension==4)
	{
		cellSpanWidth=60;
		cellSpanHeight=45;
		//scrollListDiv.scrollincrement=63;
	}
	
	var startIndex = GetScrollIndex();
	var endIndex = startIndex + nImageOnPage;
	if ( endIndex >= nPhotos )
		endIndex = nPhotos - 1;
	
	var saveScrollIndex = startIndex;
	var activeElement = document.activeElement;
	var cells = GetCells();
	var cellSpans = GetCellSpans();
	var thumbnails = GetThumbnailImages();

	for (var i = saveScrollIndex; i < endIndex; i++) {
		var cell = cells[i];

		// Current focus always wins.
		if (cell.contains(activeElement)) {
			saveScrollIndex = i;
			break;
		}

		// If at least 3/4 of image visible, us it as top index.
		if ((cell.offsetTop + cell.offsetHeight / 4) >= scrollListDiv.scrollTop && saveScrollIndex == 0) {
			saveScrollIndex = i;
		}
	}

	var rule = GetIFrameStyleRule(".imgThumbnailCellSpan");

	rule.style.height= cellSpanHeight;
	rule.style.width= cellSpanWidth;

	rule = GetIFrameStyleRule(".imgThumbnailCell");
	rule.style.height= cellSpanHeight;

	scrollListDiv.scrollTop = 0;
	cells[saveScrollIndex].scrollIntoView();

	var fsEnd = new Date().getTime();
	TVShell.Message( "GenerateNewTable: LEAVE. time=" + (fsEnd-fsStart) );
}

function ClearAll() 
{
	var cells = GetCells();
	var checkboxes = GetCheckboxes();
	for (var i = 0; i<count; i++) {
		checkboxes[i].checked = false;
		cells[i].style.backgroundColor='transparent';	
	}

	var itemCount = PhotosItemArray.length;
	for (var i = 0; i < itemCount; i++) {
		PhotosItemArray[i].checked = false;
	}
	
	CheckedItemCount = 0;
	UpdateSelectedCountStr();
}

function SelectAll() 
{
	ClearAll();

	var cells = GetCells();
	var checkboxes = GetCheckboxes();
	if (document.all.SelectAllID.checked) {			
		for (var i = 0; i<count; i++) {
			checkboxes[i].checked=true;
			cells[i].style.backgroundColor='#C3D5BA';
		}

		var itemCount = PhotosItemArray.length;
		for (var i = 0; i < itemCount; i++) {
			PhotosItemArray[i].checked = true;
		}

		CheckedItemCount = itemCount;
	}
	
	UpdateSelectedCountStr();
}

function GetScrollIndex()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "GetScrollIndex: ENTER" );

	var low = 0;
	var high = Math.ceil( (count - 1) / dimension );

	var i;
	var cells = GetCells();

	var top = scrollListDiv.parentElement.scrollTop;

	var res = null;
	while( low <= high  && res == null)
	{
		i = Math.floor( (low  + high) / 2);
		var cell = cells[i * dimension ];

		//i is too SMALL. Need to search in higher space.
		if ( cell != null && (cell.offsetTop + cell.offsetHeight <= top))
		{
			low = i + 1;
			continue;
		}
		//If cell is null, then we're too high. Need to search in a
		//smaller space.
		if ( cell == null )
		{
			high = i - 1;
			continue;
		}
		var prevCell = null;

		var j;
		for ( j=i-1; j>-1; j--)
		{
			prevCell = cells[j * dimension ];
			if (prevCell == null || prevCell.offsetTop != cell.offsetTop
				|| prevCell.offsetHeight != cell.offsetHeight)
				break;
		}
		i = j+1;

		if ( i == 0 )
		{
			res = i;
			break;
		}
	
		if (cell != null && prevCell != null
			&&(prevCell.offsetTop + prevCell.offsetHeight <= top))
		{
			res = i;
			break; // Match! prev cell is before area & this cell after.
		}

		high = i - 1;
	}

	var fsEnd = new Date().getTime();
	TVShell.Message( "GetScrollIndex: LEAVE. time=" + (fsEnd-fsStart) );

	return res * dimension;
}

var refreshThumbnailsTimerID = -1;

function OnScrollHandler()
{
	if ( PhotosItemArray == null || PhotosItemArray.length == 0 )
		return;

	clearTimeout( refreshThumbnailsTimerID );
	refreshThumbnailsTimerID = setTimeout( RefreshThumbnails, 300 );
}

var refreshThumbnailsLastScrollIndex = -2;
var refreshThumbnailsLastDimension = -2;

function RefreshThumbnails()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "RefreshThumbnails: ENTER" );

	scrollIndex = GetScrollIndex();
	TVShell.Message("SI = " + scrollIndex);
	if ( scrollIndex != refreshThumbnailsLastScrollIndex
		|| dimension != refreshThumbnailsLastDimension)
	{
		PhotoManager.ClearThumbnailRequestQueue();
	
		st = new Date().getTime();

		var imgThumbURL;
		var thumbnails = GetThumbnailImages();
		for( i = scrollIndex - nImageOnPage ; i<=scrollIndex-1 ; i++)
		{
			if(PhotosItemArray[i] && PhotosItemArray[i].href)
			{
				imgThumbURL = RequestThumbnail(PhotosItemArray[i].href);	
				var imgThumbnailElement = thumbnails[i];
				if(imgThumbnailElement)				
					imgThumbnailElement.src = imgThumbURL;
			}
		}
	
		et = new Date().getTime();
		TVShell.Message( "RequestThumb Page=Prev. time=" + (et-st) );

		st = et;
		for( i = scrollIndex + nImageOnPage*2; i>=scrollIndex; i--)
		{
			if(PhotosItemArray[i] && PhotosItemArray[i].href)
				imgThumbURL = RequestThumbnail(PhotosItemArray[i].href);	
			var imgThumbnailElement = thumbnails[i];
			if(imgThumbnailElement)				
				imgThumbnailElement.src = imgThumbURL;
		}
		et = new Date().getTime();
		TVShell.Message( "RequestThumb Page=Next & Curr. time="+(et-st));

		refreshThumbnailsLastScrollIndex = scrollIndex;
		refreshThumbnailsLastDimension = dimension;
	}

	var fsEnd = new Date().getTime();
	TVShell.Message( "RefreshThumbnails: LEAVE. time=" + (fsEnd-fsStart) );
}

function ZoomIn()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "ZoomIn: ENTER" );
	if(dimension>4)
		GenerateNewTable(4);
	//else if(dimension<=1)
	//	GenerateNewTable(1);
	else if(dimension<=2)
		GenerateNewTable(2);
	else
		GenerateNewTable(dimension-1);	
	var fsEnd = new Date().getTime();
	TVShell.Message( "ZoomIn: LEAVE. time=" + (fsEnd-fsStart) );
}

function ZoomOut()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "ZoomOut: ENTER" );
	if(dimension>=4)
		GenerateNewTable(4);
	//else if(dimension<1)
	//	GenerateNewTable(1);
	else if(dimension<2)
		GenerateNewTable(2);
	else
		GenerateNewTable(dimension+1);	
	var fsEnd = new Date().getTime();
	TVShell.Message( "ZoomOut: LEAVE. time=" + (fsEnd-fsStart) );
}

function OnClickedCheckBox(i,checked)
{
	var cells = GetCells();
	if(checked)
	{
		CheckedItemCount++;
		PhotosItemArray[i].checked = true;
		cells[i].style.backgroundColor='#C3D5BA';
	}
	else
	{
		CheckedItemCount--;
		PhotosItemArray[i].checked = false;
		cells[i].style.backgroundColor='transparent';
	}
	
	if(CheckedItemCount == nPhotos)
		document.all.SelectAllID.checked = true;
	else
		document.all.SelectAllID.checked = false;
		
	UpdateSelectedCountStr();
	TVShell.Message(" CheckedItemCount =" + CheckedItemCount);
}

function OnDropDownSelect()
{
	var subFrame = window.frames['scrollListIFrame'];
	var subDoc = subFrame.document;

	subDoc.all["group" + dropDown.selectedIndex].scrollIntoView();
}

function GoPrevDDValue()
{
	if(dropDown.selectedIndex<=0)
		dropDown.selectedIndex = dropDown.length - 1;
	else
		dropDown.selectedIndex--;
		
	dropDown.onSelect();
}

function GoNextDDValue()
{
	if(dropDown.selectedIndex>=dropDown.length - 1)
		dropDown.selectedIndex = 0;
	else
		dropDown.selectedIndex++;

	dropDown.onSelect();
}

var scrollListDiv = null;
var warningCell = null;
var warningTable = null;

function CreateScrollingDiv()
{
	var div = null;
	try
	{
		var subFrame = window.frames['scrollListIFrame'];
		var subDoc = subFrame.document;
		subDoc.mainDocument = document;
		for ( var i =0; i <document.styleSheets.length; i++)
		{
			//Import style sheets.
			var href = document.styleSheets[i].href;
			subDoc.createStyleSheet( href );
		}

		subDoc.body.style.backgroundColor='transparent';
		subDoc.body.style.border='none';
		subDoc.body.innerHTML = "<div id=scrollListDiv tabIndex=-10001  style='height:100%; padding-right:23px; border-top:1px solid #888888;'></div>";

		subFrame.attachEvent("onscroll", OnScrollHandler);
	
		div = subDoc.all.scrollListDiv;
		document.body.delegate = subDoc.body;

		var warn = new Array();
		var j=0;
		warn[j++] = "<table id=warningTable width=100% cellspacing=0 cellpadding=0 style='display:none'>";
		warn[j++] = "<tr width=100%>";
		warn[j++] = "<td valign=center>";
		warn[j++] = "<div style='position:relative;left:5px;margin:0 0 0 0;behavior:url(#default#alphaImageLoader);src:url(msntv:/Panels/Images/AlertsIconWarning.png);width:40px;height:40px;'></div>";
		warn[j++] = "</td>";
		warn[j++] = "<td id=warningCell style='font-size:16px;padding-top:5px'>";
		warn[j++] = "</td>";
		warn[j++] = "</tr>";
		warn[j++] = "</table>";
		div.innerHTML = warn.join("");

		warningCell = subDoc.all.warningCell;
		warningTable = subDoc.all.warningTable;
	} catch (ex) {
		TVShell.Message( "CreateScrollingDiv: " + ex );
	}

	return div;
}

function BuildScrollArea(source)
{
	scrollListDiv = CreateScrollingDiv();
	TVShell.Message( "Created scrolling div. " );

	ScrollArea.style.pixelHeight = document.body.clientHeight - ScrollArea.offsetTop;
			
	if(fileOpen || nPhotos<=1)
		selectAllTD.style.visibility = "hidden";
	else
		topRow.style.display = "block";
		
	if(PhotosItemArray && PhotosItemArray.length>0 && (DifferentDatesList.length + (DirectoryArray.length>9 ? 1 : 0)) > 1)
	{
		topRow.style.display = "block";
		DropdownRow.style.display = "block";
		JumpToRow.style.display = "block";
		
		var dropDownLength = DifferentDatesList.length;

		for(i=0; i<DifferentDatesList.length; i++)
		{
			dropDown.AppendItem(DifferentDatesList[i]);			
		}
		
		if(dropDownLength >=4)
			dropDown.size = 4;	
		else
			dropDown.size = dropDownLength;
	}
									
	if(!XMLFileURL && !fFlattenDirectories)
	{
		try {
		BuildDirectoryList(scrollListDiv, source);
		} catch ( ex ) {
			TVShell.Message( "failed to build dir list.ex: " + ex );
		}
	}

	TVShell.Message( "Done building directories. " );
			
	if (nPhotos > 0)
	{
		BuildCompleteTable();
		OnScrollHandler();
	} else if (DirectoryArray.length <= 0)
	{
		scrollListDiv.innerHTML = "<div style='padding:15px;'>No photos or albums found</div>";	
	}
}
