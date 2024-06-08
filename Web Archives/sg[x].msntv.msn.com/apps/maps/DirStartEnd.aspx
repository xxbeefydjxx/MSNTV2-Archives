

<html xmlns:msntv="http://www.microsoft.com/msntv">
<?import namespace="msntv" implementation="Controls/custombutton.htc"?>
<?import namespace="msntv" implementation="Controls/mapsheading.htc"?>

<head>
	<meta http-equiv="imagetoolbar" content="no">

	<title>Maps & Directions</title>
	
	<link rel="stylesheet" href="maps.css" type="text/css" />
	
	<script language="javascript" type="text/javascript">
	    function OnLoad() {
	        document.getElementById("continueButton").focus();
	    }
	    
	    function GoSearch() {
	        var frm = document.forms[0];
	        frm.action = "LocSearch.aspx" + "?";
	        
	        var inputs = frm.getElementsByTagName('input');
	        for(var i=0; i < inputs.length; i++) {
	            if(inputs[i].type == 'radio' && inputs[i].checked) {
	                frm.action += inputs[i].value;
	                break;
	            }
	        }
            frm.submit();
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

<body onload="OnLoad()">
    <div id="mainLogoDiv"><msntv:MapsHeading subtitle="Maps & Directions" subtitle2="Driving directions" helpURL="JavaScript:CallPaneHelp(PH_topicTOC, 'MSNTV_TRS_TOC_Maps.htm')" /></div>
    
    <div id="mainDiv">
        <div style="padding-bottom:15">Current location:</div>
        <div style="padding-bottom:15;padding-left:15"></div>
        <div>Would you like directions starting or ending at this location?</div>
    
        <form id="dirStartEndSearchForm" action="" style="padding-left:15" method="post">
            
            <table class="controlTable">
                <tr>
                    <td><input type="radio" id="radioOption1" name="radioOptions" value="phase=DirEndSearch&slat=&slong=&sa=&sc=&ss=&sz="  checked /></td>
                    <td>Starting here</td>
                </tr>
                <tr>
                    <td><input type="radio" id="radioOption2" name="radioOptions" value="phase=DirStartSearch&dlat=&dlong=&da=&dc=&ds=&dz="/></td>
                    <td>Ending here</td></tr>
            </table>

        </form>
        
        <div id="buttonBar">
            <msntv:CustomButton id="continuebutton" label="Continue" onclick="javascript:GoSearch()" />
            <msntv:CustomButton label="Cancel" onclick="javascript:history.back()" />
        </div>
    </div>
</body>

</html>