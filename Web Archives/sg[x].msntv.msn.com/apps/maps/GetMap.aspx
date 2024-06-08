

<html xmlns:msntv="http://www.microsoft.com/msntv">
<?import namespace="msntv" implementation="Controls/custombutton.htc"?>
<?import namespace="msntv" implementation="Controls/mapsheading.htc"?>

<head>

    <meta http-equiv="imagetoolbar" content="no">

    <title>Maps & Directions</title>
    
    <link rel="stylesheet" href="maps.css" type="text/css" />
    
    <!-- Include the Virtual Earth Map Control, Style Sheet -->
    
      
    <script type="text/javascript" src="MapControl6_2.js"></script>
     
    <style type="text/css">
        div.MSVE_ScaleBar{display:none;} 
        div.MSVE_PoweredByLogo{display:none;} 
        div.MSVE_ScaleBarLabel{display:none;} 
        div.MSVE_Copyright{display:none;}
    </style>
    
    <script type="text/javascript">
        var keyleft = 37;
        var keyup = 38;
        var keyright = 39;
        var keydown = 40;
        var keypan = 80;
    
        var map = null;
        var curZoomIndex = 3;
        var curStyleIndex = 0;
        
        var zoomLevels = new Array();
        zoomLevels[0] = 1;
        zoomLevels[1] = 6;
        zoomLevels[2] = 11;
        zoomLevels[3] = 15;
        zoomLevels[4] = 19;
        
        var styles = new Array();
        styles[0] = 'r';
        styles[1] = 'h';
        styles[2] = 'o';
        var satelliteIndex = 2;
        
        var viewLabels = new Array();
        viewLabels[0] = "Road Map";
        viewLabels[1] = "Photo Map";
        viewLabels[2] = "Bird's Eye";
        
        var trafficlabel = new Array();
        trafficlabel[0] = "Show Traffic";
        trafficlabel[1] = "Hide Traffic";
        
        var zoomDiff = 0;
        var pix1 = new VEPixel(0,0); // changed to VEPixel
        var pix2 = new VEPixel(15,0);
        
        //Initialize the map control when the page loads		
        function OnPageLoad()
        {	            
            try
            {
                map = new VEMap('mapcontainer');
                //SetDashboardSize must be called before calling LoadMap
                map.SetDashboardSize(VEDashboardSize.Small);
                map.LoadMap(new VELatLong(,), 15, VEMapStyle.Road);
                var pin = new VEShape(VEShapeType.Pushpin, new VELatLong(,));
                map.AddShape(pin);
                map.HideDashboard();
//                SetZoomLevel(curZoomIndex);
                CalculateZoomDiff();
            }
            catch(identifier)
            {
                map = null;
                document.getElementById("mapcontainer").innerHTML = "<span id='mapImageError'>Oops. Map images are currently unavailable. Please try again in a few minutes.</span>";
            }
            document.getElementById("viewButton").focus();

        }
        
        function CalculateZoomDiff() {
            var z = map.GetZoomLevel();
            var p1 = map.PixelToLatLong(pix1, z);  //problem at this point         
            var p2 = map.PixelToLatLong(pix2, z);
            zoomDiff = Math.abs(p1.Longitude - p2.Longitude); //Longitude L must be capital
            }
        
        function SetZoomLevel(level)
        {
            if(map != null) {
                curZoomIndex = level;
             
                for(i=0; i<zoomLevels.length;i++) {
                    var imgId = "zoom" + i;
//                    if(level == i) {
//                        document.getElementById(imgId).setAttribute("src", "images/ZoomIncSelect.JPG");
//                    } else {
//                        document.getElementById(imgId).setAttribute("src", "images/ZoomInc.JPG");
//                    }
                }
                map.SetZoomLevel(zoomLevels[level]);//changed SetZoom to SetZoomLevel
                CalculateZoomDiff();
            }
        }
        
        function MSNTVZoomUp()
        {
            ZoomIn();
        }
        
        function ZoomIn()
        {
            if(map != null) {
                if(curStyleIndex != satelliteIndex) {
                    if(curZoomIndex < (zoomLevels.length - 1)) {
                        var curLevel = map.GetZoomLevel();
                        if((curLevel + 1) == zoomLevels[curZoomIndex+1]) {
                            SetZoomLevel(curZoomIndex+1);
                        } else {
                            map.ZoomIn();
                            CalculateZoomDiff();
                        }
                    } else {
                        map.ZoomIn();
                        CalculateZoomDiff();
                    }
                } else {
                    map.ZoomIn();
                }
            }
        }
        
        function MSNTVZoomDown()
        {
            ZoomOut();
        }
        
        function ZoomOut()
        {
            if(map != null) {
                if(curStyleIndex != satelliteIndex) {
                    if(curZoomIndex > 0) {
                        var curLevel = map.GetZoomLevel();
                        if((curLevel - 1) == zoomLevels[curZoomIndex-1]) {
                            SetZoomLevel(curZoomIndex-1);
                        } else {
                            map.ZoomOut();
                            CalculateZoomDiff();
                        }
                    } else {
                        map.ZoomOut();
                        CalculateZoomDiff();
                    }
                } else {
                    map.ZoomOut();
                }
            }
        }
        
        function ChangeView()
        {
            if(map != null) {
                if(curStyleIndex == satelliteIndex) {
                    setZoomControlVisibility("visible");
                }
                
                curStyleIndex = (curStyleIndex + 1) % styles.length;
                map.SetMapStyle(styles[curStyleIndex]);
              
                if(curStyleIndex == satelliteIndex) {
                    setZoomControlVisibility("hidden");
                }
                
                // only show link Bird's Eye Images if they're available
                var labelIndex = (curStyleIndex + 1) % styles.length;
             
                if(labelIndex == satelliteIndex && !map.IsBirdseyeAvailable()) { //removed method map.IsObliqueAvailable() NOT supported by Mappoint6.1
                    labelIndex = (labelIndex + 1) % styles.length;
                    curStyleIndex = (curStyleIndex + 1) % styles.length;
                }
              document.getElementById("viewButton").label = viewLabels[labelIndex];
            }
        }
        
        function setZoomControlVisibility(state)
        {
//            document.getElementById("zoomControl0").style.visibility = state;
//            document.getElementById("zoomControl1").style.visibility = state;
//            document.getElementById("zoomControl2").style.visibility = state;
//            document.getElementById("zoomControl3").style.visibility = state;
//            document.getElementById("zoomControl4").style.visibility = state;
            document.getElementById("showtrafficbutton").style.visibility = state;
        }
        
        function NewLocation()
        {
            document.location = "LocSearch.aspx?MapSearch";
        }
        
        function GetDirections()
        {
            document.location = "DirStartEnd.aspx?lat=&long=&a=&c=&s=&z=";
        }
        
        function GetCenterLatLong()
        {
            if (map.GetMapStyle() == VEMapStyle.Birdseye || map.GetMapStyle() == VEMapStyle.BirdseyeHybrid)
            {

            var be = map.GetBirdseyeScene();

            // Get pixel info about center of the map
            var pixel = be.LatLongToPixel(map.GetCenter(), map.GetZoomLevel());
            
            var center = be.PixelToLatLong(new VEPixel(pixel.x,pixel.y), map.GetZoomLevel());            
            return (new _xy1).Decode(center);
            }
            
            else
                return map.GetCenter(); 
        }
        
        function PanLeft()
        {
            if(map != null)
            {
                var center = GetCenterLatLong();
                map.PanToLatLong(new VELatLong(center.Latitude,center.Longitude-zoomDiff));   
            }
        }
        
        function PanRight()
        {
            if(map != null) {
                //map.PanToLatLong(map.GetCenterLatitude(),map.GetCenterLongitude()+zoomDiff);
                var center = GetCenterLatLong();
                map.PanToLatLong(new VELatLong(center.Latitude,center.Longitude+zoomDiff)); 
            }    		
        }
        
        function PanUp()
        {
            if(map != null) {
                    var center = GetCenterLatLong();
                    map.PanToLatLong(new VELatLong(center.Latitude+zoomDiff,center.Longitude));
                    //map.PanToLatLong(map.GetCenterLatitude()+zoomDiff,map.GetCenterLongitude());
            }
        }
        
        function PanDown()
        {
            if(map != null) {
                // map.PanToLatLong(map.GetCenterLatitude()-zoomDiff,map.GetCenterLongitude());
               
                    var center = GetCenterLatLong();
                    map.PanToLatLong(new VELatLong(center.Latitude-zoomDiff,center.Longitude));
            }
        }
        
        function ArrowOverride(isuparrow, isdownarrow)
        {
            if(window.event.keyCode == keypan && window.event.altKey) {
                document.getElementById("mapWrapper").disabled = false;
                document.getElementById("mapContainer").focus();
                window.event.returnValue = false;
            } else if(!(isuparrow == true && window.event.keyCode == keyup) && !(isdownarrow == true && window.event.keyCode == keydown)) {
                switch(window.event.keyCode) {
                    case (keyup): document.getElementById("panup").focus(); window.event.returnValue = false; break;
                    case (keyleft): document.getElementById("panleft").focus(); window.event.returnValue = false; break;
                    case (keyright): document.getElementById("panright").focus(); window.event.returnValue = false; break;
                    case (keydown): document.getElementById("pandown").focus(); window.event.returnValue = false; break;
                }
            }
        }
        
        function ShowClearTraffic()
        {   
            if (document.getElementById("showtrafficbutton").label == "Show Traffic")
            {
                if(map.GetZoomLevel() >=14 || map.GetZoomLevel()<9 )
                  map.SetZoomLevel(14);
               
                map.LoadTraffic(true);  
                //map.ShowTrafficLegend(400,50);
                //map.SetTrafficLegendText("The traffic");
                document.getElementById("showtrafficbutton").label = trafficlabel[1];          
            }
            else
            {
                map.ClearTraffic();
                document.getElementById("showtrafficbutton").label = trafficlabel[0];
            }      
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
    <div id="mainLogoDiv"><msntv:MapsHeading subtitle="" helpURL="JavaScript:CallPaneHelp(PH_topicTOC, 'MSNTV_TRS_TOC_Maps.htm')" /></div>
    
    <div id="mainui" style="width:560">
        <div id="mapwrapper" disabled="true">
            <div id="mapcontainer" style="width:560px; height:280px;"></div>    
        </div>
        
        <div id="mapPanControl">
            <a tabindex="1" onclick="JavaScript:PanUp()" onkeydown="JavaScript:ArrowOverride(true,false)" class="mapPanUp" id="panup"></a>
            <a tabindex="2" onclick="JavaScript:PanLeft()" onkeydown="JavaScript:ArrowOverride(false,false)" class="mapPanLeft" id="panleft"></a>
            <a tabindex="4" onclick="JavaScript:PanRight()" onkeydown="JavaScript:ArrowOverride(false,false)" class="mapPanRight" id="panright"></a>
            <a tabindex="3" onclick="JavaScript:PanDown()" onkeydown="JavaScript:ArrowOverride(false,true)" class="mapPanDown" id="pandown"></a>
        </div>
    </div>
    
    <div id="mapControl">
        <div id="mapZoomControl" style="left:9px; bottom: 60px; width: 42px; height: 50px;" >
            <msntv:CustomButton label="+" id="zoomDown" onclick="javascript:ZoomIn()" /><div style="left:9px;width:0.1cm; height: 13px;"></div>
            
            <msntv:CustomButton label="-" id="zoomUp" onclick="javascript:ZoomOut()" /></div>
       
        <div id="mapButtonBar" style="left:0.01px;">
            <msntv:CustomButton label="Photo Map" id="viewButton" onclick="javascript:ChangeView()" /><msntv:CustomButton label="New Location" onclick="javascript:NewLocation()" /><msntv:CustomButton label="Directions" onclick="javascript:GetDirections()" /><msntv:CustomButton label="Show Traffic" id="showtrafficbutton" onclick="javascript:ShowClearTraffic()" /></div>
    </div>
    
    <div class="MSVE_ScaleBar" ></div>  
    <div class="MSVE_PoweredByLogo" ></div>  
    <div class="MSVE_ScaleBarLabel" ></div> 
    <div class="MSVE_Copyright" ></div>  
</body>

</html>