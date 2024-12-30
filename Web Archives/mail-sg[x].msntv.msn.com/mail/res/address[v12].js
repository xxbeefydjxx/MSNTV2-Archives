var idarray = null;
var qarray = null;
var earray = null;
var start = 0;
var end = 0;
var status;
var parentFocusId = null;

function Refresh()
{
	window.location.reload(true)
}

function CallFromWrite()
{
	if (status == "write") return;
	idarray = idarrayfull;
	qarray = qarrayfull;
	earray = earrayfull;
	status = "write";
	parentFocusId = parent.continu;
	Show();
}

function CallFromABook(page)
{
	idarray = new Array();
	qarray = new Array();
	earray = new Array();
	if (qarrayfull != null && qarrayfull.length > 0)
	{
		// filter group address
		for (var i=0; i<qarrayfull.length; i++)
		{
			if (earrayfull[i] != "Group")
			{
				idarray.push(idarrayfull[i]);
				qarray.push(qarrayfull[i]);
				earray.push(earrayfull[i]);
			}
		}
	}
	status = page;
	parentFocusId = parent.save;
	Show();
	if (qarray.length > 0) window.frameElement.style.height = window.parent.document.body.clientHeight - 76;
	else if (parent.frameinstruction != null) parent.frameinstruction.style.display = "none";
	window.frameElement.onblur = UpdateGroupEmail;
	PopulateAddressArray("to", true);
	UpdateCheckboxes("to");
}

function UpdateGroupEmail()
{
	UpdateSelections();
	var field = parent.document.getElementById("hto");
	if (field != null) field.value = NonEmptyJoin(toLongArray);
}

function ShowPrev()
{
	UpdateSelections();
	start -= maxPerPage;
	if (start < 0) start = 0;
	Show();
	UpdateCheckboxes("to");
	if (status == "write") UpdateCheckboxes("cc");
	if (start == 0)
	{
		var checkBox = document.getElementById("t0");
		if (checkBox != null) checkBox.focus();
	}
}

function ShowNext()
{
	UpdateSelections();
	start = end;
	Show();
	UpdateCheckboxes("to");
	if (status == "write") UpdateCheckboxes("cc");
	if (start + maxPerPage >= qarray.length)
	{
		var checkBox = document.getElementById("t" + start);
		if (checkBox != null) checkBox.focus();
	}
}

function ShowOnKeyPress()
{
	if (event.keyCode >= 48 && event.keyCode <= 122 && qarray != null && qarray.length > 0)
	{
		var inputKey = String.fromCharCode(event.keyCode).toLowerCase();
		for (var i=0; i<qarray.length; i++)
		{
			var qkn = qarray[i];
			if (qkn != null && qkn.length > 0)
			{
				if (inputKey == qkn.toLowerCase().substr(0, 1))
				{
					if (i < start || i >= start + maxPerPage)
					{
						UpdateSelections();
						start = i;
						Show();
						UpdateCheckboxes("to");
						if (status == "write") UpdateCheckboxes("cc");
					}
					var checkBox = document.getElementById("t" + i);
					if (checkBox != null) checkBox.focus();
					event.returnValue = false;
					event.cancelBubble = true;
					return false;
				}
			}
		}
	}
	return true;
}

function Show()
{
	end = start + maxPerPage;
	if (end > qarray.length) end = qarray.length;
	if (status == "write") ShowWriteMail();
	else ShowEditAddress();
	range.innerText = (start + 1) + " - " + end;
	if (start > 0 || end < qarray.length)
	{
		multipage.style.display = "inline";
		prev.onclick = ShowPrev;
		prev.disabled = start <= 0;
		
		next.onclick = ShowNext;
		next.disabled = end >= qarray.length
	}
	else
	{
		multipage.style.display = "none";
	}
}

function ShowWriteMail()
{
	selectionarea.innerHTML = "";
	editheader.style.display = "none";
	instruction.style.display = "inline";
	if (qarray.length > 0)
	{
		writeheader.style.display = "inline";
		var a = "<div class=r><div class=t><input type=checkbox id=t";
		var b = " onclick='C(this)'></div><div class=c><input type=checkbox id=c";
		var c = " onclick='C(this)'></div><div class=q><pre class=q>";
		var d = "</pre></div><div class=e><pre class=e>";
		var e = "</pre></div></div>";
		var v = " value=";
		var s = "<form id=pickcontact>";
		for (var i=start; i<end; i++) s += a + i + v + i + b + i + v + i + c + qarray[i] + d + earray[i] + e;
		s += "</form>";
		selectionarea.innerHTML = s;
	}
}

