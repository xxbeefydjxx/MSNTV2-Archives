var CodeLanguageMap = new Array();

CodeLanguageMap[0]=new Array(0x0c09, "English", "Australia", 1252)
CodeLanguageMap[1]=new Array(0x1009, "English", "Canada",1252 )
CodeLanguageMap[2]=new Array(0x0809, "English", "United Kingdom", 1252)
CodeLanguageMap[3]=new Array(0x0409, "English", "United States", 1252)
CodeLanguageMap[4]=new Array(0x040c, "French", "France", 1252)
CodeLanguageMap[5]=new Array(0x0407, "German", "Germany", 1252)
CodeLanguageMap[6]=new Array(0x0410, "Italian", "Italy", 1252)
CodeLanguageMap[7]=new Array(0x0816, "Portuguese", "Portugal",1252)
CodeLanguageMap[8]=new Array(0x0419, "Russian", "Russia", 1251)
CodeLanguageMap[9]=new Array(0x0c0a, "Spanish", "Spain (International sort)", 1252)
CodeLanguageMap[10]=new Array(0x0804, "Chinese", "Simplified (GB2312)", 936)
CodeLanguageMap[11]=new Array(0x0404, "Chinese", "Traditional (Big5)", 950)

//from IE setting Rfc1766
var IECode = new Array()

IECode[0x0009]="en;English"
IECode[0x0409]="en-us;English (United States)"
IECode[0x0809]="en-gb;English (British)"
IECode[0x0C09]="en-au;English (Australian)"
IECode[0x1009]="en-ca;English (Canadian)"
IECode[0x1409]="en-nz;English (New Zealand)"
IECode[0x1809]="en-ie;English (Ireland)"
IECode[0x1C09]="en-za;English (South Africa)"
IECode[0x2009]="en-jm;English (Jamaica)"
IECode[0x2809]="en-bz;English (Belize)"
IECode[0x2C09]="en-tt;English (Trinidad)"
IECode[0x080C]="fr-be;French (Belgian)"
IECode[0x0C0C]="fr-ca;French (Canadian)"
IECode[0x100C]="fr-ch;French (Swiss)"
IECode[0x140C]="fr-lu;French (Luxembourg)"
IECode[0x0407]="de;German (Germany)"
IECode[0x0410]="it;Italian (Italy)"
IECode[0x0816]="pt;Portuguese (Portugal)"
IECode[0x0419]="ru;Russian"
IECode[0x0C0A]="es;Spanish"
IECode[0x0430]="sx;Sutu"
IECode[0x041D]="sv;Swedish"
IECode[0x0804]="zh-cn;Chinese (PRC)"
IECode[0x0404]="zh-tw;Chinese (Taiwan)"

function ParseLangs(alllangs)
{
   var langs=new Array();
   langs=alllangs.split(" ");
   if(langs.length>1)
   {  
      var i=0;
	  for(i=0;i<langs.length;i++)
		langs[i]=parseInt(langs[i],"16");
   }

   return langs;

}

function GetLanguage(identifier)
{
   var index=0;
   var count=CodeLanguageMap.length;
   var result=-1;
   for(index=0;index<count;index++)
   {
	 if(CodeLanguageMap[index][0]==identifier)
	 {
	   result=index;
	   break;
	 }
   }
   if(result>=0)
     return CodeLanguageMap[result][1]+" ("+CodeLanguageMap[result][2]+")";
   return "";
}

function GetCodePage(identifier)
{
   var index=0;
   var count=CodeLanguageMap.length;
   var result=-1;
   for(index=0;index<count;index++)
   {
	 if(CodeLanguageMap[index][0]==identifier)
	 {
	   result=index;
	   break;
	 }
   }
   if(result>=0)
     return CodeLanguageMap[result][3];
   return -1;
}

function GetIECode(identifier)
{
   var iecode;

   iecode=IECode[identifier];
   var result="";

   if(iecode)
   {
		iecode=iecode.split(";");
		result=iecode[0];
   }
   return result;
}