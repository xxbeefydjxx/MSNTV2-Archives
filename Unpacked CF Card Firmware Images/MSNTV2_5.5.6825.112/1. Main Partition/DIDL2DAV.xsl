<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:didl="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" exclude-result-prefixes="didl dc upnp">
  <xsl:output method="html" version="1.0"/>
  <!--<xsl:param name="filter"/>-->
  

  <xsl:template match="didl:DIDL-Lite">
  <a:multistatus xmlns:a="DAV:">
      
      <!-- folders -->
      
      <xsl:for-each select="didl:container">     
      <a:response>
        <a:href><xsl:value-of select="@id"/></a:href>
        <a:propstat>
          <a:prop>
            <a:iscollection>1</a:iscollection>
            <a:displayname><xsl:value-of select="dc:title"/></a:displayname>
            <a:getcontenttype>x-application/collection</a:getcontenttype>
          </a:prop>
        </a:propstat>
      </a:response>
     </xsl:for-each>


    <!-- items -->
    
    <xsl:for-each select="didl:item">     
    <a:response>
      <a:href><xsl:value-of select="didl:res[1]"/></a:href>
      <a:propstat>
        <a:prop>
          <a:iscollection>0</a:iscollection>
          <a:displayname><xsl:value-of select="dc:title"/></a:displayname>
          <a:title><xsl:value-of select="dc:title"/></a:title>
          <a:creationDate><xsl:value-of select="dc:date"/></a:creationDate>
          <xsl:for-each select="didl:res[1]/@size">     
            <a:getcontentlength><xsl:value-of select="."/></a:getcontentlength>
          </xsl:for-each>  
          <xsl:for-each select="didl:res[1]/@duration">     
            <a:duration><xsl:value-of select="."/></a:duration>
          </xsl:for-each>  
          <xsl:for-each select="didl:res[1]/@protection">     
            <a:protection><xsl:value-of select="."/></a:protection>
          </xsl:for-each>  
          
          <!-- assumes http-get protocol -->
          <a:getcontenttype><xsl:value-of select="substring-before(substring-after(didl:res[1]/@protocolInfo, 'http-get:*:'),':*')"/></a:getcontenttype>
          <xsl:for-each select="upnp:artist">     
            <a:artist><xsl:value-of select="."/></a:artist>
          </xsl:for-each>  
          <xsl:for-each select="upnp:album">     
            <a:album><xsl:value-of select="."/></a:album>
          </xsl:for-each>  
        </a:prop>
      </a:propstat>
    </a:response>  
  </xsl:for-each>  

  <xsl:copy-of select="status" />

 </a:multistatus>

 </xsl:template>

</xsl:stylesheet>