function ShowEditAddress()
{
	selectionarea.innerHTML = "";
	instruction.style.display = "none";
	writeheader.style.display = "none";
	if (status == "ABook") quickNameTextbox.style.display = "inline";
	else if (status == "EditGroup") editGroup.style.display = "inline";
	if (qarray.length > 0)
	{
		editheader.style.display = "inline";
		var a = "<div class=r><div class=x><input type=checkbox id=t";
		var c = " onclick='C(this)'></div><div class=y><pre class=y>";
		var d = "</pre></div><div class=z><pre class=z>";
		var e = "</pre></div></div>";
		var v = " value=";
		var s = "<form id=pickcontact>";
		for (var i=start; i<end; i++) s += a + i + v + i + c + qarray[i] + d + earray[i] + e;
		s += "</form>";
		selectionarea.innerHTML = s;
	}
}

var toShortArray = null;
var ccShortArray = null;
var toLongArray = null;
var ccLongArray = null;

function PopulateAddressArray(toOrCc, shortToo)
{
	var split = /[;,\n]/g;
	var trim = /^(\s)*|(\s)*$/g;
	var nocomment = /\([^<>]*\)/g;
	var shortArray = null;
	var longArray = null;
	var inputs = null;
	var obj = null;
	if (status == "write") obj = parent.writeframe.document.getElementById((toOrCc == "cc") ? "hcc" : "hto");
	else obj = parent.document.getElementById((toOrCc == "cc") ? "hcc" : "hto");
	if (obj != null) inputs = obj.value;
	if (inputs != null)
	{
		inputs = inputs.replace(trim, "");
		if (inputs.length > 0)
		{
			longArray = inputs.split(split);
			if (shortToo) shortArray = new Array(longArray.length);
			for (var i=0; i<longArray.length; i++)
			{
				longArray[i] = longArray[i].replace(trim, "");
				if (shortToo)
				{
					var address = longArray[i].replace(nocomment, "");
					var length = (address == null) ? 0 : address.lastIndexOf(">");
					if (length > 0)
					{
						var begin = address.lastIndexOf("<");
						if (begin > -1 && begin < length)
						{
							address = address.substring(begin+1, length);
							address = address.replace(trim, "");
						}
						else
						{
							address = "";
						}
					}
					shortArray[i] = address.toLowerCase();
				}
			}
		}
	}

	if (toOrCc == "cc")
	{
		ccShortArray = shortArray;
		ccLongArray = longArray;
	}
	else
	{
		toShortArray = shortArray;
		toLongArray = longArray;
	}
}

function UpdateCheckboxes(toOrCc)
{
	if (earray == null || earray.length == 0) return;
	
	var idPrefix = "t";
	var shortArray = toShortArray;
	var longArray = toLongArray;
	if (toOrCc == "cc")
	{
		idPrefix = "c";
		shortArray = ccShortArray;
		longArray = ccLongArray;
	}
	var hasEntry = (shortArray != null && shortArray.length > 0);

	for (var i=start; i<end; i++)
	{
		var quick = qarray[i].toLowerCase();
		var email = earray[i].toLowerCase();
		var checkbox = document.getElementById(idPrefix+i);
		if (checkbox != null)
		{
			if (hasEntry)
			{
				var found = false;
				for (var j=0; j<shortArray.length; j++)
				{
					if ((shortArray[j] == quick) || (shortArray[j] == email && shortArray[j] != "Group"))
					{
						if (!checkbox.checked) checkbox.click();
						found = true;
					}
				}
				if (!found && checkbox.checked) checkbox.click();
			}
			else if (checkbox.checked) checkbox.click();
		}
	}
}

function UpdateSelections()
{
	if (qarray.length <= 0) return;
	if (toShortArray == null)
	{
		toShortArray = new Array();
		toLongArray = new Array();
	}
	if (ccShortArray == null)
	{
		ccShortArray = new Array();
		ccLongArray = new Array();
	}
	toHistoryArray = new Array(toShortArray.length);
	ccHistoryArray = new Array(ccShortArray.length);

	var oForm = document.forms["pickcontact"]; 
	for (var i=0; i<oForm.length; i++)
	{
		// set To or Cc array
		var longArray = null;
		var shortArray = null;
		var historyArray = null;
		var e = oForm.elements[i];
		if (e.id.charAt(0) == 't') { longArray = toLongArray; shortArray = toShortArray; historyArray = toHistoryArray; }
		else if (e.id.charAt(0) == 'c') { longArray = ccLongArray; shortArray = ccShortArray; historyArray = ccHistoryArray; }
		else { continue; }

		// find the entry in the To or Cc list
		var ndx = e.value;
		var quick = qarray[ndx].toLowerCase();
		var email = earray[ndx].toLowerCase();
		var found = false;
		for (var j=0; j<shortArray.length; j++)
		{
			if (shortArray[j] == quick || (shortArray[j] == email && shortArray[j] != "Group"))
			{
				found = true;
				if (!e.checked && historyArray[j] != 1) // remove
				{
					shortArray[j] = "";
					longArray[j] = "";
					parent.MarkDraftDirty();
				}
				else
				{
					historyArray[j] = 1;
				}
			}
		}
		if (e.checked && !found) // add more
		{
			if (earray[ndx] == "Group" || status != "write")
			{
				shortArray.push(qarray[ndx]);
				longArray.push(qarray[ndx]);
			}
			else
			{
				shortArray.push(earray[ndx]);
				longArray.push(earray[ndx]);
			}
			historyArray.push(1);
			parent.MarkDraftDirty();
		}
	}
}

