//
// print.js
//
	var TVShell = new ActiveXObject("MSNTV.TVShell");

	var DRIVERVERSION =0     /* Device driver version                    */
	var HORZSIZE      =4     /* Horizontal size in millimeters           */
	var VERTSIZE      =6     /* Vertical size in millimeters             */
	var HORZRES       =8     /* Horizontal width in pixels               */
	var VERTRES       =10    /* Vertical height in pixels                */
	var LOGPIXELSX   = 88    /* Logical pixels/inch in X                 */
	var LOGPIXELSY   = 90    /* Logical pixels/inch in Y                 */
	var PHYSICALOFFSETX = 112;  /* The distance from the left edge of the physical page to the left edge of the printable area, in device units. */
	var PHYSICALOFFSETY = 113;  /* The distance from the top edge of the physical page to the top edge of the printable area, in device units. */

	var PrintManager=TVShell.PrintManager;

// Print panel notifications
	var Print_NotifyPrintPanelNull = 0;
	var Print_NotifyPrintPanelPrint = 1;
	var Print_NotifyPrintPanelPowerdown = 2;
	var Print_NotifyPrintPanelUpdateFromPreview = 3;
	var Print_NotifyPrintPanelMessageKey = 4;

// Print preview notifications
	var Print_NotifyPreviewNull = 0;
	var Print_NotifyPreviewClose = 1;

	function GetCurrPrinter()
	{
	  if(PrintManager.CurrPrintDevice>=0)
	    return PrintManager.Item(PrintManager.CurrPrintDevice);
	  else
	    return null;
	}

	// if fails, simply returns -1
	// dot per inch
	function GetDPI()
	{
		var currPrinter;

		currPrinter=GetCurrPrinter();

		if (currPrinter) {
			return currPrinter.Cap(LOGPIXELSX)
		} else {
			return -1;
		}
	}

	//logical pixel y resolution in pixels per inch
	function GetDPI_Y()
	{
		var currPrinter;

		currPrinter=GetCurrPrinter();

		if (currPrinter) {
			return currPrinter.Cap(LOGPIXELSY)
		} else {
			return -1;
		}
	}

	 // if fails, simply returns -1
	 // width in pixels
	 function GetXResolution()
	 {
	 	var currPrinter;
        currPrinter=GetCurrPrinter();
		if(currPrinter)
		{
		 if(PrintManager.Orientation == "Portrait")
			return currPrinter.Cap(HORZRES);
		 else
			return currPrinter.Cap(VERTRES);
		}
        else
		  return -1;
	 }

     //height in pixels
	 function GetYResolution()
	 {
	 	var currPrinter;
        currPrinter=GetCurrPrinter();
		if(currPrinter)
		{
		 if(PrintManager.Orientation == "Portrait")
			return currPrinter.Cap(VERTRES);
		 else
			return currPrinter.Cap(HORZRES);
		}
        else
		  return -1;
	 }

     //width in milimeters
	 function GetXSize()
	 {
	 	var currPrinter;
        currPrinter=GetCurrPrinter();
		if(currPrinter)
		  return currPrinter.Cap(HORZSIZE)
        else
		  return -1;
	 }
     
	 //height in milimeters
	 function GetYSize()
	 {
	 	var currPrinter;
        currPrinter=GetCurrPrinter();
		if(currPrinter)
		  return currPrinter.Cap(VERTSIZE)
        else
		  return -1;
	 }

	// X offset in printer pixels
	// The distance from the left edge of the physical page to the left edge of the printable area, in device units.
	function GetPhysicalOffsetX()
	{
		var currPrinter;

		currPrinter=GetCurrPrinter();

		if(currPrinter) {
			return currPrinter.Cap(PHYSICALOFFSETX)
		} else {
			return -1;
		}
	}

	// Y offset in printer pixels
	// The distance from the top edge of the physical page to the top edge of the printable area, in device units.
	function GetPhysicalOffsetY()
	{
		var currPrinter;

		currPrinter=GetCurrPrinter();

		if(currPrinter) {
			return currPrinter.Cap(PHYSICALOFFSETY)
		} else {
			return -1;
		}
	}
