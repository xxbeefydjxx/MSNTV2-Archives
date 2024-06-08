var count=0;
var nPhotos = 0;
var fileOpen;
var nThumbnailReady = 0;
var selectedPhotoIndex=0;
var XMLFileURL;
var FileNameArray;
var allImageFileNames = "";

var dimension = 3; 
var cellSpanWidth=92;
var cellSpanHeight=69; 

var nImageOnPage = dimension*dimension + dimension;		
var scrollIndex = 0;
var highestScrollTopSofar = 0;	

var SelectedImageFileNames = "";
var CheckedItemNames=""; 
var CheckedItemCount = 0;
var CheckedFileArray;
var selectedRadioIndex = -1;
var MAX_NUM_TO_ATTACH_ON_BROADBAND=36;
var MAX_NUM_TO_ATTACH_ON_NARROWBAND=5;

var StorageDeviceVN=parameters.StorageDeviceVN;
var path = parameters.path;
TVShell.Message("path = " + path);
// LOCATION = 0 := ON_THE_BOX (i.e. the unit's internal flash drive)
// LOCATION = 1 := REMOVABLE_LOCAL_STORAGE (i.e. memory card)
// LOCATION = 2 := OTHER (i.e. network, mail, or ... )
var location = parameters.location;
var fromMail = parameters.fromMail;	
var selectedFileName = "\\temp\\photo\\TempSelectedPhotoList.txt";		
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
//Sink.AttachEvent(PhotoManager, "OnResizedImageReady"   , OnResizedImageReady);

