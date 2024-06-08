// SignalStrength.js
// Must include TVShell.js before SignalStrength.js
// Must include ConnectionManager.js before SignalStrength.js

var SignalStrengthUpdateInterval = 3000;  // the signal strength meter update interval (3 seconds)
var PersistentProperties = TVShell.Property("Persistent/");
var PartnerKVH = "partner_KVH";
var KVH_URL = "wsignalnum.htm";
var MaxSignalStrengthBars = 4;

function WriteSignalStrength(SignalStrengthPercentage)
{
	var NumberOfBars = Math.round(SignalStrengthPercentage*MaxSignalStrengthBars/100);

	if (NumberOfBars < 0) {
		NumberOfBars = 0;
	} else if (NumberOfBars > MaxSignalStrengthBars) {
		NumberOfBars = MaxSignalStrengthBars;
	}

	var image = "wifi_" + NumberOfBars + ".png";

	return "<span style='vertical-align:middle; height:36px; behavior:url(#default#alphaImageLoader); src:msntv:/Panels/images/" + image + ";'></span>";
}

function IsPartnerKVH()
{
	return PersistentProperties && PersistentProperties(PartnerKVH);
}

function PercentageReading(currentReading, minReading, maxReading)
{
	// force these variables to be treated as numbers and not strings
	currentReading *= 1;
	minReading *= 1;
	maxReading *= 1;

	if (minReading > maxReading) {
		minReading = maxReading;
	}

	if (currentReading < minReading) {
		currentReading = minReading;
	} else if (currentReading > maxReading) {
		currentReading = maxReading;
	}

	var percentage;

	if (maxReading == minReading) {
		percentage = 0;
	} else {
		percentage = (currentReading - minReading)*100/(maxReading - minReading);
	}

	return percentage;
}

function RouterURL()
{
	var routerURL = "";
	var WANAdapter = TVShell.ConnectionManager.WANAdapter;

	if (WANAdapter && WANAdapter.Type != AdapterType_NONE && WANAdapter.Type != AdapterType_Modem) {
		var routerIPAddress = WANAdapter.Gateway;

		if (routerIPAddress && routerIPAddress != "") {
			routerURL = "http://" + routerIPAddress + "/" + KVH_URL;
		}
	}

	return routerURL;
}
