
function unspace( element ) {
	var re = /[+]/g; 
    return element.replace(re, ' ');
}

function escapeplus( element ) {
	var re = /[+]/g; 
    return element.replace(re, "%2B");
}

function FindParameters(panelManager)
{
	var parameters = new Array();
	var search = document.location.search;

	if (search.length > 1) {
		var query = search.substring( 1, search.length );
		var pairs = query.split( '&' );
		TVShell.Message("pairs.length = " + pairs.length);
		for ( var index = 0; index < pairs.length; index++ ) {
			var element = pairs[index].split( '=' );
			if (element.length > 1) {
				parameters[element[0]] = unescape( unspace( element[1] ) );
			} else if (element.length > 0 && element[0] != "" ) {
				parameters[element[0]] = "";
			}
		}
	}

	TVShell.Message("parameters.length = " + parameters.length);
	return parameters;
}

function FindParametersFromFile(fileName)
{
	if(!TVShell)
		return null;
	
	var parameters;	
	var paramStr=TVShell.ReadFile(fileName);
	
	if(!paramStr)
		return null;
		
	var namevalues=paramStr.split(" ");
	var len=namevalues.length;
	if(len>0)
	  len=len/2;

	parameters = new Array(len);

	for(i=0;i<len;i++)
		parameters[unescape(namevalues[2*i])]=unescape(namevalues[2*i+1]);

	return parameters;
}
