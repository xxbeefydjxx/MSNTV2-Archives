var S_OK = 0;

var SuccessCode = new Array()
var ErrorCode = new Array();

SuccessCode[0x00]="S_OK"
SuccessCode[0x02]="PPCRL_AUTHSTATE_S_AUTHENTICATED_OFFLINE"
SuccessCode[0x03]="PPCRL_AUTHSTATE_S_AUTHENTICATED_PASSWORD"
SuccessCode[0x47]="PPCRL_REQUEST_S_IO_PENDING"

ErrorCode[0x00]="PPCRL_AUTHSTATE_E_UNAUTHENTICATED"
ErrorCode[0x01]="PPCRL_AUTHSTATE_E_EXPIRED"
ErrorCode[0x20]="PPCRL_REQUEST_E_AUTH_SERVER_ERROR"
ErrorCode[0x21]="PPCRL_REQUEST_E_BAD_MEMBER_NAME_OR_PASSWORD"
ErrorCode[0x23]="PPCRL_REQUEST_E_PASSWORD_LOCKED_OUT"
ErrorCode[0x24]="PPCRL_REQUEST_E_PASSWORD_LOCKED_OUT_BAD_PASSWORD_OR_HIP"


ErrorCode[0x27]="PPCRL_REQUEST_E_FORCE_CHANGE_PASSWORD_REQUIRED"
ErrorCode[0x28]="PPCRL_REQUEST_E_STRONG_PASSWORD_REQUIRED"
ErrorCode[0x2A]="PPCRL_REQUEST_E_PARTNER_NOT_FOUND"
ErrorCode[0x2B]="PPCRL_REQUEST_E_PARTNER_HAS_NO_ASYMMETRIC_KEY"
ErrorCode[0x2C]="PPCRL_REQUEST_E_INVALID_POLICY"
ErrorCode[0x2D]="PPCRL_REQUEST_E_INVALID_MEMBER_NAME"
ErrorCode[0x2F]="PPCRL_REQUEST_E_PENDING_NETWORK_REQUEST"
ErrorCode[0x31]="PPCRL_REQUEST_E_PASSWORD_EXPIRED"
ErrorCode[0x36]="PPCRL_REQUEST_E_EMAIL_VALIDATION_REQUIRED"
ErrorCode[0x37]="PPCRL_REQUEST_E_PARTNER_NEED_STRONGPW"
ErrorCode[0x38]="PPCRL_REQUEST_E_PARTNER_NEED_STRONGPW_EXPIRY"

//Login server sends this request status when DA ticket is expired, apps should use this request
// status to determine if the ticket is expired.
ErrorCode[0x39]="PPCRL_REQUEST_E_AUTH_EXPIRED"
ErrorCode[0x48]="PPCRL_REQUEST_E_NO_NETWORK"
ErrorCode[0x49]="PPCRL_REQUEST_E_UNKNOWN"

//  indicate the client needs to re-post to another STS
//  STS url should be part of the response
ErrorCode[0x52]="PPCRL_REQUEST_E_WRONG_DA"
ErrorCode[0x53]="PPCRL_REQUEST_E_KID_HAS_NO_CONSENT"
ErrorCode[0x54]="PPCRL_REQUEST_E_RSTR_MISSING_REFERENCE_URI"

ErrorCode[0x62]="PPCRL_E_UNABLE_TO_RETRIEVE_SERVICE_TOKEN"
ErrorCode[0x69]="PPCRL_E_AUTH_SERVICE_UNAVAILABLE"
ErrorCode[0x82]="PPCRL_E_BUSY"
ErrorCode[0x0c]="PPCRL_NO_SUCH_HANDLE"

var serviceArgs = new Array()



var ProductionArgs = new Array("favorites.live.com", "?id=66867",  0,  0, 
							   "messenger.msn.com", "?id=507",  0,  0,
							   "spaces.msn.com", "?id=45930",  0,  0,
							   "chat.msn.com", "?id=2260",  0,  0
							  );

var PPEArgs = new Array("favorites.live-ppe.com", "?id=66867", 0, 0,
						"messenger.msn-ppe.com", "?id=507",  0,  0,
						"spaces.msn-ppe.com", "?id=45930",  0,  0,  // place holer, currently there is no spaces ppe env
						"chat.msn-ppe.com", "?id=2260",  0,  0
  					   );
var INTArgs = new Array("favorites.live-int.com", "?id=61317", 0, 0,
						"messenger.msn-int.com", "?id=730",  0,  0,
						"spaces.msn-int.com", "?id=45158",  0,  0,
						"chat.msn-int.com", "?id=3026",  0,  0
	                   );

serviceArgs[0]=ProductionArgs;
serviceArgs[1]=PPEArgs;
serviceArgs[2]=INTArgs;

function GetServiceFlavorFromEmail(email)
{
   var service= email.substr(email.indexOf("@")+1).toLowerCase();
   if(service.indexOf("testdrive")>=0 || service.indexOf("-ppe")>=0)
		return 1;
   else if(service.indexOf("-int")>=0)
        return 2;
   else
        return 0;
}



function GetResultCode(result)
{
	TVShell.Message("raw result code :"+result);
	if(result&0x80000000)
	{
		result = (result&0xFF)
		return ErrorCode[result]
	}
	else
	{
		result = (result&0xFF)
		return SuccessCode[result]
	}
}




function DoIDCRLLogin(user)
{
/*   var email = user.EMail;
   var serviceflavor=GetServiceFlavorFromEmail(email);
 
   //Add messenger target to service entry. This entry eventually should be from service
   var entry = user.ServiceList.Add("messenger::ServiceTarget");
   entry.URL = serviceArgs[serviceflavor][4];
 
    //Add chat target to service entry. This entry eventually should be from service
   var entry = user.ServiceList.Add("chat::ServiceTarget");
   entry.URL = serviceArgs[serviceflavor][12];
   entry.Description = serviceArgs[serviceflavor][13];

   TVShell.LoginManager.IDCRLInitialize(serviceflavor);
   TVShell.LoginManager.IDCRLLogonAndAuthToServices(serviceArgs[serviceflavor],0)
 */

}

