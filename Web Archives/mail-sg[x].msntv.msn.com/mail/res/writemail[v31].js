function EscapeHtml(input)
{
	if (input != null && input.length > 0)
	{
		input = input.replace(/&/g, "&amp;");
		input = input.replace(/</g, "&lt;");
		input = input.replace(/>/g, "&gt;");
	}
	return input;
}

function DisplayHeaderTabImage(show)
{
	var tab = document.getElementById("highlight");
	if (tab != null)
	{
		if (show) tab.style.display = "inline";
		else tab.style.display = "none";
	}
}

function FocusWriteMailById(elementId)
{
	var element = writeframe.document.getElementById(elementId);
	if (element != null) element.focus();
}

var DraftHasBeenSaved = true;
function IsDraftSaved()
{
	return DraftHasBeenSaved;
}
function MarkDraftSaved()
{
	DraftHasBeenSaved = true;
}
function MarkDraftDirty()
{
	DraftHasBeenSaved = false;
}

var ShowSaveDraftAlert = true;
function HideSaveDraftAlert()
{
	ShowSaveDraftAlert = false;
}

function AlertLostDraft()
{
	if (ShowSaveDraftAlert && (!IsDraftSaved()))
	{
		event.returnValue = lostdrafttext;
	}
}

var httpPostObject = null;
var httpPostResult = null;

function OnHttpPostComplete()
{
	if (httpPostObject.readyState == 4)
	{
		httpPostResult = httpPostObject.responseText;
		httpPostObject = null;
	}
}

function PostWriteForm(posturl)
{
	httpPostResult = null;
	var postdata = GetFormPostData("writemail", "writeframe");
	httpPostObject = new ActiveXObject("Microsoft.XMLHTTP");
	httpPostObject.Open("POST", posturl);
	httpPostObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	httpPostObject.onreadystatechange = OnHttpPostComplete;
	httpPostObject.send(postdata);
}

function ShowErrors(defaultError)
{
	if (httpPostResult == null || httpPostResult.length == 0)
	{
		httpPostResult = defaultError;
	}
	else
	{
		var firstChar = httpPostResult.charAt(0);
		if (firstChar < 'A' || (firstChar > 'Z' && firstChar < 'a') || firstChar > 'z')
		{
			httpPostResult = defaultError;
		}
	}
	MailWarning(httpPostResult, null);
}

function ExitWriteMail(destination)
{
	if (destination == "photoviewer")
	{
		if (photoxmlurl == "") parent.window.location = "listmail.aspx";
		else PhotoControl.LaunchPhotoViewer(photoxmlurl, 0);
	}
	else if (destination != null && destination.length > 0)
	{
		parent.window.location = destination;
	}
	else
	{
		var ru = document.all.ru.value;
		if (ru != null && ru.length > 0)
		{
			history.go(ru);
			parent.window.location = ru;
		}
		else history.back();
	}
}

function AlertDraft(destination)
{
	if (IsDraftSaved())
	{
		ExitWriteMail(destination);
	}
	else
	{
		var msg = alertdrafttext;
		if (GetPhotoCount() > 0) msg += "<br><br>" + notsavephotoalert;
		var answer = 0;
		if (msg.length < 130) answer = window.external.MessageBox(msg, "", alertdraftbuttons, 0, 0x30, 1);
		else answer = window.external.MessageBox(msg, "", alertdraftbuttons, 0, 0x30, 0);
		if (answer == 0)
		{
			saveDraftDoneUrl = destination;
			if (spellcheckpannel.style.display != "none" && spellcheckpannel.style.visibility != "hidden") SaveSpellChange();
			SaveDraftAndGo();
		}
		else if (answer == 1)
		{
			ShowSaveDraftAlert = false;
			ExitWriteMail(destination);
		}
		else
		{
			ShowSaveDraftAlert = true;
		}
	}
}

var saveDraftDoneUrl = null;
function CheckSaveAndGo()
{
	if (httpPostResult == null)
	{
		window.setTimeout(CheckSaveAndGo, 500);
	}
	else
	{
		if (httpPostResult != "OK")
		{
			ShowErrors(failuploaddrafttext);
		}
		else
		{
			ExitWriteMail(saveDraftDoneUrl);
		}
	}
}

function ShowSaveDraftAnimation()
{
	ShowSaveDraftCTag();
	ShowAnimation("Saving draft...", "msntv:/Panels/Images/MailSaveDraft.gif", "", 2000);
}

function SaveDraftOnly()
{
	MarkDraftSaved();
	PostWriteForm("writemail.aspx?action=save");
	ShowSaveDraftAnimation();
}

function SaveDraftAndGo()
{
	MarkDraftSaved();
	PostWriteForm("writemail.aspx?action=save");
	window.setTimeout(CheckSaveAndGo, 2000);
	ShowSaveDraftAnimation();
}

