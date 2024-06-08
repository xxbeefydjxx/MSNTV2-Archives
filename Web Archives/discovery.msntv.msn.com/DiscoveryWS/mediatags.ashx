
if(!window.Microsoft)window.Microsoft=new Object();if(!Microsoft.Msn)Microsoft.Msn=new Object();if(!Microsoft.Msn.MediaTags)
{Microsoft.Msn.MediaTags={ScanDoc:function(doc)
{if(!(doc.getElementById&&doc.createElement&&doc.getElementsByTagName))
{return false;}
if(typeof(this.UiHandlers)=='undefined')
{return false;}
for(supportedTagKey in this.UiHandlers)
{var supportedTagKeyLowerCase=supportedTagKey.toLowerCase();var searchForTag=supportedTagKeyLowerCase;var mediaTags;if(navigator.appName=="Microsoft Internet Explorer")
{var colonIdx=supportedTagKeyLowerCase.indexOf(":");if(colonIdx!=-1)
{searchForTag=supportedTagKeyLowerCase.substr(colonIdx+1);}}
mediaTags=doc.getElementsByTagName(searchForTag);if(mediaTags.length==0)
{return;}
for(var i=0;i<mediaTags.length;i++){this.AttachTag(mediaTags[i],supportedTagKeyLowerCase);}}
return true;},AttachTag:function(element,tagName,style)
{var handler=this.UiHandlers[tagName];if(handler!=null)
{if(handler.UiManager!=null)
{handler.UiManager.AttachTagInUIMgr(element,style);}
else
{handler.queue[handler.queue.length]={"element":element,"style":style};if(!handler.loaded)
{handler.loaded=true;eval("var f = function(uiManager) {Microsoft.Msn.MediaTags.OnLoadUiScript(uiManager,'"+tagName+"'); };");Microsoft.Msn.Tv.DataFetcher.LoadURL(handler.url,false,false,40000,f,function(){},function(){});}}}},OnLoadUiScript:function(uiManager,tag)
{uiManager=eval(uiManager);uiManager.Init();var handler=this.UiHandlers[tag];handler.UiManager=uiManager;var obs=handler.queue;for(var i=0;i<obs.length;i++)
{uiManager.AttachTagInUIMgr(obs[i].element,obs[i].style);}}};}
if(!window.Microsoft)window.Microsoft=new Object();if(!Microsoft.Msn)Microsoft.Msn=new Object();if(!Microsoft.Msn.Tv)Microsoft.Msn.Tv=new Object();Microsoft.Msn.Tv.DataFetcher={"LoadURL":function(url,isCacheable,preempt,timeoutMS,onMethodComplete,onMethodTimeout,onMethodError)
{if(isCacheable&&this.webServiceCache[url]!=null)
{onMethodComplete(this.webServiceCache[url]);return;}
if(url.indexOf("?")>=0)
{url+="&";}
else
{url+="?";}
url+="onComplete=onMethodComplete&onError=onMethodError";var callbackid=this.callStates.length;var callState=new this.CallState(url,isCacheable,timeoutMS,onMethodComplete,onMethodTimeout,onMethodError);this.callStates[callbackid]=callState;if(this.ExecuteTimer==null)
this.ExecuteTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.ExecutePendingRequests()",0);},"CreateFrames":function()
{var frame1=window.frames["Microsoft.Msn.TV.WebServiceFrame1"];if(frame1!=null)
{return true;}
if(document.body==null)
{document.write("<IFRAME id=\"Microsoft.Msn.TV.WebServiceFrame1\" name=\"Microsoft.Msn.TV.WebServiceFrame1\" FRAMEBORDER=no width=0 height=0 style='visibility:hidden'></IFRAME>");document.write("<IFRAME id=\"Microsoft.Msn.TV.WebServiceFrame2\" name=\"Microsoft.Msn.TV.WebServiceFrame2\" FRAMEBORDER=no width=0 height=0 style='visibility:hidden'></IFRAME>");}
else
{var oFrame=document.createElement("iframe");oFrame.id="Microsoft.Msn.TV.WebServiceFrame1";oFrame.name="Microsoft.Msn.TV.WebServiceFrame1";oFrame.frameBorder="no";oFrame.width=0;oFrame.height=0;oFrame.style.visibility="hidden";if(document.domain!=document.location.hostname)
oFrame.src="javascript:document.write('<script>document.domain=\""+document.domain+"\";<\/script>')";document.body.appendChild(oFrame);oFrame=document.createElement("iframe");oFrame.id="Microsoft.Msn.TV.WebServiceFrame2";oFrame.name="Microsoft.Msn.TV.WebServiceFrame2";oFrame.frameBorder="no";oFrame.width=0;oFrame.height=0;oFrame.style.visibility="hidden";if(document.domain!=document.location.hostname)
oFrame.src="javascript:document.write('<script>document.domain=\""+document.domain+"\";<\/script>')";document.body.appendChild(oFrame);}},"frame1Available":true,"frame2Available":true,"callStates":new Array(),"webServiceCache":new Array(),"requestsExecuted":0,"onMethodComplete":function(result,callbackid)
{if(this.callStates[callbackid]!=null&&this.callStates[callbackid].requestComplete)
{return;}
if(this.callStates[callbackid]=='undefined')
{return;}
var callState=this.callStates[callbackid];clearTimeout(callState.timeoutTimer);if(callState.frame==1)
{this.frame1Available=true;}
else
{this.frame2Available=true;}
if(callState.isCacheable)
{this.webServiceCache[callState.url]=result;}
callState.onloadCallback(result);if(this.ExecuteTimer==null)
this.ExecuteTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.ExecutePendingRequests()",0);},"onMethodError":function(callbackid,errId,errMsg)
{if(this.callStates[callbackid].requestComplete)
{return;}
var callState=this.callStates[callbackid];clearTimeout(callState.timeoutTimer);if(callState.frame==1)
{this.frame1Available=true;}
else
{this.frame2Available=true;}
if(callState.errorCallback)
callState.errorCallback(errId,errMsg);if(this.ExecuteTimer==null)
this.ExecuteTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.ExecutePendingRequests()",0);},"WebServiceTimeout":function(callbackid)
{var callState=this.callStates[callbackid];if(callState.frame==1)
{this.frame1Available=true;}
else
{this.frame2Available=true;}
if(callState.timeoutCallback)
callState.timeoutCallback();this.callStates[callbackid].requestComplete=true;if(this.ExecuteTimer==null)
this.ExecuteTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.ExecutePendingRequests()",0);},"ExecutePendingRequests":function()
{if(!this.CreateFrames())
{this.ExecuteTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.ExecutePendingRequests()",100);return;}
this.ExecuteTimer=null;if(this.requestsExecuted>=this.callStates.length)
{return;}
if(!(this.frame1Available||this.frame2Available))
{return;}
var callbackid=this.requestsExecuted;var callState=this.callStates[callbackid];var url=callState.url;var frame;var frameDoc;if(this.frame1Available)
{frame=window.frames["Microsoft.Msn.TV.WebServiceFrame1"];frameDoc=frame.document;this.callStates[callbackid].frame=1;this.frame1Available=false;}
else
{frame=window.frames["Microsoft.Msn.TV.WebServiceFrame2"];frameDoc=frame.document;this.callStates[callbackid].frame=2;this.frame2Available=false;}
this.callStates[callbackid].timeoutTimer=setTimeout("Microsoft.Msn.Tv.DataFetcher.WebServiceTimeout("+callbackid+")",callState.timeout);frameDoc.write("<SCRIPT>");if(document.domain!=document.location.hostname)
frameDoc.write("document.domain=\""+document.domain+"\";");frameDoc.write("onMethodComplete=function(result){parent.Microsoft.Msn.Tv.DataFetcher.onMethodComplete(result, "+callbackid+");location.replace('about:blank');}\r\n");frameDoc.write("onMethodError=function(){parent.Microsoft.Msn.Tv.DataFetcher.onMethodError("+callbackid+");location.replace('about:blank');}\r\n");frameDoc.write("</SCRIPT>");frameDoc.write("\<SCRIPT src=\""+url+"\"\>\</SCRIPT\>");this.requestsExecuted++;},"ClearCache":function()
{this.webServiceCache=new Array();},"CallState":function(url,isCacheable,timeout,onloadCallback,timeoutCallback,errorCallback)
{this.url=url;this.isCacheable=isCacheable;this.onloadCallback=onloadCallback;this.errorCallback=errorCallback;this.timeoutCallback=timeoutCallback;this.timeout=timeout;},"ExecuteTimer":null};var _sp,_rp,custom_var,_sH=screen.height,_w=window,_ht=_w.location.href,_hr=document.referrer,_tm=(new Date()).getTime(),_sW=screen.width,_sW2=(_sW-535)/2,_sH2=(_sH-192)/2;function _fC(_u){_u=escape(_u);_aT=_sp+',\\/,\\.,-,_,'+_rp+',%2F,%2E,%2D,%5F';_aA=_aT.split(',');for(i=0;i<5;i++){eval('_u=_u.replace(/'+_aA[i]+'/g,_aA[i+5])')}return _u};function O_LC(_rd){custom_var=_ht;if(_rd!=undefined){_domain=_ht.replace('https://','').replace('http://','');_sp='%3A\\/\\/'+escape(_domain.substr(0,_domain.indexOf('/')));_rp='%3A//'+_rd}_w.open('http://ccc01.opinionlab.com/comment_card.asp?time1='+_tm+'&time2='+(new Date()).getTime()+'&prev='+_fC(_hr)+'&referer='+_fC(_ht)+'&height='+_sH+'&width='+_sW+'&custom_var='+escape(custom_var),'comments','width=535,height=192,screenX='+_sW2+',screenY='+_sH2+',top='+_sH2+',left='+_sW2+',resizable=yes,scrollbars=no')}var tvs_s_account='msnportalmediatags';var tvs_s=tvs_s_gi(tvs_s_account);tvs_s.currencyCode="USD";tvs_s.trackDownloadLinks=true;tvs_s.trackExternalLinks=false;tvs_s.trackInlineStats=true;tvs_s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,doc,pdf,xls";tvs_s.linkLeaveQueryString=false;tvs_s.linkTrackVars="None";tvs_s.linkTrackEvents="None";tvs_s.visitorNamespace="msnportal";tvs_s.usePlugins=true;function tvs_s_doPlugins(tvs_s)
{tvs_s.readCTcookie();}
tvs_s.doPlugins=tvs_s_doPlugins;tvs_s.startLinkTracking=new Function("c","u","v",""
+"var tvs_s=this,i,lt,ltv,a=new Array;a=v.split('|');ltv='';for(var x=0;x"
+"<a.length;x++){i=a[x].indexOf('=');ltv+=a[x].substring(0,i)+',';tvs_s[a"
+"[x].substring(0,i)]=a[x].substring(i+1,a[x].length);}tvs_s.linkTrackVar"
+"tvs_s=ltv;tvs_s.trackExternalLinks=true;lt=tvs_s.lt(u);if(lt=='e'){tvs_s.linkType=l"
+"t;tvs_s.linkName='Custom Link Tracking';return '';}else{tvs_s.trackExternal"
+"Links=false;tvs_s.c_w(c,v,0);return '';}");tvs_s.readCTcookie=new Function("var tvs_s=this,cval,i,a=new Array;cval=tvs_s.c_r('s_msnct');if(cval){a=cval.split('|');for(var x=0;x<a.length;x++){i=a[x].indexOf('=');tvs_s[a[x].substring(0,i)]=a[x].substring(i+1,a[x].length);}tvs_s.c_w('s_msnct','',0);}return '';");tvs_s.getQueryParam=new Function("qp","d","var tvs_s=this,v='',d=d?d:'',i,t;while(qp){i=qp.indexOf(',');i=i<0?qp.length:i;t=tvs_s.gcgi(qp.substring(0,i));if(t)v+=v?d+t:t;qp=qp.substring(i==qp.length?i:i+1)}return v");tvs_s.gcgi=new Function("k","var v='',tvs_s=this;if(k&&tvs_s.wd.location.search){var q=tvs_s.wd.location.search.toLowerCase(),qq=q.indexOf('?');q=qq<0?q:q.substring(qq+1);v=tvs_s.pt(q,'&','cgif',k.toLowerCase())}return v");tvs_s.cgif=new Function("t","k","if(t){var tvs_s=this,i=t.indexOf('='),sk=i<0?t:t.substring(0,i),sv=i<0?'True':t.substring(i+1);if(sk.toLowerCase()==k)return tvs_s.epa(sv)}return ''");tvs_s.getANID=new Function("var anon=tvs_s.c_r('ANON');if(anon){var a=anon.split('&');for(var x=0;x<a.length;x++){i=a[x].indexOf('=');if('a'==a[x].substring(0,i).toLowerCase())return a[x].substring(i+1,a[x].length);}}");tvs_s.setMSNProps=new Function("var tvs_s=this,d=new Date;m=d.getUTCMonth()+1;y=d.getUTCFullYear();tvs_s.evar1=m+'/'+y;tvs_s.evar2=m+'/'+d.getUTCDate()+'/'+y;tvs_s.prop29=unescape(tvs_s.wd.location.href.match('[^?#]*'));tvs_s.prop23=tvs_s.getANID();");tvs_s.setMSNProps();var s_objectID;function tvs_s_c2fe(f)
{var x='',tvs_s=0,e,a,b,c;while(1)
{e=f.indexOf('"',tvs_s);b=f.indexOf('\\',tvs_s);c=f.indexOf("\n",tvs_s);if(e<0||(b>=0&&b<e))e=b;if(e<0||(c>=0&&c<e))e=c;if(e>=0)
{x+=(e>tvs_s?f.substring(tvs_s,e):'')+(e==c?'\\n':'\\'+f.substring(e,e+1));tvs_s=e+1}else return x
+f.substring(tvs_s)}
return f}
function tvs_s_c2fa(f)
{var tvs_s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(tvs_s>=0&&tvs_s<e)
{c=f.substring(tvs_s,tvs_s+1);if(c==',')
a+='","';else if(("\n\r\t ").indexOf(c)<0)a+=c;tvs_s++}
return a?'"'+a+'"':a}
function tvs_s_c2f(cc)
{cc=''+cc;var fc='var f=new Function(',tvs_s=cc.indexOf(';',cc.indexOf('{')),e=cc.lastIndexOf('}'),o,a,d,q,c,f,h,x
fc+=tvs_s_c2fa(cc)+',"var tvs_s=new Object;';c=cc.substring(tvs_s+1,e);tvs_s=c.indexOf('function');while(tvs_s>=0)
{d=1;q='';x=0;f=c.substring(tvs_s);a=tvs_s_c2fa(f);e=o=c.indexOf('{',tvs_s);e++;while(d>0)
{h=c.substring(e,e+1);if(q)
{if(h==q&&!x)q='';if(h=='\\')x=x?0:1;else x=0}else{if(h=='"'||h=="'")q=h;if(h=='{')d++;if(h=='}')d--}
if(d>0)e++}
c=c.substring(0,tvs_s)
+'new Function('+(a?a+',':'')+'"'+tvs_s_c2fe(c.substring(o+1,e))+'")'
+c.substring(e+1);tvs_s=c.indexOf('function')}
fc+=tvs_s_c2fe(c)+';return tvs_s");'
eval(fc);return f}
function tvs_s_gi(un,pg,ss)
{var c="function s_c(un,pg,s"
+"s){var tvs_s=this;tvs_s.wd=window;if(!tvs_s.wd.s_c_in){tvs_s.wd.s_c_il=new Array;tvs_s."
+"wd.s_c_in=0;}tvs_s._il=tvs_s.wd.s_c_il;tvs_s._in=tvs_s.wd.s_c_in;tvs_s._il[tvs_s._in]=tvs_s;tvs_s.w"
+"d.s_c_in++;tvs_s.m=function(m){return (''+m).indexOf('{')<0};tvs_s.fl=funct"
+"ion(x,l){return x?(''+x).substring(0,l):x};tvs_s.co=function(o){if(!o)r"
+"eturn o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.i"
+"ndexOf('filter')<0)n[x]=o[x];return n};tvs_s.num=function(x){x=''+x;for"
+"(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1"
+"))<0)return 0;return 1};tvs_s.rep=function(x,o,n){var i=x.indexOf(o),l="
+"n.length>0?n.length:1;while(x&&i>=0){x=x.substring(0,i)+n+x.substri"
+"ng(i+o.length);i=x.indexOf(o,i+l)}return x};tvs_s.ape=function(x){var tvs_s"
+"=this,i;x=x?tvs_s.rep(escape(''+x),'+','%2B'):x;if(x&&tvs_s.charSet&&tvs_s.em=="
+"1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>="
+"0){i++;if(('89ABCDEFabcdef').indexOf(x.substring(i,i+1))>=0)return "
+"x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}return x}"
+";tvs_s.epa=function(x){var tvs_s=this;return x?unescape(tvs_s.rep(''+x,'+',' ')"
+"):x};tvs_s.pt=function(x,d,f,a){var tvs_s=this,t=x,z=0,y,r;while(t){y=t.ind"
+"exOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=tvs_s.m(f)?tvs_s[f](t,a):f(t,"
+"a);if(r)return r;z+=y+d.length;t=x.substring(z,x.length);t=z<x.leng"
+"th?t:''}return ''};tvs_s.isf=function(t,a){var c=a.indexOf(':');if(c>=0"
+")a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);retu"
+"rn (t!=''&&t==a)};tvs_s.fsf=function(t,a){var tvs_s=this;if(tvs_s.pt(a,',','isf"
+"',t))tvs_s.fsg+=(tvs_s.fsg!=''?',':'')+t;return 0};tvs_s.fs=function(x,f){var tvs_s"
+"=this;tvs_s.fsg='';tvs_s.pt(x,',','fsf',f);return tvs_s.fsg};tvs_s.c_d='';tvs_s.c_gdf=f"
+"unction(t,a){var tvs_s=this;if(!tvs_s.num(t))return 1;return 0};tvs_s.c_gd=func"
+"tion(){var tvs_s=this,d=tvs_s.wd.location.hostname,n=tvs_s.cookieDomainPeriods,"
+"p;if(d&&!tvs_s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');wh"
+"ile(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}tvs_s.c_d=p>0&&tvs_s.pt(d,'.','"
+"c_gdf',0)?d.substring(p):''}return tvs_s.c_d};tvs_s.c_r=function(k){var tvs_s=t"
+"his;k=tvs_s.ape(k);var c=' '+tvs_s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:"
+"c.indexOf(';',i),v=i<0?'':tvs_s.epa(c.substring(i+2+k.length,e<0?c.leng"
+"th:e));return v!='[[B]]'?v:''};tvs_s.c_w=function(k,v,e){var tvs_s=this,d=tvs_s"
+".c_gd(),l=tvs_s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if("
+"e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=n"
+"ew Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){tvs_s.d.cooki"
+"e=k+'='+tvs_s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expir"
+"es='+e.toGMTString()+';':'')+(d?' domain='+d+';':'');return tvs_s.c_r(k"
+")==v}return 0};tvs_s.eh=function(o,e,r,f){var tvs_s=this,b='s_'+e+'_'+tvs_s._in"
+",n=-1,l,i,x;if(!tvs_s.ehl)tvs_s.ehl=new Array;l=tvs_s.ehl;for(i=0;i<l.length&&n"
+"<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l"
+"[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x."
+"o[b]=x.b;return b}return 0};tvs_s.cet=function(f,a,t,o,b){var tvs_s=this,r;"
+"if(tvs_s.isie&&a.apv>=5)eval('try{r=tvs_s.m(f)?tvs_s[f](a):f(a)}catch(e){r=tvs_s.m("
+"t)?tvs_s[t](e):t(e)}');else{if(tvs_s.ismac&&tvs_s.u.indexOf('MSIE 4')>=0)r=tvs_s.m("
+"b)?tvs_s[b](a):b(a);else{tvs_s.eh(tvs_s.wd,'onerror',0,o);r=tvs_s.m(f)?tvs_s[f](a):f(a)"
+";tvs_s.eh(tvs_s.wd,'onerror',1)}}return r};tvs_s.gtfset=function(e){var tvs_s=this;"
+"return tvs_s.tfs};tvs_s.gtfsoe=new Function('e','var tvs_s=s_c_il['+tvs_s._in+'];tvs_s."
+"eh(window,\"onerror\",1);tvs_s.etfs=1;var c=tvs_s.t();if(c)tvs_s.d.write(c);tvs_s.e"
+"tfs=0;return true');tvs_s.gtfsfb=function(a){return window};tvs_s.gtfsf=fun"
+"ction(w){var tvs_s=this,p=w.parent,l=w.location;tvs_s.tfs=w;if(p&&p.locatio"
+"n!=l&&p.location.host==l.host){tvs_s.tfs=p;return tvs_s.gtfsf(tvs_s.tfs)}return"
+" tvs_s.tfs};tvs_s.gtfs=function(){var tvs_s=this;if(!tvs_s.tfs){tvs_s.tfs=tvs_s.wd;if(!tvs_s.et"
+"fs)tvs_s.tfs=tvs_s.cet('gtfsf',tvs_s.tfs,'gtfset',tvs_s.gtfsoe,'gtfsfb')}return tvs_s.t"
+"fs};tvs_s.ca=function(){var tvs_s=this,imn='s_i_'+tvs_s.fun;if(tvs_s.d.images&&tvs_s.ap"
+"v>=3&&!tvs_s.isopera&&(tvs_s.ns6<0||tvs_s.apv>=6.1)){tvs_s.ios=1;if(!tvs_s.d.images[imn"
+"]&&(!tvs_s.isns||(tvs_s.apv<4||tvs_s.apv>=5))){tvs_s.d.write('<im'+'g name=\"'+imn+"
+"'\" height=1 width=1 border=0 alt=\"\">');if(!tvs_s.d.images[imn])tvs_s.ios"
+"=0}}};tvs_s.mr=function(sess,q,ta){var tvs_s=this,ns=tvs_s.visitorNamespace,unc"
+"=tvs_s.rep(tvs_s.fun,'_','-'),imn='s_i_'+tvs_s.fun,im,b,e,rs='http'+(tvs_s.ssl?'tvs_s':"
+"'')+'://'+(ns?ns:(tvs_s.ssl?'102':unc))+'.112.2O7.net/b/ss/'+tvs_s.un+'/1/H"
+".1-pdv-2/'+sess+'?[AQB]&ndh=1'+(q?q:'')+(tvs_s.q?tvs_s.q:'')+'&[AQE]';if(tvs_s."
+"isie&&!tvs_s.ismac){if(tvs_s.apv>5.5)rs=tvs_s.fl(rs,4095);else rs=tvs_s.fl(rs,2047)"
+"}if(tvs_s.ios){im=tvs_s.wd[imn]?tvs_s.wd[imn]:tvs_s.d.images[imn];if(!im)im=tvs_s.wd[im"
+"n]=new Image;im.src=rs;if(rs.indexOf('&pe=')>=0&&(!ta||ta=='_self'|"
+"|ta=='_top'||(tvs_s.wd.name&&ta==tvs_s.wd.name))){b=e=new Date;while(e.getT"
+"ime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c="
+"\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};tvs_s.gg=function(v){v"
+"ar tvs_s=this;return tvs_s.wd['s_'+v]};tvs_s.glf=function(t,a){if(t.substring(0"
+",2)=='s_')t=t.substring(2);var tvs_s=this,v=tvs_s.gg(t);if(v)tvs_s[t]=v};tvs_s.gl=f"
+"unction(v){var tvs_s=this;tvs_s.pt(v,',','glf',0)};tvs_s.gv=function(v){var tvs_s=t"
+"his;return tvs_s['vpm_'+v]?tvs_s['vpv_'+v]:tvs_s[v]};tvs_s.havf=function(t,a){var tvs_s"
+"=this,b=t.substring(0,4),x=t.substring(4),n=parseInt(x),k='g_'+t,m="
+"'vpm_'+t,q=t,v=tvs_s.linkTrackVars,e=tvs_s.linkTrackEvents;tvs_s[k]=tvs_s.gv(t);if("
+"tvs_s.lnk||tvs_s.eo){v=v?v+','+tvs_s.vl_l:'';if(v&&!tvs_s.pt(v,',','isf',t))tvs_s[k]=''"
+";if(t=='events'&&e)tvs_s[k]=tvs_s.fs(tvs_s[k],e)}tvs_s[m]=0;if(t=='pageURL')q='g';e"
+"lse if(t=='referrer')q='r';else if(t=='charSet'){q='ce';if(tvs_s[k]&&tvs_s."
+"em==2)tvs_s[k]='UTF-8'}else if(t=='visitorNamespace')q='ns';else if(t=="
+"'cookieDomainPeriods')q='cdp';else if(t=='cookieLifetime')q='cl';el"
+"se if(t=='visitVariableProvider')q='vvp';else if(t=='currencyCode')"
+"q='cc';else if(t=='channel')q='ch';else if(t=='campaign')q='v0';els"
+"e if(tvs_s.num(x)) {if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else"
+" if(b=='hier'){q='h'+n;tvs_s[k]=tvs_s.fl(tvs_s[k],255)}}if(tvs_s[k]&&t!='linkName'&"
+"&t!='linkType')tvs_s.qav+='&'+q+'='+tvs_s.ape(tvs_s[k]);return ''};tvs_s.hav=functi"
+"on(){var tvs_s=this;tvs_s.qav='';tvs_s.pt(tvs_s.vl_t,',','havf',0);return tvs_s.qav};tvs_s."
+"lnf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var"
+" te=t.indexOf('=');if(t&&te>0&&h.indexOf(t.substring(te+1))>=0)retu"
+"rn t.substring(0,te);return ''};tvs_s.ln=function(h){var tvs_s=this,n=tvs_s.lin"
+"kNames;if(n)return tvs_s.pt(n,',','lnf',h);return ''};tvs_s.ltdf=function(t"
+",h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf("
+"'?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.leng"
+"th+1))=='.'+t)return 1;return 0};tvs_s.ltef=function(t,h){t=t?t.toLower"
+"Case():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;ret"
+"urn 0};tvs_s.lt=function(h){var tvs_s=this,lft=tvs_s.linkDownloadFileTypes,lef="
+"tvs_s.linkExternalFilters,lif=tvs_s.linkInternalFilters;lif=lif?lif:tvs_s.wd.lo"
+"cation.hostname;h=h.toLowerCase();if(tvs_s.trackDownloadLinks&&lft&&tvs_s.p"
+"t(lft,',','ltdf',h))return 'd';if(tvs_s.trackExternalLinks&&(lef||lif)&"
+"&(!lef||tvs_s.pt(lef,',','ltef',h))&&(!lif||!tvs_s.pt(lif,',','ltef',h)))re"
+"turn 'e';return ''};tvs_s.lc=new Function('e','var tvs_s=s_c_il['+tvs_s._in+'],"
+"b=tvs_s.eh(this,\"onclick\");tvs_s.lnk=tvs_s.co(this);tvs_s.t();tvs_s.lnk=0;if(b)return"
+" this[b](e);return true');tvs_s.bc=new Function('e','var tvs_s=s_c_il['+tvs_s._"
+"in+'];if(tvs_s.d&&tvs_s.d.all&&tvs_s.d.all.cppXYctnr)return;tvs_s.eo=e.srcElement?e"
+".srcElement:e.target;tvs_s.t();tvs_s.eo=0');tvs_s.ot=function(o){var a=o.type,b"
+"=o.tagName;return (a&&a.toUpperCase?a:b&&b.toUpperCase?b:o.href?'A'"
+":'').toUpperCase()};tvs_s.oid=function(o){var tvs_s=this,t=tvs_s.ot(o),p=o.prot"
+"ocol,c=o.onclick,n='',x=0;if(!o.s_oid){if(o.href&&(t=='A'||t=='AREA"
+"')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=o.href;else"
+" if(c){n=tvs_s.rep(tvs_s.rep(tvs_s.rep(tvs_s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t"
+"\",''),' ','');x=2}else if(o.value&&(t=='INPUT'||t=='SUBMIT')){n=o."
+"value;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=tvs_s.fl(n,10"
+"0);o.s_oidt=x}}return o.s_oid};tvs_s.rqf=function(t,un){var tvs_s=this,e=t."
+"indexOf('='),u=e>=0?','+t.substring(0,e)+',':'';return u&&u.indexOf"
+"(','+un+',')>=0?tvs_s.epa(t.substring(e+1)):''};tvs_s.rq=function(un){var tvs_s"
+"=this,c=un.indexOf(','),v=tvs_s.c_r('s_sq'),q='';if(c<0)return tvs_s.pt(v,'"
+"&','rqf',un);return tvs_s.pt(un,',','rq',0)};tvs_s.sqp=function(t,a){var tvs_s="
+"this,e=t.indexOf('='),q=e<0?'':tvs_s.epa(t.substring(e+1));tvs_s.sqq[q]='';"
+"if(e>=0)tvs_s.pt(t.substring(0,e),',','sqs',q);return 0};tvs_s.sqs=function"
+"(un,q){var tvs_s=this;tvs_s.squ[un]=q;return 0};tvs_s.sq=function(q){var tvs_s=this"
+",k='s_sq',v=tvs_s.c_r(k),x,c=0;tvs_s.sqq=new Object;tvs_s.squ=new Object;tvs_s.sqq["
+"q]='';tvs_s.pt(v,'&','sqp',0);tvs_s.pt(tvs_s.un,',','sqs',q);v='';for(x in tvs_s.sq"
+"u)tvs_s.sqq[tvs_s.squ[x]]+=(tvs_s.sqq[tvs_s.squ[x]]?',':'')+x;for(x in tvs_s.sqq)if(x&&"
+"tvs_s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+tvs_s.sqq[x]+'='+tvs_s.ape(x);c++}retu"
+"rn tvs_s.c_w(k,v,0)};tvs_s.wdl=new Function('e','var tvs_s=s_c_il['+tvs_s._in+'],r="
+"true,b=tvs_s.eh(tvs_s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<tvs_s.d"
+".links.length;i++){o=tvs_s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";"
+"if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf"
+"(\".tl(\")<0)tvs_s.eh(o,\"onclick\",0,tvs_s.lc);}return r');tvs_s.wds=function("
+"){var tvs_s=this;if(tvs_s.apv>3&&(!tvs_s.isie||!tvs_s.ismac||tvs_s.apv>=5)){if(tvs_s.b&&tvs_s.b"
+".attachEvent)tvs_s.b.attachEvent('onclick',tvs_s.bc);else if(tvs_s.b&&tvs_s.b.addEv"
+"entListener)tvs_s.b.addEventListener('click',tvs_s.bc,false);else tvs_s.eh(tvs_s.wd"
+",'onload',0,tvs_s.wdl)}};tvs_s.vs=function(x){var tvs_s=this,v=tvs_s.visitorSamplin"
+"g,g=tvs_s.visitorSamplingGroup,k='s_vsn_'+tvs_s.un+(g?'_'+g:''),n=tvs_s.c_r(k),"
+"e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=1"
+"00;if(!n){if(!tvs_s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}retur"
+"n 1};tvs_s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;retur"
+"n 0};tvs_s.dyasf=function(t,m){var tvs_s=this,i=t?t.indexOf('='):-1,n,x;if("
+"i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(tvs_s.pt(x,',','d"
+"yasmf',m))return n}return 0};tvs_s.uns=function(){var tvs_s=this,x=tvs_s.dynami"
+"cAccountSelection,l=tvs_s.dynamicAccountList,m=tvs_s.dynamicAccountMatch,n,"
+"i;tvs_s.un.toLowerCase();if(x&&l){if(!m)m=tvs_s.wd.location.host;if(!m.toLo"
+"werCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=tvs_s.pt(l,';','dy"
+"asf',m);if(n)tvs_s.un=n}i=tvs_s.un.indexOf(',');tvs_s.fun=i<0?tvs_s.un:tvs_s.un.substri"
+"ng(0,i)};tvs_s.t=function(){var tvs_s=this,trk=1,tm=new Date,sed=Math&&Math"
+".random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess="
+"'tvs_s'+Math.floor(tm.getTime()/10800000)%10+sed,yr=tm.getYear(),vt=tm."
+"getDate()+'/'+tm.getMonth()+'/'+(yr<1900?yr+1900:yr)+' '+tm.getHour"
+"s()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm."
+"getTimezoneOffset(),tfs=tvs_s.gtfs(),ta='',q='',qs='';tvs_s.uns();if(!tvs_s.q){"
+"var tl=tfs.location,x='',c='',v='',p='',bw='',bh='',j='1.0',k=tvs_s.c_w"
+"('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(tvs_s.apv>=4)x=screen."
+"width+'x'+screen.height;if(tvs_s.isns||tvs_s.isopera){if(tvs_s.apv>=3){j='1.1';"
+"v=tvs_s.n.javaEnabled()?'Y':'N';if(tvs_s.apv>=4){j='1.2';c=screen.pixelDept"
+"h;bw=tvs_s.wd.innerWidth;bh=tvs_s.wd.innerHeight;if(tvs_s.apv>=4.06)j='1.3'}}tvs_s."
+"pl=tvs_s.n.plugins}else if(tvs_s.isie){if(tvs_s.apv>=4){v=tvs_s.n.javaEnabled()?'Y'"
+":'N';j='1.2';c=screen.colorDepth;if(tvs_s.apv>=5){bw=tvs_s.d.documentElemen"
+"t.offsetWidth;bh=tvs_s.d.documentElement.offsetHeight;j='1.3';if(!tvs_s.ism"
+"ac&&tvs_s.b){tvs_s.b.addBehavior('#default#homePage');hp=tvs_s.b.isHomePage(tl)"
+"?\"Y\":\"N\";tvs_s.b.addBehavior('#default#clientCaps');ct=tvs_s.b.connecti"
+"onType}}}else r=''}if(tvs_s.pl)while(pn<tvs_s.pl.length&&pn<30){ps=tvs_s.fl(tvs_s.p"
+"l[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}tvs_s.q=(x?'&tvs_s='+tvs_s.ap"
+"e(x):'')+(c?'&c='+tvs_s.ape(c):'')+(j?'&j='+j:'')+(v?'&v='+v:'')+(k?'&k"
+"='+k:'')+(bw?'&bw='+bw:'')+(bh?'&bh='+bh:'')+(ct?'&ct='+tvs_s.ape(ct):'"
+"')+(hp?'&hp='+hp:'')+(p?'&p='+tvs_s.ape(p):'')}if(tvs_s.usePlugins)tvs_s.doPlug"
+"ins(tvs_s);var l=tvs_s.wd.location,r=tfs.document.referrer;if(!tvs_s.pageURL)tvs_s."
+"pageURL=tvs_s.fl(l?l:'',255);if(!tvs_s.referrer)tvs_s.referrer=tvs_s.fl(r?r:'',255)"
+";if(tvs_s.lnk||tvs_s.eo){var o=tvs_s.eo?tvs_s.eo:tvs_s.lnk;if(!o)return '';var p=tvs_s.gv('"
+"pageName'),w=1,t=tvs_s.ot(o),n=tvs_s.oid(o),x=o.s_oidt,h,l,i,oc;if(tvs_s.eo&&o="
+"=tvs_s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o."
+"parentNode;if(!o)return '';t=tvs_s.ot(o);n=tvs_s.oid(o);x=o.s_oidt}oc=o.onc"
+"lick?''+o.onclick:'';if((oc.indexOf(\"s_gs(\")>=0&&oc.indexOf(\".s_"
+"oc(\")<0)||oc.indexOf(\".tl(\")>=0)return ''}ta=o.target;h=o.href?o"
+".href:'';i=h.indexOf('?');h=tvs_s.linkLeaveQueryString||i<0?h:h.substri"
+"ng(0,i);l=tvs_s.linkName?tvs_s.linkName:tvs_s.ln(h);t=tvs_s.linkType?tvs_s.linkType.toL"
+"owerCase():tvs_s.lt(h);if(t&&(h||l))q+='&pe=lnk_'+(t=='d'||t=='e'?tvs_s.ape"
+"(t):'o')+(h?'&pev1='+tvs_s.ape(h):'')+(l?'&pev2='+tvs_s.ape(l):'');else trk"
+"=0;if(tvs_s.trackInlineStats){if(!p){p=tvs_s.gv('pageURL');w=0}t=tvs_s.ot(o);i="
+"o.sourceIndex;if(tvs_s.gg('objectID')){n=tvs_s.gg('objectID');x=1;i=1}if(p&"
+"&n&&t)qs='&pid='+tvs_s.ape(tvs_s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+tvs_s.ape"
+"(tvs_s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+tvs_s.ape(t)+(i?'&oi='+i:'')}}if"
+"(!trk&&!qs)return '';var code='';if(trk&&tvs_s.vs(sed))code=tvs_s.mr(sess,("
+"vt?'&t='+tvs_s.ape(vt):'')+tvs_s.hav()+q+(qs?qs:tvs_s.rq(tvs_s.un)),ta);tvs_s.sq(trk?''"
+":qs);tvs_s.lnk=tvs_s.eo=tvs_s.linkName=tvs_s.linkType=tvs_s.wd.s_objectID='';return cod"
+"e};tvs_s.tl=function(o,t,n){var tvs_s=this;tvs_s.lnk=tvs_s.co(o);tvs_s.linkType=t;tvs_s.lin"
+"kName=n;tvs_s.t()};tvs_s.ssl=(tvs_s.wd.location.protocol.toLowerCase().indexOf("
+"'https')>=0);tvs_s.d=document;tvs_s.b=tvs_s.d.body;tvs_s.n=navigator;tvs_s.u=tvs_s.n.userAg"
+"ent;tvs_s.ns6=tvs_s.u.indexOf('Netscape6/');var apn=tvs_s.n.appName,v=tvs_s.n.appVe"
+"rsion,ie=v.indexOf('MSIE '),i;if(v.indexOf('Opera')>=0||tvs_s.u.indexOf"
+"('Opera')>=0)apn='Opera';tvs_s.isie=(apn=='Microsoft Internet Explorer'"
+");tvs_s.isns=(apn=='Netscape');tvs_s.isopera=(apn=='Opera');tvs_s.ismac=(tvs_s.u.in"
+"dexOf('Mac')>=0);if(ie>0){tvs_s.apv=parseInt(i=v.substring(ie+5));if(tvs_s."
+"apv>3)tvs_s.apv=parseFloat(i)}else if(tvs_s.ns6>0)tvs_s.apv=parseFloat(tvs_s.u.subs"
+"tring(tvs_s.ns6+10));else tvs_s.apv=parseFloat(v);tvs_s.em=0;if(String.fromChar"
+"Code){i=escape(String.fromCharCode(256)).toUpperCase();tvs_s.em=(i=='%C"
+"4%80'?2:(i=='%U0100'?1:0))}tvs_s.un=un;tvs_s.uns();tvs_s.vl_l='charSet,visitorN"
+"amespace,cookieDomainPeriods,cookieLifetime,visitVariableProvider,p"
+"ageName,pageURL,referrer,currencyCode,purchaseID';tvs_s.vl_t=tvs_s.vl_l+',c"
+"hannel,server,pageType,campaign,state,zip,events,products,linkName,"
+"linkType';for(var n=1;n<51;n++)tvs_s.vl_t+=',prop'+n+',eVar'+n+',hier'+"
+"n;tvs_s.vl_g=tvs_s.vl_t+',trackDownloadLinks,trackExternalLinks,trackInline"
+"Stats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilter"
+"tvs_s,linkInternalFilters,linkNames';if(pg)tvs_s.gl(tvs_s.vl_g);if(!ss){tvs_s.wds()"
+";tvs_s.ca()}}",l=window.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,tvs_s;if(l)for(i=0;i<l.length;i++)
{tvs_s=l[i];tvs_s.uns();if(tvs_s.un==un)return tvs_s;else if(tvs_s.pt(tvs_s.un,',','isf',un))
{tvs_s=tvs_s.co(tvs_s);tvs_s.un=un;tvs_s.uns();return tvs_s}}
if(e>0)
{a=parseInt(i=v.substring(e
+5));if(a>3)a=parseFloat(i)}
else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a>=5&&v.indexOf('Opera')<0&&u.indexOf('Opera')<0)
{eval(c);return new s_c(un,pg,ss)}
else tvs_s=tvs_s_c2f(c);return tvs_s(un,pg,ss);}if (typeof(uiHandlers) == 'undefined') { uiHandlers = new Array();uiHandlers["tvservices:tv"] = {url:"http://discovery.msntv.msn.com/discoveryws/tvtagui.ashx?version=1.0.2456.25949",loaded:false,queue:[]};
Microsoft.Msn.MediaTags.UiHandlers = uiHandlers; }
Microsoft.Msn.MediaTags.ScanDoc(document);