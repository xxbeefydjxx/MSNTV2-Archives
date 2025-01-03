

<html xmlns:msntv="http://www.microsoft.com/msntv">
<?import namespace="msntv" implementation="Controls/custombutton.htc"?>
<?import namespace="msntv" implementation="Controls/mapsheading.htc"?>
<?import namespace="msntv" implementation="Controls/DropDownList.htc">

<head>
	<meta http-equiv="imagetoolbar" content="no">

	<title>Maps & Directions</title>
	
	<link rel="stylesheet" href="maps.css" type="text/css" />
	
	<script language="javascript" type="text/javascript">
	    // initialize text boxes if returning to this page in error
	    function OnPageLoad() {
	        
            //only fill values if exist, otherwise you will overwrite what was there
	        //when hitting back
	        if(false) {
	            PopulateTextFields("", "", "", "");
	            alert("Maps & Directions could not find a matching location. Try again.");
	        }
	        document.getElementById("streetInput").focus();
	    }
	    
	    function PopulateTextFields(a, c, s, z)
	    {
	        document.getElementById("StreetInput").value = a;
	        document.getElementById("CityInput").value = c;
            document.getElementById("StateInput").value = s;
            document.getElementById("ZipInput").value = z;
        }
	
	    function EnterSearch() {
	        if (window.event && window.event.keyCode == 13) {
                SubmitSearch('','MapSearch');
            } else {
                return true;
            }
	    }
	
        function SubmitSearch(prefilledParams, phaseName) {
           if(ValidateForm()) {
                var parms="";
                parms += "phase" + "=" + phaseName + "&";
                parms += "a=" + document.getElementById("StreetInput").value + "&";
                parms += "c=" + document.getElementById("CityInput").value + "&";
                parms += "s=" + document.getElementById("StateInput").value + "&";
                parms += "z=" + document.getElementById("ZipInput").value;
                var direction = "LocMatches.aspx" + "?" + prefilledParams + parms;
                document.location = direction;
            }
        }
        
        function ValidateForm() {
            if(document.getElementById("CityInput").value.length == 0 && document.getElementById("StateInput").value.length == 0 && 
                    document.getElementById("ZipInput").value.length == 0) {
                alert("Please enter a full address");
                return false;    
            }
            return true;
        }
        
        
    </script>
    
    
<!-- HELP - BEGIN -->
<script>
var baseURL = "http://sg3.msntv.msn.com/apps/help/Help.ashx";
var	PH_search =	0;
var	PH_specificPage	= 1;
var	PH_TOC = 2;
var	PH_topicTOC	= 3;
var	PH_diploma = 4;

function CallPaneHelp(hmode)
{
	if (hmode == PH_topicTOC)
	{
		PaneHelpURL	= baseURL + "?page=" + arguments[1];
	}
	else if	(hmode == PH_diploma)
	{
		PaneHelpURL	= baseURL + "?page=" + arguments[1];
		if (arguments[2])
			PaneHelpURL	+= "&amp;jumpURL=" + escape(arguments[2]);
		else
			PaneHelpURL	+= "&amp;retURL=" +	encodeURIComponent(window.location.href);
	}
	else if	(hmode == PH_TOC)
	{
		PaneHelpURL	= baseURL + "?page=" + 'MSNTV_ALTTOC_main.htm';
	}
	else if	(hmode == PH_search)
	{
		alert("Help	search is not supported");
		return;
	}
	else if	(hmode == PH_specificPage)
	{
		PaneHelpURL	= baseURL + "?page=" + escape(arguments[1]) + "&amp;retURL=" + encodeURIComponent(window.location.href);
	}
	top.location = PaneHelpURL;
}
</script>
<!-- HELP - END -->
		



	
</head>

<body onload="OnPageLoad()">
    <div id="mainLogoDiv"><msntv:MapsHeading subtitle="Maps & Directions" subtitle2="Choose a location" helpURL="JavaScript:CallPaneHelp(PH_topicTOC, 'MSNTV_TRS_TOC_Maps.htm')" /></div>
    
    <div id="mainDiv">
        <div style="margin-bottom:20;">Enter a location in the U.S. to view it on a map. (You can enter a specific address, or just a city, state, or ZIP code.)</div>

        
        <table class="controlTable">
            <tr>
                <td>Street:</td>
                <td><input type="text" size="30" maxlength="75" class="inputText" id="StreetInput" onkeypress="javascript:EnterSearch()" /></td>
            </tr>
            <tr>
                <td>City:</td>
                <td><input type="text" size="30" maxlength="49" class="inputText" id="CityInput" onkeypress="javascript:EnterSearch()" /></td>
            </tr>
            <tr>
                <td>State:</td>
                <td><input type="text" size="10" maxlength="20" class="inputText" id="StateInput" onkeypress="javascript:EnterSearch()" /></td>
            </tr>
            <tr>
                <td>Zip:</td>
                <td><input type="text" size="10" maxlength="12" class="inputText" id="ZipInput" onkeypress="javascript:EnterSearch()" /></td>
            </tr>
        </table>
    	
	    <div id="buttonBar">
            <msntv:CustomButton label="View Map" onclick="javascript:SubmitSearch('','MapSearch')" />
	        
	    </div>
	</div>
</body>

</html>