function SaveDraft()  // used by "Save as Draft" button
{
	if (!ValidateAddresses()) return;
	if (GetPhotoCount() > 0 && !MailConfirm(notsavephotoalert)) return;
	SaveDraftAndGo();
}

function GetPhotoCount()
{
	if (navigator.userAgent.indexOf("STB") == -1) return 0;
	var count = 0;
	var filelist = document.all.PhotoControl.GetSelection();
	if (filelist != null)
	{
		var files = filelist.split("\n");
		count = Math.floor(files.length / 2);
	}
	return count;
}

function LaunchPhotoPicker()
{
	document.all.PhotoControl.LaunchPhotoPicker('mail:AddAttachments');
}

function ShowSendAnimation()
{
	sendmailanimationpannel.style.pixelHeight = document.body.clientHeight - 106;
	sendmailanimation.src = "/mail/res/MailSent2.gif";
	sendmailanimation.style.display = "inline";
	pickcontactpanel.style.display = "none";
	writemailpanel.style.display = "none";
	sendmailanimationsound.src = "msntv:/windows/Email_Sent.wav";
}

function DismissSendAnimation()
{
	pickcontactpanel.style.display = "inline";
	writemailpanel.style.display = "inline";
	sendmailanimation.style.display = "none";
	sendmailanimation.src = "msntv:/blk.jpg";
}

function CheckSendAndGo()
{
	if (httpPostResult == null)
	{
		window.setTimeout(CheckSendAndGo, 500);
	}
	else
	{
		if (httpPostResult == "OK")
		{
			MarkDraftSaved();
			ExitWriteMail();
		}
		else
		{
			DismissSendAnimation();
			ShowErrors(failsendmailtext);
		}
	}
}

function SendMail()
{
	if (IsToNotEmpty() && ValidateAddresses())
	{
		MarkDraftSaved();
		sendmailresult = null;
		if (GetPhotoCount() > 0)
		{
			var token = GetFormPostData("writemail", "writeframe");
			document.all.PhotoControl.UploadToMail(token);
		}
		else
		{
			ShowSendAnimation();
			PostWriteForm("writemail.aspx?action=send");
			window.setTimeout(CheckSendAndGo, 3000);
			ShowSendMailCTag();
		}
	}
}

function SendPhotoMail()
{
	httpPostResult = window.event.response;
	if (httpPostResult == "OK")
	{
		ShowSendAnimation();
		window.setTimeout(CheckSendAndGo, 3000);
		ShowSendPhotoMailCTag();
	}
	else
	{
		ShowErrors(failuploadphototext);
	}
}

var lockKeyboard = false;
var httpSpellObject = null;

function CheckSpell()
{
	var oForm = writeframe.document.forms["writemail"];
	if (oForm != null)
	{
		var data = "check=" + encodeURIComponent(oForm["msgbody"].value);
		httpSpellObject = new ActiveXObject("Microsoft.XMLHTTP");
		httpSpellObject.Open("POST", "spell.aspx");
		httpSpellObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpSpellObject.onreadystatechange = onSpellComplete;
		httpSpellObject.send(data);
	}
}

function onDictionaryAddComplete()
{
	if (httpSpellObject.readyState == 4)
	{
		var responseMsg = httpSpellObject.responseText;
		if (responseMsg != "OK")
		{
			MailError(responseMsg, null);
		}
		AddWordStep2();
		httpSpellObject = null;
	}
}

function onDictionaryRemoveComplete()
{
	if (httpSpellObject.readyState == 4)
	{
		var responseMsg = httpSpellObject.responseText;
		if (responseMsg != "OK")
		{
			MailError(responseMsg, null);
		}
		NextSpellCheck(false);
		httpSpellObject = null;
	}
}

function AddToDictionary(word)
{
	if (word != null && word.length > 0)
	{
		var data = "add=" + encodeURIComponent(word);
		httpSpellObject = new ActiveXObject("Microsoft.XMLHTTP");
		httpSpellObject.Open("POST", "spell.aspx");
		httpSpellObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpSpellObject.onreadystatechange = onDictionaryAddComplete;
		httpSpellObject.send(data);
		ShowAnimation("Adding <b>" + word + "</b> to dictionary", "msntv:/Panels/Images/TaskCompleted.gif", "", 4000);
	}
}

function RemoveFromDictionary(word)
{
	if (word != null && word.length > 0)
	{
		var data = "delete=" + encodeURIComponent(word);
		httpSpellObject = new ActiveXObject("Microsoft.XMLHTTP");
		httpSpellObject.Open("POST", "spell.aspx");
		httpSpellObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpSpellObject.onreadystatechange = onDictionaryRemoveComplete;
		httpSpellObject.send(data);
		ShowAnimation("Removing <b>" + word + "</b> from dictionary", "msntv:/Panels/Images/TaskCompleted.gif", "", 4000);
	}
}

