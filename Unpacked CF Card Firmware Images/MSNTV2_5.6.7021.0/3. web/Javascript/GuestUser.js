// GuestUser.js
// Note: Must first include TVShell.js

var UserManager = TVShell.UserManager;

function InitializeGuestMode() {
	// Create the GuestMode property if it doesn't already exist.
	// This should only be called by config.html.

	var PersistentProperties = TVShell.Property("Persistent/");

	if (!PersistentProperties) {
		return;
	}

	if (!PersistentProperties("GuestMode")) {
		PersistentProperties.Add("GuestMode", "NoGuest");
		PersistentProperties.Save();
	}
}

function SwitchToWholesaleGuestMode()
{
	var PersistentProperties = TVShell.Property("Persistent/");

	if (!PersistentProperties) {
		return;
	}

	PersistentProperties.Add("GuestMode", "WholesaleGuest");
	PersistentProperties.Save();
}

function InWholesaleGuestMode() {
	// login displays the primary user as well as a guest login

	var PersistentProperties = TVShell.Property("Persistent/");
	var GuestMode = PersistentProperties?PersistentProperties("GuestMode"): null;

	return GuestMode && "WholesaleGuest" == GuestMode;
}

function InOnlyGuestMode() {
	// login displays only the guest login

	var PersistentProperties = TVShell.Property("Persistent/");
	var GuestMode = PersistentProperties?PersistentProperties("GuestMode"): null;

	return GuestMode && "OnlyGuest" == GuestMode;
}

function InHomeGuestMode() {
	// login displays the primary and secondary users as well as a guest login

	var PersistentProperties = TVShell.Property("Persistent/");
	var GuestMode = PersistentProperties?PersistentProperties("GuestMode"): null;

	return GuestMode && "Guest" == GuestMode;
}

function InNoGuestMode() {
	// Login displays the primary and secondary users and no guest.  This is the original mode.

	var PersistentProperties = TVShell.Property("Persistent/");
	var GuestMode = PersistentProperties?PersistentProperties("GuestMode"): null;

	return !GuestMode || "NoGuest" == GuestMode;
}

function InWholesaleGuestModes() {
	// Login displays only a guest login or login displays the primary user as well as a guest login.
	// Logically the same as InWholesaleGuestMode() || InOnlyGuestMode() .

	var PersistentProperties = TVShell.Property("Persistent/");
	var GuestMode = PersistentProperties?PersistentProperties("GuestMode"): null;

	return GuestMode && ("OnlyGuest" == GuestMode || "WholesaleGuest" == GuestMode);
}

function GuestUserExists()
{
	for (var i=0; i<UserManager.Count; i++) {
		var user = UserManager.Item(i);

		if (user.getAttribute("GuestUser")) {
			return true;
		}
	}

	return false;
}

function GuestUserIndex()
{
	for (var i=0; i<UserManager.Count; i++) {
		var user = UserManager.Item(i);

		if (user.getAttribute("GuestUser")) {
			return i;
		}
	}

	return -1;
}

function AddGuestUser()
{
	var user = UserManager.AddNew("Guest");

	if (user) {
		user.IsPersistent = false;
		user.setAttribute("GuestUser", true);
	} else {
		user = UserManager.Item("Guest");

		if (user && user.IsPersistent) {
			user.IsPersistent = false;
			user.setAttribute("GuestUser", true);
		}
	}

	if (user) {
		user.LargeIcon = "msntv:/tvshell/images/guest_transparent.png";
		user.SmallIcon = "msntv:/tvshell/images/guest_small.gif";
	}
}

function RemoveGuestUsers()
{
	var userIndex;
	var removedGuestUser = false;
	
	while ((userIndex = GuestUserIndex()) != -1) {
		UserManager.Remove(userIndex);
		removedGuestUser = true;
	}

	if (removedGuestUser && UserManager.Count) {
		UserManager.CurrentUser = 0;
	}
}

function IsGuestUser(user) {
	return user.getAttribute("GuestUser");
}
