//
// Provisioning.js
//

function canAccessOfflineApp()
{
	var UserManager = TVShell.UserManager;

	if (UserManager.CurrentUser && UserManager.CurrentUser.IsAuthorized) {
		return true;
	}

	if (TVShell.DeviceControl.ClockSet == false || UserManager.LastLoginTime == 0) {	
		if (UserManager.OfflineAppAccessTimes >= UserManager.OfflineAppMaxAccessTimes)
			return false;
		else {
			UserManager.OfflineAppAccessTimes = UserManager.OfflineAppAccessTimes + 1;
			UserManager.Save();
			return true;
		}
	}
	else {
		var dt = new Date();
		var currentTime = dt.getTime() / 1000 + dt.getTimezoneOffset() * 60;
		if ((currentTime - UserManager.LastLoginTime) > UserManager.OfflineAppMaxAccessDays * 24 * 3600)
			return false;
		
		if (UserManager.OfflineAppAccessTimes >= UserManager.OfflineAppMaxAccessTimes)
			return false;
		else {
			UserManager.OfflineAppAccessTimes = UserManager.OfflineAppAccessTimes + 1;
			UserManager.Save();
			return true;
		}
	}
}

function NotProvisionedMessageBox()
{
	TVShell.PanelManager.CustomMessageBox("Please sign in to verify your account status and enable access to offline content.", "Offline content not available", "OK", 0, "");
}