function PickContact()
{
	if (parent.pickcontactpanel.style.visibility == "visible") return;

	CallFromWrite();
	PopulateAddressArray("to", true);
	PopulateAddressArray("cc", true);

	UpdateCheckboxes("to");
	UpdateCheckboxes("cc");

	parent.pickcontactpanel.style.visibility = "visible";
	parent.writemailpanel.style.visibility = "hidden";
	parent.title.innerText = parent.addrsTitle;
	parent.DisplayHeaderTabImage(false);
	if (qarray.length > 0) parent.addrframe.focus();
	else window.setTimeout("parent.continu.focus()", 0);
}

function DonePickContact(action)
{
	if (parent.pickcontactpanel.style.display == "none" && parent.writemailpanel.style.display == "none") return;
	if (parent.writemailpanel.style.visibility != "hidden") return;

	if (action)
	{
		UpdateSelections();
		var field = parent.writeframe.document.getElementById("hto");
		if (field != null) field.value = NonEmptyJoin(toLongArray);
		field = parent.writeframe.document.getElementById("hcc");
		if (field != null) field.value = NonEmptyJoin(ccLongArray);
	}

	parent.writemailpanel.style.visibility = "visible";
	parent.writeframe.focus();
	parent.pickcontactpanel.style.visibility = "hidden";
	parent.title.innerText = parent.writeTitle;
	parent.DisplayHeaderTabImage(true);
	parent.ShowSaveDraftAlert = true;
}

function UpdateParentFields()
{
    var textboxField = parent.document.getElementById("hcc");
    var textbox;
    if (status == 'ABook') textbox = document.getElementById("textBox");
    else if (status == 'EditGroup') textbox = document.getElementById("EGtextbox");
	if (textboxField != null && textbox != null) textboxField.value = textbox.value;
	
	if (status == 'EditGroup')
	{
	    var parent_quickname = parent.document.getElementById("quickname");
	    var quickname = document.getElementById("quickname");
	    if (parent_quickname != null && quickname != null) parent_quickname.value = quickname.value;
	}
	
}

// return ",,," if it is empty
// return null if all valid
// return string if it is invalid
function CheckAddress(id)
{
	// treat empty entry as valid one
	var addrs = null;
	if (id == "hto")
	{
		toLongArray = null;
		PopulateAddressArray("to", false);
		addrs = toLongArray;
	}
	else if (id == "hcc")
	{
		ccLongArray = null;
		PopulateAddressArray("cc", false);
		addrs = ccLongArray;
	}
	if (addrs == null || addrs.length == 0) return ",,,";

	// check each individual entry
	var addrOnly = /^(\([^<>]*\))?[\w\.-]+@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+[a-zA-Z]{2,6}))(\([^<>]*\))?$/;
	var addrWithName = /^[^<>]*<[\w\.-]+@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+[a-zA-Z]{2,6}))>(\([^<>]*\))?$/;
	var needCheckQuickname = (earray != null) && (earray.length > 0);
	var isemptyarray = true;
	for (var i=0; i<addrs.length; i++)
	{
		if (addrs[i].length > 0) isemptyarray = false;
		if (addrs[i].length > 256) return addrs[i].substring(0, 49) + "...";

		if ((addrs[i].search(addrOnly) < 0) && (addrs[i].search(addrWithName) < 0))
		{
			// try quickname translation
			var found = false;
			if (needCheckQuickname)
			{
				for (var j=0; j<qarray.length; j++)
				{
					if (qarray[j].toLowerCase() == addrs[i].toLowerCase())
					{
						//addrs[i] = earray[j];
						found = true;
						break;
					}
				}
			}
			if (!found)
			{
				var address = addrs[i];
				if (address.length > 50)
				{
					address = address.substring(0, 49) + "...";
				}
				return address;
			}
		}
	}
	if (isemptyarray) return ",,,";

	// reset and reformat the addresses
	//var field = parent.document.getElementById(id);
	//if (field != null) field.value = NonEmptyJoin(addrs);
	return null;
}

// -1: not found
//  0: used as contact
// +1: used as group
function IsQuicknameExist(quickname)
{
	if (quickname == null || quickname.length <= 0) return -1;
	if (qarrayfull == null || qarrayfull.length <= 0) return -1;

	quickname = quickname.toLowerCase();
	for (var j=0; j<qarrayfull.length; j++)
	{
		if (qarrayfull[j].toLowerCase() == quickname)
		{
			if (earrayfull[j] == "Group") return 1;
			return 0;
		}
	}
	return -1;
}

function NonEmptyJoin(array)
{
	if (array == null || array.length <= 0) return "";
	var first = true;
	var temp = "";
	for (var i=0; i<array.length; i++)
	{
		if (array[i].length > 0)
		{
			if (!first) temp += ", ";
			temp += array[i];
			first = false; 
		}
	}
	return temp;
}
