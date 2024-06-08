
function MatchFriendlyName(friendlyName)
{
	if(friendlyName==null)
		return friendlyName;
	var index=friendlyName.indexOf('@hotmail.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@webtv.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@msn.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@passport.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@microsoft.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@hotmail-int.com');
	if(index>0)
		return friendlyName.substr(0,index);
	index=friendlyName.indexOf('@msn-int.com');
	if(index>0)
		return friendlyName.substr(0,index);
	return friendlyName;
}