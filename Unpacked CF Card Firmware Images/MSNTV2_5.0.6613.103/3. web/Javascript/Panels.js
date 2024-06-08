//
// Panels.js
//

// key modifiers
var FCONTROL = 8  // 0x08    CTRL key is required
var FALT  = 16    // 0x10    ALT key is rquired

// Panel.Type
var SYSTEM_PANEL_TYPE	= 0
var APP_PANEL_TYPE		= 1
var ALERT_PANEL_TYPE	= 2

// Panel.Transition
var STATIC_PANEL_STYLE	= 0
var SLIDING_PANEL_STYLE	= 1
var POPUP_PANEL_STYLE	= 2
//Safe size 560x420
var useSafe = TVShell.DeviceControl.UseSafeArea;
var SCREEN_WIDTH = useSafe ? TVShell.DeviceControl.SafeWidth : TVShell.DeviceControl.ScreenWidth;;
var SCREEN_HEIGHT = useSafe ? TVShell.DeviceControl.SafeHeight : TVShell.DeviceControl.ScreenHeight;;
// Panel Sizes
var STATUS_HEIGHT	=  36;
var LARGE_PANEL_HEIGHT	=  340;
var FIND_PANEL_HEIGHT = 157;
var PRINTSETTINGS_PANEL_HEIGHT =340;

// Dialogs based on CSS\Dialog.css
var LARGE_DIALOG_WIDTH = 400;
var LARGE_DIALOG_HEIGHT = 270;

// Panel.State
var PanelState_Showing	= 0;
var PanelState_Rising	= 1;
var PanelState_Lowering	= 2;
var PanelState_Hidden	= 3;

var COORDS_ABSOLUTE_FROM_TOPLEFT = 0;
var COORDS_ABSOLUTE_FROM_BOTTOMRIGHT = 1;
var COORDS_ABSOLUTE_FROM_CENTER = 2;
function coordTypeToString(c)
{
	if ( c == COORDS_ABSOLUTE_FROM_TOPLEFT)
		return "TOPLEFT";
	else if ( c == COORDS_ABSOLUTE_FROM_BOTTOMRIGHT)
		return "BOTTOMRIGHT";
	else if ( c == COORDS_ABSOLUTE_FROM_CENTER )
		return "CENTER";
	else
		return "UNKNOWN(" + c + ")";
}

function rectToString(r)
{
	if ( r == null)
		return "null";
	return "[ leftCoord=" + coordTypeToString(r.leftCoord) + " " + r.left
	+ ", topCoord=" + coordTypeToString(r.topCoord) + " " + r.top
	+ ", rightCoord=" + coordTypeToString(r.rightCoord) + " " + r.right
	+ ", bottomCoord=" + coordTypeToString(r.bottomCoord) + " " + r.bottom
	+ "]";
}
// Rectangle constructors
function FullRectangle(leftMargin, rightMargin, topMargin, bottomMargin)
{
    this.leftCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.left = leftMargin;

    this.rightCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
    this.right = rightMargin;

    this.topCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.top = topMargin;

    this.bottomCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
    this.bottom = bottomMargin;
}

function CenteredRectangle(width, height)
{
    this.rightCoord = COORDS_ABSOLUTE_FROM_CENTER;
    this.right = width/2;

    this.leftCoord = COORDS_ABSOLUTE_FROM_CENTER;
    this.left = this.right - width;

    this.bottomCoord = COORDS_ABSOLUTE_FROM_CENTER;
    this.bottom = height/2;

    this.topCoord = COORDS_ABSOLUTE_FROM_CENTER;
    this.top = this.bottom - height;
}

function BottomRectangle(height, bottomMargin)
{
	if (IsMSNTVScalingEnabled())
	{
		var z = GetMSNTVScale();
		var h = height * z;
		var bm = bottomMargin * z;

	    this.leftCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
	    this.left = 0;

	    this.rightCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.right = 0;

	    this.topCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.top = h + bm;

	    this.bottomCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.bottom = bm;
	}
	else
	{
	    this.leftCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
	    this.left = 0;

	    this.rightCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.right = 0;

	    this.topCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.top = height + bottomMargin;

	    this.bottomCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
	    this.bottom = bottomMargin;
	}
}

function AbsoluteHeightBottomRectangle(height, bottomMargin)
{
    this.leftCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.left = 0;

    this.rightCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
    this.right = 0;

    this.topCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
    this.top = height + bottomMargin;

    this.bottomCoord = COORDS_ABSOLUTE_FROM_BOTTOMRIGHT;
    this.bottom = bottomMargin;
}

function AbsolutePositionRectangle(left, top, width, height)
{
    this.leftCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.left = left;

    this.rightCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.right = left + width;

    this.topCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.top = top;

    this.bottomCoord = COORDS_ABSOLUTE_FROM_TOPLEFT;
    this.bottom = top + height;
}