var wordsListOrginal = null;
var wordsListChanged = null;
var wordsListChecked = null;
var currentPosition = 0;
var totalSuggestion = 0;

function onSpellComplete()
{
	if (httpSpellObject.readyState == 4)
	{
		wordsListChecked = httpSpellObject.responseText.split(/\n/g);
		if (wordsListChecked[0] == "0")
		{
			MailInfo("Spellcheck is complete. No errors were found.", null);
		}
		else if (wordsListChecked[0] == "-1")
		{
			MailError(wordsListChecked[1], null);
		}
		else
		{
			var result = "";
			currentPosition = 0;
			wordsListOrginal = new Array(wordsListChecked.length);
			wordsListChanged = new Array(wordsListChecked.length);
			for (var i=1; i<wordsListChecked.length; i++)
			{
				var suggs = wordsListChecked[i].split(/\t/g);
				wordsListOrginal[i] = wordsListChanged[i] = suggs[0];
			}
			NextSpellCheck(true);
			title.innerText = spellTitle;
			DisplayHeaderTabImage(false);
		}
		httpSpellObject = null;
	}
}

function NextSpellCheck(needfocus)
{
	lockKeyboard = false;
	if (wordsListChecked == null) return;

	while (++currentPosition < wordsListChecked.length)
	{
		var suggs = wordsListChecked[currentPosition].split(/\t/g);
		if (suggs.length > 1 && wordsListOrginal[currentPosition] == wordsListChanged[currentPosition])
		{
			var start = currentPosition - 6;
			if (start < 1) start = 1;
			var end = start + 14;
			if (end > wordsListChecked.length) end = wordsListChecked.length;
			var text = "";
			while (start < currentPosition) text += EscapeHtml(wordsListChanged[start++]);
			text += ("<span id=misword>" + EscapeHtml(wordsListChanged[currentPosition]) + "</span>");
			start = currentPosition + 1;
			while (start < end) text += EscapeHtml(wordsListChanged[start++]);
			paragraph.innerHTML = text;

			var html = "";
			var j = 1;
			totalSuggestion = 0;
			while (j < suggs.length && suggs[j] != " ")
			{
				 html += "<span id=sugg" + totalSuggestion + " style='padding-left:6px;width:100%;height:22px' onclick='word.value=this.innerText;HighLightSuggestion();change.focus();'>" + suggs[j++] + "</span>";
				 totalSuggestion++;
			}
			if (totalSuggestion == 0)
			{
				html = "<span style='padding-left:6px;width:100%;height:22px'>(No spelling suggestions)</span>";
			}
			suggestion.innerHTML = html;
			
			if (totalSuggestion > 0)
			{
				word.value = suggs[1];
				HighLightSuggestion();
			}
			else
			{
				word.value = "";
				needfocus = true;
			}

			writemailpanel.style.display = "none";
			spellcheckpannel.style.display = "inline";
			spellcheckpannel.style.visibility = "visible";
			if (needfocus) ignore.focus();
			break;
		}
	}
	if (currentPosition >= wordsListChecked.length) DoneSpell(false);
}

function HighLightSuggestion()
{
	if (totalSuggestion > 0)
	{
		var ndx = 0;
		while (ndx < totalSuggestion)
		{
			var sugg = document.getElementById("sugg" + ndx);
			if (sugg != null)
			{
				if (sugg.innerText == word.value)
				{
					sugg.style.backgroundColor = "#bcdee5";
					sugg.style.fontWeight = "bolder";
				}
				else
				{
					sugg.style.backgroundColor = "";
					sugg.style.fontWeight = "normal";
				}
			}
			ndx++;
		}
	}
}

function IgnoreOnce()
{
	wordsListOrginal[currentPosition] = "*i";
	NextSpellCheck(false);
}

function IgnoreAll()
{
	var changefrom = wordsListOrginal[currentPosition];
	wordsListOrginal[currentPosition] = "*ia";
	for (var i=currentPosition+1; i<wordsListOrginal.length; i++)
	{
		if (wordsListOrginal[i] == changefrom)
		{
			wordsListOrginal[i] = "";
		}
	}
	NextSpellCheck(false);
}

function AddWord()
{
	var changefrom = wordsListOrginal[currentPosition];
	AddToDictionary(changefrom);
}

function AddWordStep2()
{
	var changefrom = wordsListOrginal[currentPosition];
	wordsListOrginal[currentPosition] = "*a";
	for (var i=currentPosition+1; i<wordsListOrginal.length; i++)
	{
		if (wordsListOrginal[i] == changefrom)
		{
			wordsListOrginal[i] = "";
		}
	}
	NextSpellCheck(false);
}

