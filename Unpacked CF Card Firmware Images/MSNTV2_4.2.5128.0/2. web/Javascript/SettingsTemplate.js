
// Settings Template - wrap settings content in a table for better rendering

function OpenSettingsTable( label , label2, helpURL,disableGradient )
{
 	var output = "<TABLE cellspacing=0 cellpadding=0 height=100% width=100%>";
 	output += "<TR><TD><DIV id=header style='width:" + document.body.clientWidth +"px' class=ellipsis>";
 	if (label && ( label != "" ))
		output += "<SPAN id=title>" + label + "</SPAN>";

	if (label2 && ( label2 != "" ))
		output += "<SPAN id=title2>" + label2 + "</SPAN>";

	if (helpURL && ( helpURL != "" ) )
		output += "<A href='" + helpURL + "' id=help>Help<SPAN id=helpIcon></SPAN></A>";
	output += "</DIV></TD></TR>";

	output += "<TR><TD>";

	if ( !disableGradient )
		output += "<DIV id=gradient></DIV>";

	document.write( output );
}

function CloseSettingsTable( )
{
 	var output = "</TD></TR></TABLE>";

	document.write( output );
}


