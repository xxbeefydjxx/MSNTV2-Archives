var Mail_Field_Validation_OK = 0;
var Mail_Field_Validation_Empty = 1;
var Mail_Field_Validation_Invalid = 2;
var Mail_Field_Validation_NotExist = 3;

function ValidateFieldById(fieldId, regex, frameId)
{
    var oFrame = (frameId == null) ? window : document.frames[frameId];
	var field = oFrame.document.getElementById(fieldId);
	if (field == null) return Mail_Field_Validation_NotExist;

	var val = field.value;
	if (val == null) return Mail_Field_Validation_Empty;

	// get rid of leading and ending write space
	var trim = /^(\s)*|(\s)*$/g;
	val = val.replace(trim, "");
	if (val.length == 0) return Mail_Field_Validation_Empty;
	field.value = val;

	// regular expression test
	if (regex != null)
	{
		var exp = new RegExp(regex);
		if (!exp.test(val)) return Mail_Field_Validation_Invalid;
	}

	return Mail_Field_Validation_OK;
}

function GetFieldValueById(frameId, fieldId)
{
	var oFrame = window;
	if (frameId != null)
	{
		oFrame = window.document.frames[frameId];
	}
	if (oFrame != null)
	{
		var oDoc = oFrame.document;
		if (oDoc != null)
		{
			var field = oDoc.getElementById(fieldId);
			if (field != null) return field.value;
		}
	}
	return null;
}

function SetFieldValueById(fieldId, value)
{
	var field = document.getElementById(fieldId);
	if (field != null) field.value = value;
}

function ValidateInputFolderName(fieldId)
{
	// illegal folder name characters: & ( ) + \ : ; " ' < > / * | ?
	return ValidateFieldById(fieldId, "^[^&\\(\\)\\+\\\\:;\"'<>/\\*\\|\\?]*$");
}

function HasMultipleChecked(formId, type, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	var cnt = 0;
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == type && e.checked)
			{
				cnt++;
				if (cnt >= 2)
					return cnt;
			}
		}
	}
	return 0;
}

function HasChecked(formId, type, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == type && e.checked)
			{
				return true;
			}
		}
	}
	return false;
}

function IsChecked(checkId)
{
	return document.getElementById(checkId).checked;
}

function MarkAllCheckBox(frameId, formId, status)
{
	var oFrame = window;
	if (frameId != null) oFrame = window.document.frames[frameId];
	var oForm = oFrame.document.forms[formId]; 
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == 'checkbox' && e.checked != status) e.click();
		}
	}
}

function MarkAllVisibleCheckBox(frameId, formId, status, parentLevel)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == 'checkbox' && e.checked != status)
			{
				var parent = e;
				for(var i=0; i<parentLevel && parent != null; i++) parent = parent.parentElement;
				if (parent != null && parent.style.display != "none") e.click();
			}
		}
	}
}

function HasVisibleCheckBox(formId, parentLevel, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == 'checkbox')
			{
				var parent = e;
				for(var i=0; i<parentLevel && parent != null; i++) parent = parent.parentElement;
				if (parent != null && parent.style.display != "none") return true;
			}
		}
	}
	return false;
}

function ClearHideCheckedRow(formId, type, parentLevel, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == type && e.checked)
			{
				var parent = e;
				for(var i=0; i<parentLevel && parent != null; i++) parent = parent.parentElement;
				if (parent != null)
				{
					parent.style.display = "none";
					e.click();
				}
			}
		}
	}
}

function SetFirstRowBorder(formId, parentLevel, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		for (var index=0; index<oForm.length; index++)
		{
			var e = oForm.elements[index];
			if (e.type == 'checkbox')
			{
				var parent = e;
				for(var i=0; i<parentLevel && parent != null; i++) parent = parent.parentElement;
				if (parent != null && parent.style.display != "none")
				{
					parent.style.borderTop = "2px solid #97B7D3";
					break;
				}
			}
		}
	}
}

function C(me)
{
	var parent = me.parentElement;
	if (parent != null)
	{
		parent = parent.parentElement;
		if (parent != null)
		{
			var hasCheck = false;
			var node = parent.firstChild;
			while (node != null)
			{
				var childNode = node.firstChild;
				if (childNode != null && childNode.tagName == "INPUT" && childNode.type == "checkbox" && childNode.checked == true){hasCheck = true;break;}
				node = node.nextSibling;
			}
			var color = hasCheck ? "#bcdee5" : "";
			parent.style.backgroundColor = color;
		}
	}
}