function ChangeOnce()
{
	if (lockKeyboard) return;
	if (word.value == "")
	{
		var msg = "Do you want to delete <b>" + wordsListOrginal[currentPosition] + "</b>?"
				+ "<br><br>To remove <b>" + wordsListOrginal[currentPosition] 
				+ "</b> from your message, choose <b>Delete</b>."
		var answer = window.external.MessageBox(msg, "", "Delete;Try Again", 0, 0x30, 1);
		if (answer == 1) return;
	}
	wordsListOrginal[currentPosition] = "*c";
	wordsListChanged[currentPosition] = word.value;
	misword.innerText = word.value;
	lockKeyboard = true;
	MarkDraftDirty();
	window.setTimeout("NextSpellCheck(false)", 1000);
}

function ChangeAll()
{
	if (lockKeyboard) return;
	if (word.value == "")
	{
		var msg = "Do you want to delete <b>" + wordsListOrginal[currentPosition] + "</b>?"
				+ "<br><br>To remove <b>" + wordsListOrginal[currentPosition] 
				+ "</b> from your message, choose <b>Delete</b>."
		var answer = window.external.MessageBox(msg, "", "Delete;Try Again", 0, 0x30, 1);
		if (answer == 1) return;
	}
	var changeto = word.value;
	var changefrom = wordsListOrginal[currentPosition];
	wordsListOrginal[currentPosition] = "*ca";
	wordsListChanged[currentPosition] = changeto;
	for (var i=currentPosition+1; i<wordsListOrginal.length; i++)
	{
		if (wordsListOrginal[i] == changefrom)
		{
			wordsListOrginal[i] = "";
			wordsListChanged[i] = changeto;
		}
	}
	misword.innerText = changeto;
	lockKeyboard = true;
	MarkDraftDirty();
	window.setTimeout("NextSpellCheck(false)", 1000);
}

function Undo()
{
	var suggs;
	while (--currentPosition > 0)
	{
		suggs = wordsListChecked[currentPosition].split(/\t/g);
		if (suggs.length > 1 && wordsListOrginal[currentPosition] != "") break;
	}
	var goNext = true;
	if (currentPosition > 0)
	{
		var ndx;
		switch (wordsListOrginal[currentPosition])
		{
			case "*i":  // undo ignore
				break;
			case "*a":  // undo add to dictionary - same as ignore all
				RemoveFromDictionary(suggs[0]);
				goNext = false;
			case "*ia": // undo ignore all
				for (ndx=currentPosition+1; ndx<wordsListChanged.length; ndx++)
				{
					if (wordsListChanged[ndx] == suggs[0])
					{
						wordsListOrginal[ndx] = suggs[0];
					}
				}
				break;
			case "*c":  // undo change
				wordsListChanged[currentPosition] = suggs[0];
				break;
			case "*ca": // undo change all
				wordsListChanged[currentPosition] = suggs[0];
				for (ndx=currentPosition+1; ndx<wordsListChecked.length; ndx++)
				{
					var suggs2 = wordsListChecked[ndx].split(/\t/g);
					if (suggs2.length > 1 && suggs2[0] == suggs[0])
					{
						wordsListOrginal[ndx] = suggs[0];
						wordsListChanged[ndx] = suggs[0];
					}
				}
				break;
		}
		wordsListOrginal[currentPosition] = suggs[0];
	}
	currentPosition--;
	if (currentPosition < 0) currentPosition = 0;
	if (goNext) NextSpellCheck(false);
}

function SaveSpellChange()
{
	var oForm = writeframe.document.forms["writemail"];
	oForm["msgbody"].value = wordsListChanged.join("");
}

function DoneSpell(showAlert)
{
	writemailpanel.style.display = "inline";
	spellcheckpannel.style.display = "none";
	SaveSpellChange();
	if (showAlert)
	{
		MailInfo("The changes you've made so far have been saved. <br><br>You can choose <b>Check Spelling</b> if you want to check the rest of your message.", null);
	}
	else
	{
		ShowTaskCompleteAnimation("Spellcheck complete");
	}
	title.innerText = writeTitle;
	DisplayHeaderTabImage(true);
	writeframe.document.all.msgbody.focus();
}

function GotoWrite()
{
	if (spellcheckpannel.style.display != "none" && spellcheckpannel.style.visibility != "hidden") DoneSpell(true);
	else if (pickcontactpanel.style.display != "none" && pickcontactpanel.style.visibility != "hidden") addrframe.DonePickContact(true);
}

function GotoAddress()
{
	if (spellcheckpannel.style.display != "none" && spellcheckpannel.style.visibility != "hidden")
	{
		DoneSpell(true);
		addrframe.PickContact();
	}
	else if (pickcontactpanel.style.display != "none" && pickcontactpanel.style.visibility != "hidden") AlertDraft('listaddr.aspx');
	else addrframe.PickContact();
}