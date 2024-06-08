var PanelManager			= TVShell.PanelManager;
var StorageManager			= TVShell.StorageManager;
var HomeNetworkObj			= TVShell.ConnectionManager.HomeNetworking;
var ContentSync				= new ActiveXObject("MSNTV.ContentSync");
var userDataPath			= ContentSync.UserDataPath;
var userDataVolumeName		= userDataPath;
var slashPosInUserDataPath  = userDataPath.lastIndexOf("\\");

if (slashPosInUserDataPath != -1) {
	userDataVolumeName = userDataPath.slice(slashPosInUserDataPath+1);
}

var playlistFilename		= "playlist.asx";
var tempPlaylistUrl1		= "file:///Temp/1" + playlistFilename;
var tempPlaylistUrl2		= "file:///Temp/2" + playlistFilename;
var savedSelectionsUrl		= "file:///" + userDataVolumeName + "/" + playlistFilename;
var audioTypes				= "audio/wav,audio/x-wav,audio/aiff,audio/x-aiff,audio/basic,audio/x-ms-wma,audio/x-ms-wax,audio/mpeg,audio/x-mpegurl";
var videoTypes				= "video/mpeg,video/x-ms-wmv,video/x-ms-wm,video/avi,video/msvideo,video/x-msvideo,video/asf";
var playlistTypes			= "video/x-ms-asf,video/x-ms-wvx,video/x-ms-wmx,application/vnd.ms-wpl";


function GotoURL(destURL)
{
	if(destURL)
		document.location = destURL;
}

function ReplaceBackSlashWithSlash(text)
{
	return text.replace(/\\/gi, "/");
}

function IsSameURL(URL1, URL2)
{
	return (ReplaceBackSlashWithSlash(URL1.toLowerCase()) == ReplaceBackSlashWithSlash(URL2.toLowerCase()));
}

function IsClientASXFile(URL)
{
	return (IsSameURL(URL, tempPlaylistUrl1) || IsSameURL(URL, tempPlaylistUrl2));
}