function L(me)
{
	var parent = me.parentElement;
	for (var index=0; index<3; index++)
	{
		parent = parent.parentElement;
		if (parent == null) break;
	}
	if (parent != null)
	{
		parent.style.backgroundColor = me.checked ? "#bcdee5" : parent.style.color;
	}
}

function SubmitFormById(formId, formAction, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm != null)
	{
		if (formAction != null) oForm.action = formAction;
		oForm.submit();
	}
}

function FocusById(elementId, frameId)
{
    var oFrame = (frameId == null) ? window : document.frames[frameId];
    var element = oFrame.document.getElementById(elementId);
	if (element != null) element.focus();
}

function ShowCTag(image)
{
	var div = document.createElement("DIV");
	div.style.position = "absolute";
	div.style.top = "0px";
	div.style.left = "0px";
	div.style.zIndex = "-99";
	div.id = "animationpannel";
	div.innerHTML = image;
	document.body.appendChild(div);
}

function ShowAnimation(message, image, sound, time)
{
	if (navigator.userAgent.indexOf("STB") != -1)
	{
		window.external.AnimationMessageBox(message, image, sound, time);
	}
}

function ShowMoveAnimation(message)
{
	ShowAnimation(message, "msntv:/Panels/Images/MailMove.gif", "", 2000);
}

function ShowTaskCompleteAnimation(message)
{
	ShowAnimation(message, "msntv:/Panels/Images/TaskCompleted.gif", "", 2000);
}

function ShowBlockSenderAnimation(message)
{
	ShowAnimation(message, "msntv:/Panels/Images/TaskCompleted.gif", "Block", 2000);
}

function MailAlert(msg, iconType, focusId)
{
	if (navigator.userAgent.indexOf("STB") == -1)
	{
		alert(msg);
	}
	else
	{
		if (msg.length < 130) window.external.MessageBox(msg, "", "OK", 0, iconType, 1);
		else window.external.MessageBox(msg, "", "OK", 0, iconType, 0);
	}

	if (focusId != null && focusId.length > 0)
	{
		var obj = document.getElementById(focusId);
		if (obj != null) obj.focus();
	}
}
function MailInfo(msg, focusId) { MailAlert(msg, 0x40, focusId); }
function MailError(msg, focusId) { MailAlert(msg, 0x10, focusId); }
function MailWarning(msg, focusId) { MailAlert(msg, 0x30, focusId); }

function MailConfirm(msg)
{
	if (navigator.userAgent.indexOf("STB") == -1)
	{
		return confirm(msg);
	}
	else
	{
		var result = 0;
		if (msg.length < 130) result = window.external.MessageBox(msg, "", "OK;Cancel", 0, 0x30, 1);
		else result = window.external.MessageBox(msg, "", "OK;Cancel", 0, 0x30, 0);
		if (result == 0) return true;
		else return false;
	}
}

function GetFormPostData(formId, frameId)
{
	var oFrame = (frameId == null) ? window : document.frames[frameId];
	var oForm = oFrame.document.forms[formId];
	if (oForm == null) return null;
	var postdata = "";
	var isFirst = true;
	for (i=0; i<oForm.length; i++)
	{
		var e = oForm.elements[i];
		if ((e.type == 'text') || (e.type == 'hidden') ||
			(e.type == 'textarea') || (e.type == 'submit') ||
			(e.type == 'password') || (e.type == 'button') ||
			(e.type == 'checkbox' && e.checked) ||
			(e.type == 'radio' && e.checked))
		{
			var item = "";
			if (!isFirst) item = "&";
			else isFirst = false;
			item += encodeURIComponent(e.name);
			item += "=";
			item += encodeURIComponent(e.value);
			postdata += item; 
		}
	}
	return postdata;
}

function DoNothing() {}

function HttpGetAsync(httpGetObj, url, onGetComplete)
{
	if (onGetComplete == null) onGetComplete = DoNothing;
	httpGetObj.Open("GET", url);
	httpGetObj.onreadystatechange = onGetComplete;
	httpGetObj.send();
}

function HttpPostFormAsync(httpPostObj, formId, frameId, url, onPostComplete)
{
	// get form data
	var postdata = GetFormPostData(formId, frameId);
	if (onPostComplete == null) onPostComplete = DoNothing;

	// do asynchronize post
	httpPostObj.Open("POST", url);
	httpPostObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	httpPostObj.onreadystatechange = onPostComplete;
	httpPostObj.send(postdata);
}