var thumbnailNodesImgMap = null;
function LookupThumbnailURL(fileName)
{
	if (thumbnailNodesImgMap==null && FileNameArray != null)
	{
		thumbnailNodesImgMap = new Object();
		var thumbnailNodes = mainPanel.Document.GetThumbnailNodes();
		for( var i = 0; i < nPhotos; i++ )
		{
			var node = thumbnailNodes.item(i);	
			if (node && FileNameArray[i])
			{
				thumbnailNodesImgMap[FileNameArray[i]]= node.text;
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
	if (indexMap==null && FileNameArray != null)
	{
		indexMap = new Object();
		for( var i = 0; i < nPhotos; i++ )
		{
			if (FileNameArray[i])
			{
				indexMap[FileNameArray[i]] = i;
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
	index = LookupIndex(imgSrcURL);
	if ( index < nPhotos )
	{
		var thumbURL  = FormatURL(PhotoManager.GetResizedImageURL(imgSrcURL));
		//TVShell.Message("thumbURL = " + thumbURL);
		var imgThumbnailElement = document.all["imgThumbnail"+index];
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


function OnThumbnailReady(imgSrcURL)
{
	//TVShell.Message("OnThumbnailReady " + imgSrcURL);
	index = LookupIndex(imgSrcURL);
	if ( index < nPhotos )
	{
		//TVShell.Message("i=" + index + " n= " + nPhotos + " F= " + FileNameArray[index]);
		//TVShell.Message("imgSrcURL = " + imgSrcURL);
		var thumbURL  = FormatURL(PhotoManager.GetThumbnailImageURL(imgSrcURL));
		//TVShell.Message("thumbURL = " + thumbURL);
		
		var imgThumbnailElement = document.all["imgThumbnail"+index];
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

				var maybeMemoryCard =
				  StorageDevice.Removable && !StorageDevice.IsNetwork && 
				  StorageDevice.Mounted;

				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var name = node.selectSingleNode(".//a:displayname").text;
					var href = node.selectSingleNode(".//a:href").text;
					var nameLowerCase = name.toLowerCase();
					fFlattenDirectories = fFlattenDirectories
					  || (maybeMemoryCard && nameLowerCase == "dcim");

					if (href) {
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

				for (i = 0; i < length; i++) {
					var node = nodes.item(i);
					var name = node.selectSingleNode(".//a:displayname").text;
					var href = node.selectSingleNode(".//a:href").text;
					var contentType = node.selectSingleNode(".//a:getcontenttype").text;
					var dateNode = node.selectSingleNode(".//a:getlastmodified");
					if(!dateNode)
						dateNode = node.selectSingleNode(".//a:creationDate");
					var date = "";
					if(dateNode)
						date = dateNode.text;

					var timeV =new Date(ChangeHyphenToSlash(date));

					if (href) {
					  PhotosItemArray[i] = new PhotosItem(name, href, contentType, date, timeV.getTime());
					}
				}

				if(PhotosItemArray && PhotosItemArray.length>0)
				{
					PhotosItemArray.sort(SortItemsByTime);
				
					var a = new Array();
					for (var j = 0; j < PhotosItemArray.length; j++)
					{
						a[j] = PhotosItemArray[j].href;
					}
					allImageFileNames = a.join("\n") + "\n";
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

function BuildDirectoryList(scrollListDiv, source)
{
	if(!DirectoryArray || DirectoryArray.length <= 0)
		return;
	var st = new Date().getTime();
	var div = document.createElement("DIV");		
	
	//currentGroupID++;					
	var j = 0;
	var divHTML = new Array();
	divHTML.length++;
	divHTML[j++] = "<span class=groupLabel style='font-size:18px; border-top:none;'><div style='width:36px; height:31px; display:inline; margin-right:5px; behavior:url(#default#alphaImageLoader); src:url(../Images/MediaFolder.png);'></div>Folders</span>";

	divHTML.length++;
	divHTML[j++]="<UL style='padding:10px 0 0 9px;'>"
	
	for(i=0; i < DirectoryArray.length; i++) {
		var destURL="";
		if(source=="Picker")
			destURL = "Picker.html";
		else
			destURL = "Viewer.html";					
		destURL+="?location=" + location;
		if(StorageDeviceVN)
		{
			destURL+="&StorageDeviceVN=" + escapeplus(escape(StorageDeviceVN));
			
			var pathText = GetPath(StorageDeviceVN, DirectoryArray[i].href);
			if(pathText)
				destURL+="&path=" + escapeplus(escape(pathText));
		}
			
		if(source=="Picker")
		{
			if(fileOpen)
				destURL+="&fileOpen=true";
			else
				destURL+="&fromMail=true";
		}
		
		//TVShell.Message("dest = " + pathText);
		//TVShell.Message("destURL = " + destURL);
		divHTML.length++;
		divHTML[j++]="<li><span class=\"li\"><a id=\"folder" + i + "\" style=\"display:inline-block;\" onclick=\"GotoURL('" + EscapeScriptString(destURL) + "');\">" + DirectoryArray[i].name + "</a></span></li>";
	}

	divHTML.length++;
	divHTML[j++]="</UL>";
	div.innerHTML = divHTML.join("");

	scrollListDiv.appendChild(div);		
	var et = new Date().getTime();
	TVShell.Message( "BuildDirectoryList(). time=" + (et-st));
}
								
function BuildTable(startIndex, endIndex)
{
	var fsStart = new Date().getTime();
	TVShell.Message( "BuildTable: ENTER" );
    
	for( index = startIndex; index < nPhotos && index <endIndex; index++ )
	{
		if(!XMLFileURL && currentGroup!=formatDate(PhotosItemArray[index].date))
		{
			currentGroup=formatDate(PhotosItemArray[index].date);	
			//TVShell.Message("******************" + currentGroup);
			var  group = document.createElement("A");	
			group.className = "groupLabel";
			group.id="group" + currentGroupID; 
			if (index == 0 && DirectoryArray.length == 0) {
				group.style.borderTop = "none";
			}
			group.innerText = currentGroup;
			scrollListDiv.appendChild(group);
			
			currentGroupID++;	
		}
		
		var imgSrcURL = FileNameArray[index];
			
		var cell;
		var bgHighlight = false;
		var cellHTML="<span style='xbackground-color:red; height:100%; padding-right:2px;'>";
		var imgSrcURLLC = imgSrcURL.toLowerCase();
		
		if(PhotosItemArray[index].checked)
		{
			if(fileOpen)
				cellHTML+= "<INPUT TYPE=radio onclick='OnClickedRadio("+index+");' CHECKED=true NAME=radio>";
			else			
				cellHTML+= "<INPUT TYPE=checkbox onclick='OnClickedCheckBox("+index+");' CHECKED=true NAME=chk" + index +" >";
			bgHighlight = true;
		}
		else 
		{
			if(fileOpen)
				cellHTML+= "<INPUT TYPE=radio onclick='OnClickedRadio("+index+");' NAME=radio>";
			else			
				cellHTML+= "<INPUT TYPE=checkbox onclick='OnClickedCheckBox("+index+");' NAME=chk" + index +">";
		}
		
		UpdateSelectedCountStr();
		
		cellHTML+="</span>";
		cellHTML+= "<span id=CellSpan" + index + " style='width:" + cellSpanWidth + "; height:" + cellSpanHeight + "; overflow-x:hidden;'>";
		cellHTML+= "<img height=" + cellSpanHeight + " id=imgThumbnail"+index+" LOWSRC='";
		cellHTML+= PhotoManager.DefaultPhotoThumbURL;
		cellHTML+="' onmouseout='OnScrollListMouseOut();' onmouseover='UpdateCountStr(" + index + ");' xonClick=GotoSlideShow(); ></span>";
		
		var cell = document.createElement("SPAN");
		cell.style.height=cellSpanHeight;	
		cell.innerHTML = cellHTML;
		cell.style.border = "1px solid #666666";
		cell.style.textAlign = "center"; 
		cell.style.padding= 2;
		cell.style.margin= 4;
		cell.id = "Cell"+index;
		scrollListDiv.appendChild(cell);		
			
		if(bgHighlight)
			cell.style.backgroundColor='#C3D5BA';
				
		count++;
	}

	var fsEnd = new Date().getTime();
	TVShell.Message( "BuildTable: LEAVE. time=" + (fsEnd-fsStart) );
}

function IsHighSpeed()
{
	return (TVShell.ConnectionManager.WANAdapter.RXSpeed >= 100000);
}

var sendPhotoIndex = 0;
var sendPhotosFileInfo = "";
var sendPhotosQuality = null;
var sendPhotosAction = null;

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
	var ucAction = action.substring(0,1).toUpperCase() + action.substring(1,action.length);

	var maxNum = IsHighSpeed() ? MAX_NUM_TO_ATTACH_ON_BROADBAND:MAX_NUM_TO_ATTACH_ON_NARROWBAND;

	if ( CheckedItemCount > maxNum )
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
	var i = sendPhotoIndex++;
	try
	{
		var fileLocation = "";
	
		if(quality)
		{
			fileLocation = PhotoManager.GetResizedImageLocation(quality);
		}

		var srcURL = CheckedFileArray[i];

		if (CheckedItemCount == 0
			|| (SelectedImageFileNames && 
				SelectedImageFileNames.indexOf(PhotoManager.GetFileName(srcURL)) != -1) )
		{
			SendPhotosContinue();
			return;
		}

		if(IsInRotatedImageList(srcURL))
		{
			srcURL = PhotoManager.GetRotatedImageURL(CheckedFileArray[i]);
		}
		else
		{
			srcURL= ResizeAndGetURL(CheckedFileArray[i], photoAreaHeight, photoAreaWidth, true);
		}

		TVShell.Message("adjusted srcURL = '" + srcURL + "'");

		Heartbeat();
		
		var dstURL = fileLocation + PhotoManager.GetFileName(CheckedFileArray[i]);
		
		TVShell.Message("dstURL = '" + dstURL + "'" );

		if(ThumbnailManager.CopyFileToURL(srcURL, dstURL))
		{
			sendPhotosFileInfo+=dstURL;
			sendPhotosFileInfo+='\n';
			sendPhotosFileInfo+=Utilities.DetermineFileSize(dstURL);
			TVShell.Message("fileName = " + dstURL + " size = " + Utilities.DetermineFileSize(dstURL) + " array= " + FileNameArray[i] );
			sendPhotosFileInfo+='\n';	
			TVShell.Message("adding dstURL to sendPhotosFileInfo");
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
	if ( sendPhotoIndex < CheckedItemCount )
	{
		setTimeout( SendPhotos1, 10 );
	}
	else
	{
		//Warning failing silently if no photos were attached or
		// if an error occurred in send mail. 
		try
		{
			if (sendPhotosFileInfo != "" )
				SendMail(sendPhotosFileInfo);
			else
				TVShell.Message( "WARNING: SendPhotos() could not attach any photos" );
		}
		catch (ex)
		{
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
	TVShell.Message("GNT");
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
	
	var saveScrollIndex = 0;
	var activeElement = document.activeElement;
	for (var i = 0; i < count; i++) {
		var cell = document.all["Cell" + i];

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

	for (var j = 0; j < count; j++) {
		document.all["CellSpan" + j].style.width= cellSpanWidth;
		document.all["CellSpan" + j].style.height= cellSpanHeight;
		document.all["Cell" + j].style.height= cellSpanHeight;
		document.all["imgThumbnail" + j].style.height= cellSpanHeight;
	} 
	
	if(count < nPhotos && count < scrollIndex + nImageOnPage ) {
		BuildTable(count, count+nImageOnPage);
	}
	
	scrollListDiv.MyDoScroll("scrollToStart");
	document.all["Cell" + saveScrollIndex].scrollIntoView();
}

function ClearAll() 
{
	for (var i = 0; i<count; i++) {
		if(document.all["chk" + i]) {
			document.all["chk" + i].checked=false;
			document.all["Cell"+i].style.backgroundColor='transparent';	
		}
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

	if (document.all.SelectAllID.checked) {			
		for (var i = 0; i<count; i++) {
			if(document.all["chk" + i]) {
				document.all["chk" + i].checked=true;
				document.all["Cell"+i].style.backgroundColor='#C3D5BA';
			}
		}

		var itemCount = PhotosItemArray.length;
		for (var i = 0; i < itemCount; i++) {
			PhotosItemArray[i].checked = true;
			CheckedItemCount++;
		}
	}
	
	UpdateSelectedCountStr();
}

//NOTE: the old linear search was too slow for large number of files.
//	for(i=0; i<count; i++)
//		if(document.all["Cell" + i].offsetTop + document.all["Cell" + i].offsetHeight> scrollListDiv.scrollTop)
//			return i;
//
function GetScrollIndex()
{
	var low = 0;
	var high = count - 1;
	var i;
	TVShell.Message("GetScrollIndex.count = " + count );
	while( low <= high )
	{
		i = Math.floor( (low  + high) / 2);
		var cell = document.all["Cell" + i];

		//i is too SMALL. Need to search in higher space.
		if ( cell != null &&
			 (cell.offsetTop + cell.offsetHeight <= scrollListDiv.scrollTop))
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
			prevCell = document.all["Cell" + j];
			if (prevCell == null || prevCell.offsetTop != cell.offsetTop
				|| prevCell.offsetHeight != cell.offsetHeight)
				break;
		}
		i = j+1;

		if ( i == 0 )
			return i;
	
		if (cell != null && prevCell != null
			&&(prevCell.offsetTop + prevCell.offsetHeight
			   <= scrollListDiv.scrollTop))
			return i; // Match! prev cell is before area & this cell after.

		high = i - 1;
	}

	return 0;
}

var refreshThumbnailsTimerID = -1;
var onScrollHandlerLastScrollIndex = -2;
function OnScrollHandler()
{
	if ( FileNameArray == null || FileNameArray.length == 0 )
		return;
	var fsStart = new Date().getTime();
	TVShell.Message( "OnScrollHandler: ENTER" );
	var st;
	var et;

	var currentScrollTop = scrollListDiv.scrollTop;

	if(currentScrollTop > highestScrollTopSofar)
	{
		//TVShell.Message("here CST=" + currentScrollTop + " HST=" + highestScrollTopSofar);
		highestScrollTopSofar = currentScrollTop;
		BuildTable(count, count + nImageOnPage*2);
	}

	var si = GetScrollIndex();
	TVShell.Message("SI = " + si);

	if ( onScrollHandlerLastScrollIndex != si )
	{
		clearTimeout( refreshThumbnailsTimerID );
		refreshThumbnailsTimerID = setTimeout( RefreshThumbnails, 300 );
	}
	onScrollHandlerLastScrollIndex = si;

	var fsEnd = new Date().getTime();
	TVShell.Message( "OnScrollHandler: LEAVE. time=" + (fsEnd-fsStart) );
}

var refreshThumbnailsLastScrollIndex = -2;

function RefreshThumbnails()
{
	var fsStart = new Date().getTime();
	TVShell.Message( "RefreshThumbnails: ENTER" );

	scrollIndex = GetScrollIndex();
	TVShell.Message("SI = " + scrollIndex);
	if ( scrollIndex != refreshThumbnailsLastScrollIndex )
	{
		PhotoManager.ClearThumbnailRequestQueue();
	
		st = new Date().getTime();

		var imgThumbURL;
		for( i = scrollIndex - nImageOnPage ; i<=scrollIndex-1 ; i++)
		{
			if(FileNameArray[i])
			{
				imgThumbURL = RequestThumbnail(FileNameArray[i]);	
				var imgThumbnailElement = document.all["imgThumbnail"+i];
				if(imgThumbnailElement)				
					imgThumbnailElement.src = imgThumbURL;
			}
		}
	
		et = new Date().getTime();
		TVShell.Message( "RequestThumb Page=Prev. time=" + (et-st) );

		st = et;
		for( i = scrollIndex + nImageOnPage*2; i>=scrollIndex; i--)
		{
			if(FileNameArray[i])
				imgThumbURL = RequestThumbnail(FileNameArray[i]);	
			var imgThumbnailElement = document.all["imgThumbnail"+i];
			if(imgThumbnailElement)				
				imgThumbnailElement.src = imgThumbURL;
		}
		et = new Date().getTime();
		TVShell.Message( "RequestThumb Page=Next & Curr. time="+(et-st));

		refreshThumbnailsLastScrollIndex = scrollIndex;
	}

	var fsEnd = new Date().getTime();
	TVShell.Message( "RefreshThumbnails: LEAVE. time=" + (fsEnd-fsStart) );
}

function ZoomIn()
{
	if(dimension>4)
		GenerateNewTable(4);
	//else if(dimension<=1)
	//	GenerateNewTable(1);
	else if(dimension<=2)
		GenerateNewTable(2);
	else
		GenerateNewTable(dimension-1);	
}

function ZoomOut()
{
	if(dimension>=4)
		GenerateNewTable(4);
	//else if(dimension<1)
	//	GenerateNewTable(1);
	else if(dimension<2)
		GenerateNewTable(2);
	else
		GenerateNewTable(dimension+1);	
}

function OnClickedCheckBox(i)
{
	if(window.event.srcElement.checked)
	{
		CheckedItemCount++;
		PhotosItemArray[i].checked = true;
		document.all["Cell"+i].style.backgroundColor='#C3D5BA';
	}
	else
	{
		CheckedItemCount--;
		PhotosItemArray[i].checked = false;
		document.all["Cell"+i].style.backgroundColor='transparent';
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
	while (document.all["group" + dropDown.selectedIndex]==null)
	{
		BuildTable(count, count+nImageOnPage);
	}
	
	document.all["group" + dropDown.selectedIndex].scrollIntoView();
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

function BuildScrollArea(source)
{
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
		//TVShell.Message("DifferentDatesList.length = " + DifferentDatesList.length);
		
		/*
		if(DirectoryArray && DirectoryArray.length > 0 && !fFlattenDirectories)
		{
			dropDown.AppendItem("Folders");
			dropDownLength++;
		}
		*/
			
		for(i=0; i<DifferentDatesList.length; i++)
		{
			dropDown.AppendItem(DifferentDatesList[i]);			
		}
		
		if(dropDownLength >=4)
			dropDown.size = 4;	
		else
			dropDown.size = dropDownLength;
	}
									
	scrollListDiv.attachEvent("onscroll", OnScrollHandler);
	if(!XMLFileURL && !fFlattenDirectories)
		BuildDirectoryList(scrollListDiv, source);
			
	if (nPhotos > 0)
	{
		BuildTable(0, nImageOnPage);
		OnScrollHandler();
	} else if (DirectoryArray.length <= 0)
	{
		scrollListDiv.innerHTML = "<div style='padding:15px;'>No photos or albums found</div>";	
	}
}