function Step(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

// Panel constructor
function Panel(name, URL, type, transition, z_order, historySize, destroyBrowserOnHide)
{
    this.name = name;
    this.URL = URL;
    this.type = type;
    this.transition = transition;
    this.start = new BottomRectangle(0,0);
    this.end = null;
    this.step = null;
    this.showTime = 0;
    this.z_order = z_order;
    this.selectable = true;
    this.refreshenabled = false;
    this.modal = false;
    this.transitionsoundenabled = true;
    this.historySize=historySize;
    this.destroyBrowserOnHide=destroyBrowserOnHide;
}

function SetStartRect( panel, rect )
{
    panel.StartRect(rect.leftCoord,   rect.left,
                    rect.topCoord,    rect.top,
                    rect.rightCoord,  rect.right,
                    rect.bottomCoord, rect.bottom);
}

function SetEndRect( panel, rect )
{
    panel.EndRect(rect.leftCoord,   rect.left,
                  rect.topCoord,    rect.top,
                  rect.rightCoord,  rect.right,
                  rect.bottomCoord, rect.bottom);
}

function  AddPanel(PanelManager, panel)
{
    var ipl;
    var result;

    //TVShell.Message("Panels.js::AddPanel("+panel.name+")");

    result = PanelManager.CreatePanel(panel.name, panel.URL, panel.z_order, panel.destroyBrowserOnHide);

    if(result==false)
       return null;

    ipl = PanelManager.Item(panel.name);
    ipl.History.RecentSize = panel.historySize;

    if (panel.step != null) {
          ipl.StepX=panel.step.x;
          ipl.StepY=panel.step.y;
          ipl.StepWidth=panel.step.width;
          ipl.StepHeight=panel.step.height;
    }
    if (panel.showTime > 0)
        ipl.ShowTime=panel.showTime;

    ipl.PanelType = panel.type;
    ipl.Transition = panel.transition;
try {
    ipl.StartRect(panel.start.leftCoord,   panel.start.left,
                  panel.start.topCoord,    panel.start.top,
                  panel.start.rightCoord,  panel.start.right,
                  panel.start.bottomCoord, panel.start.bottom);
} catch (ex) {
alert( "AddPanel(PanelManager, " + panel.name + "):ipl.StartRect() " + ex + " " + ex.description );
}

    if (panel.end != null) {
try{
        ipl.EndRect(panel.end.leftCoord,   panel.end.left,
                    panel.end.topCoord,    panel.end.top,
                    panel.end.rightCoord,  panel.end.right,
                    panel.end.bottomCoord, panel.end.bottom);
} catch (ex) {
alert( "AddPanel(PanelManager, " + panel.name + "):ipl.EndRect() " + ex + " " + ex.description );
}
    }

    ipl.Selectable = panel.selectable;
    ipl.RefreshEnabled = panel.refreshenabled;
	ipl.Modal = panel.modal;
	ipl.TransitionSoundEnabled = panel.transitionsoundenabled;
 
    return ipl;
}

function SetPanelAccelEx(list, panel, name, type, code, msg)
{
	var ServiceEntry;

	//TVShell.Message("SetPanelAccelEx("+name+", "+code+", "+msg+")");

	ServiceEntry = list.Item("panel::"+name);
	if (ServiceEntry == null) {
		ServiceEntry = list.Add("panel::"+name);
		ServiceEntry.Panel = panel;
		ServiceEntry.Message = msg;
	}

	if (type & FCONTROL)
		ServiceEntry.CharCode = code & 0x1F;
	else
	if (type & FALT)
		ServiceEntry.SysCharCode = code;
	else
		ServiceEntry.KeyCode = code;
}

function SetPanelAccel(name, type, code)
{
	SetPanelAccelEx(TVShell.BuiltinServiceList, name, name, type, code, "");
}

function SetUserPanelAccel(name, type, code)
{
	var CurrentUser = TVShell.UserManager.CurrentUser;

	if (CurrentUser)
		SetPanelAccelEx(CurrentUser.ServiceList, name, name, type, code, "");
}

function SetUserPanelAccelEx(panel, name, type, code, msg)
{
	var CurrentUser = TVShell.UserManager.CurrentUser;

	if (CurrentUser)
		SetPanelAccelEx(CurrentUser.ServiceList, panel, name, type, code, msg);
}

function SwitchPanelAccel(list, panel, name)
{
	var ServiceEntry = list.Item("panel::"+name);
	if (ServiceEntry) {
//		TVShell.Message("SwitchPanelAccelEx: switching ServiceEntry(" + name + ") from " + ServiceEntry.Panel + " to " + panel);
		ServiceEntry.Panel = panel;
	}
}

function SwitchUserPanelAccel(panel, name)
{
	var CurrentUser = TVShell.UserManager.CurrentUser;

	if (CurrentUser)
		SwitchPanelAccel(CurrentUser.ServiceList, panel, name);
}

