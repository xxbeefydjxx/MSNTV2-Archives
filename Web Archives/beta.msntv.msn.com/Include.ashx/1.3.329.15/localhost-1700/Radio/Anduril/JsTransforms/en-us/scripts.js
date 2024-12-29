var gTunerFavsHtml = null;var gTunerCatsHtml = null;var gAddCatsHtml = null;var gCitiesStatesHtml = null;function tunerFavesHtml(){if (gTunerFavsHtml == null){gTunerFavsHtml = xform(getFavorites(true), "/radio/anduril/HtmlTransforms/en-us/favorites.xslt");}return gTunerFavsHtml;}function tunerCatsHtml(){if (gTunerCatsHtml == null){gTunerCatsHtml = xform(getCategories(), "/radio/anduril/HtmlTransforms/en-us/categories.xslt");}return gTunerCatsHtml;}function addCatsHtml(){if (gAddCatsHtml == null){gAddCatsHtml = xform(getCategories(), "/radio/anduril/HtmlTransforms/en-us/mycategories.xslt");}return gAddCatsHtml;}function getCitiesHtml(){if (gCitiesStatesHtml == null){gCitiesStatesHtml = xform(getLocalCities(), "/radio/anduril/HtmlTransforms/en-us/LocalCityChooser.xslt");}return gCitiesStatesHtml;}function getStationsHtml(stations){return xform(stations, "/radio/anduril/HtmlTransforms/en-us/categoryStationList.xslt");}function manageStationsHtml(stations){return xform(stations, "/radio/anduril/htmltransforms/en-us/managestationlist.xslt");}var gCats = null;var gCities = null;var gFavs = null;function getCategories(){if (gCats == null){var url = createUrl("ProxyPage.aspx?PageId=1"); gCats = createDomFromXmlHttp(url);}return gCats;}function getLocalCities(){if (gCities == null){var url = createUrl("ProxyPage.aspx?PageId=3"); gCities = createDomFromXmlHttp(url);}return gCities;}function getFavorites(forceGet){if (gFavs == null || forceGet){var url = createUrl("ProxyPage.aspx?PageId=2"); gFavs = createDomFromXmlHttp(url);}return gFavs;}function getCategoryStations(cat){var url = createUrl("ProxyPage.aspx?PageId=1&category=" + cat); return createDomFromXmlHttp(url);}function getLocalStations(state, city){var url = createUrl("ProxyPage.aspx?PageId=1&category=-5&State=" + state + "&City=" + city); return createDomFromXmlHttp(url);}function addFavorites(stationStr){gTunerFavsHtml = null;var oldFaves = gFavs.xml;var url = createUrl("ProxyPage.aspx?PageId=2&action=add&stationlist=" + stationStr); gFavs = createDomFromXmlHttp(url); if (gFavs.xml == oldFaves)top.showError("We are currently unable to add stations to your My Stations list. Please try again later.", "");return gFavs;}function removeFavorites(stationStr){gTunerFavsHtml = null;var oldFaves = gFavs.xml;var url = createUrl("ProxyPage.aspx?PageId=2&action=remove&stationlist=" + stationStr); gFavs = createDomFromXmlHttp(url);if (gFavs.xml == oldFaves)top.showError("We are currently unable to remove stations from your My Stations list. Please try again later.", "");return gFavs;}function getStationPropsAsArray(stations){var js = xform(stations, "/radio/anduril/jstransforms/en-us/stationsAsArrays.xslt");eval(js);var stationProps = new Array();stationProps[0] = stationIds;stationProps[1] = stationTypes;return stationProps;}function getStateAbbrsAsArray(){var xml = getLocalCities();var js = xform(xml, "/radio/anduril/jstransforms/en-us/statesAsArray.xslt");eval(js);return abbrs;}function WMPNav(url){window.open("buylink.aspx", "main", "msntv:panel");}function loadInFrame(uri){frames.home.location.href = uri;}function loadInWindow(uri){location.href = uri;}function gotoCategory(id,subtitle){subtitle = encodeAmp(subtitle);var uri = "categorystationlist.aspx?id=" + id + "&SubTitle=" + subtitle;loadInFrame(uri);}function goToLocalChooser(destpage){postLclPage = destpage;loadInFrame("LocalCityChooser.aspx");}function goToLocals(state, cityId, cityName){if (postLclPage == "catstlst"){loadInFrame("categorystationlist.aspx?state=" + state + "&cityId=" + cityId + "&SubTitle=" + cityName);}else if (postLclPage == "stmngr"){top.actionState = "add";loadInFrame("managestationlist.aspx?state=" + state + "&cityId=" + cityId);}}function goToManageStations(cat, state, cityId){top.actionState = "add";var url = "managestationlist.aspx?";if (cat != "")url += "&id=" + cat;else if (cityId != "")url += "&state=" + state + "&cityId=" + cityId;top.loadInFrame(url);}function playStation(id, type, plus, extUrl){var uri;if (testDataEnabled("stream")){uri = "/radio/BaseClient/TestData/Streams/10001246_genre.asx";}else if ( type == "ext" ){uri = extUrl.replace("&amp;", "&");}else	{if ( plus  && !IsRadioPlus() ){loadInFrame("/pages/radio/upsell.aspx?view=playstation");return;}if ( type == "internalstation" )type = "genre";uri = GetAsxUrl() + "?type=" + type + "&id=" + id;var force20K = !(IsBBConn()  && IsRadioPlus());var force64K = IsBBConn()  && IsRadioPlus();if ( force20K )uri += "&Force20K=true";else if ( force64K )uri += "&Force64K=true";uri += "&MSNTVBaseUrl=" + GetBaseUrl();uri += "&isBB=" + IsBBConn();}window.location = uri;}function xform(dataDoc, xsltUrl){var retStr = "";var xsltDoc;try{xsltDoc = new ActiveXObject("Msxml2.DOMDocument");xsltDoc.async = false;xsltDoc.load(xsltUrl);retStr = dataDoc.transformNode(xsltDoc);}catch (er){}if (xsltDoc.parseError.errorCode != 0){var myErr = xsltDoc.parseError;handleError(myErr);} return retStr;}function createDomFromXmlHttp(url){var domDoc = new ActiveXObject("Msxml2.DOMDocument");domDoc.async = false;var xmlHttp;try{xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");xmlHttp.open("GET", url, false);if (document.cookie != null  && document.cookie != "")xmlHttp.setRequestHeader("Cookie", document.cookie);xmlHttp.send();domDoc.loadXML(xmlHttp.responseText);}catch (er){handleError(er);}if (domDoc.parseError.errorCode != 0) {var myErr = domDoc.parseError;handleError(myErr);} return domDoc;}function testDataEnabled(type){var urlParamName = (type == "stream") ? "useTestStreams" : "useTestData" ;if ( getQueryParam(urlParamName, window) == "true" ) {return true;}return (type == "stream") ? UseTestStreams() : UseTestData();}function createUrl(path){var url = getBasePath() + "pages/radio/" + path;if (testDataEnabled("data"))url += (url.indexOf("?")==-1?"?":"&") + "useTestData=true";return url;}function handleError(er){}function isApollo(){if (navigator.userAgent.indexOf("STB") != -1)return true;return false;}function getQueryParam(param, win){if ( win == null ) win = frames.home;var loc = new String(win.location);var query = loc.split("?")[1];if ( query == null )return "";var params = query.split("&");for(var i=0; i < params.length; i++) {var currParam = params[i].split("=");var name = currParam[0];var value = currParam[1];if ( name == param )return value;}return "";}function getBasePath(){var currentPath = new String(window.location);var beginIndex = new String("http://").length;var index = currentPath.indexOf('/', beginIndex);return currentPath.substring(0, index) + "/";}function convertChars(s, from, to){var temp = s;while (temp.indexOf(from) != -1)temp = temp.replace(from, to);return temp;}function encodeAmp(str){return convertChars(str, "&", "[amp]");}function decodeAmp(str){return convertChars(str, "[amp]", "&");}function encodeApos(str){return convertChars(str, "'", "[apos]");}function decodeApos(str){return convertChars(str, "[apos]", "'");}var MGX_ICON_ERROR = 0x10;var MGX_ICON_WARNING = 0x30;var MGX_ICON_INFO = 0x40;var MGX_SIZE_LARGE = 0x0;var MGX_SIZE_SMALL = 0x1;function showError(msg, caption){window.external.MessageBox(msg, caption, "OK", 0, MGX_ICON_ERROR, MGX_SIZE_SMALL);return;}function showWarning(msg, caption){window.external.MessageBox(msg, caption, "OK", 0, MGX_ICON_WARNING, MGX_SIZE_SMALL);return;}function showInfo(msg, caption){window.external.MessageBox(msg, caption, "OK", 0, MGX_ICON_INFO, MGX_SIZE_SMALL);return;}function showConfirm(msg){var result = window.external.MessageBox(msg, "", "OK;Cancel", 0, MGX_ICON_INFO, MGX_SIZE_SMALL);return (result==0);}function showAutoHide(msg){window.external.AnimationMessageBox(msg, "", "", 2000);return;}