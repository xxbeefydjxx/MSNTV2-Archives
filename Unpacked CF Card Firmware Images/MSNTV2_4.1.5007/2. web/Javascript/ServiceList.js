//
// ServiceList.js
//

var VK_BROWSER_HOME			= 0xAC;

function InitializeServiceList()
{
	var ServiceList = TVShell.ServiceList;
	var BuiltinServiceList = TVShell.BuiltinServiceList;
	var entry;

	ServiceList.Restore();

	entry = BuiltinServiceList.Add("SignOn");
	entry.URL = "msntv:/TVShell/login.html";

	entry = BuiltinServiceList.Add("Photos");
	entry.URL = "msntv:/Photo/PhotoHome.html";
	entry.Safe = true;
	entry.ProvisioningRequired = true;
	
	if (TVShell.Property("MusicFeature")) {
		entry = BuiltinServiceList.Add("Music");
		entry.URL = "msntv:/Music/MusicHome.html";
		entry.KeyCode = VK_F10;
		entry.Safe = true;
		entry.ProvisioningRequired = true;
	}
	
	if (TVShell.Property("VideoFeature")) {
		entry = BuiltinServiceList.Add("Video");
		entry.URL = "msntv:/Video/VideoHome.html";
		entry.KeyCode = VK_F11;
		entry.Safe = true;
		entry.ProvisioningRequired = true;
	}

	entry = BuiltinServiceList.Add("Chat");
	entry.URL = "msntv:/OLTK/chatBlock.html";
	entry.Safe = true;
		
	entry = BuiltinServiceList.Add("mail::listmail");
	entry.URL = "msntv:/OLTK/EmailBlock.html";
	entry.Safe = true;
	
	entry = BuiltinServiceList.Add("Help");
	entry.URL = "msntv:/Help/Contents.html";
	entry.KeyCode = VK_HELP;

	entry = BuiltinServiceList.Add("Settings");
	entry.URL = "msntv:/Settings/Settings.html";

	entry = BuiltinServiceList.Add("connection::prereg");
	entry.URL = MSNTVServiceList[0].URL;
	entry.Description = MSNTVServiceList[0].Name;

	entry = BuiltinServiceList.Add("media::default");
	entry.URL = "msntv:/Music/MusicHome.html";

	entry = BuiltinServiceList.Add("favorite::shortcut1");
	entry.KeyCode = VK_F1;

	entry = BuiltinServiceList.Add("favorite::shortcut2"); 
	entry.KeyCode = VK_F2;

	entry = BuiltinServiceList.Add("favorite::shortcut3");
	entry.KeyCode = VK_F3;

	entry = BuiltinServiceList.Add("browser::back");
	entry.KeyCode = VK_BROWSER_BACK;
	entry = BuiltinServiceList.Add("browser::esc");
	entry.KeyCode = VK_ESCAPE;

	entry = BuiltinServiceList.Add("browser::search");
	entry.KeyCode = VK_BROWSER_SEARCH;
	
	entry = BuiltinServiceList.Add("browser::print");
	entry.CharCode = "N".charCodeAt(0) & 0x1F;
	entry.KeyCode = VK_PRINT;

	entry = BuiltinServiceList.Add("TVLensMode");
	entry.CharCode = "Z".charCodeAt(0) & 0x1F;
	entry.KeyCode = VK_F6;

	entry = BuiltinServiceList.Add("ZoomUp");
	entry.KeyCode = VK_ADD;
	
	entry = BuiltinServiceList.Add("ZoomDown");
	entry.KeyCode = VK_SUBTRACT;

	entry = BuiltinServiceList.Add("SystemInfo::home");
	entry.URL = "msntv:/Settings/System/System.html";

	entry = BuiltinServiceList.Add("browser::showpopup");
	entry.Charcode = "P".charCodeAt(0) & 0x1F;

	if (TVShell.SystemInfo.Flavor != "release" && TVShell.SystemInfo.Flavor != "ppe") {
		entry = BuiltinServiceList.Add("TVLensModeTest");
		entry.SysCharCode = "z".charCodeAt(0);

		entry = BuiltinServiceList.Add("Tricks");
		entry.URL = "msntv:/Test/Tricks.html";
		entry.SysCharCode = "c".charCodeAt(0);

		entry = BuiltinServiceList.Add("CaptureScreen");
		entry.SysCharCode = "k".charCodeAt(0);

		entry = BuiltinServiceList.Add("HomeNetworkMount");
		entry.SysCharCode = "m".charCodeAt(0);

		entry = BuiltinServiceList.Add("ScreenSaver");
		entry.SysCharCode = "r".charCodeAt(0);
	}

	TVShell.Message("InitializeServiceList - Complete");
}

function IsRegistered()
{
	return (TVShell.ServiceList("connection::login") != null && TVShell.UserManager.Count > 0);
}

function GotoSignOn()
{
	var signonEntry = TVShell.BuiltinServiceList("SignOn");
	var SystemInfo = TVShell.SystemInfo;

	TVShell.Message("GotoSignOn");

	if (signonEntry && IsRegistered()) {
		signonEntry.KeyCode = VK_BROWSER_HOME;
		TVShell.URL = signonEntry.URL;

		// Set the default post-registration screen saver
		var ScreenSaver = TVShell.ScreenSaver;
		if (ScreenSaver.CurrentSaver.Name == "Prereg") {
			var TotalRAM = (SystemInfo.TotalPhysicalMemory + SystemInfo.ObjectStoreSize) / (1024*1024);

			if (TotalRAM > 64) {
				ScreenSaver.CurrentSaver = "Photo";
			}
			else {
				ScreenSaver.CurrentSaver = "Butterfly";
			}
		}
	}
	else if (SystemInfo.Flavor == "release" || SystemInfo.Flavor == "ppe") {
		TVShell.URL = "msntv:/Registration/pages/Welcome.html";
	}
	else {
		TVShell.URL = "msntv:/tvshell/Register.html";
	}
	
	return false;
}

function GotoSettings()
{
	var entry = TVShell.BuiltinServiceList("Settings");

	TVShell.Message("GotoSettings");

	if (entry)
		TVShell.URL = entry.URL;

	return false;
}
