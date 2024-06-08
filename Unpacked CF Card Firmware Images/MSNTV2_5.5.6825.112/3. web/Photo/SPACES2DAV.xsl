<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:b="http://spaces.msn.com/mediacenter" exclude-result-prefixes="b" version="1.0">
  <xsl:output method="html" version="1.0"/>
  <!--<xsl:param name="filter"/>-->
 

  <xsl:template match="/">
  <a:multistatus xmlns:a="DAV:">
      
      <!-- folders -->
      
      <xsl:for-each select="//b:Album | //b:LoadAlbumResult">     
      <a:response>
        <a:href><xsl:value-of select="b:UniqueId"/></a:href>
        <a:propstat>
          <a:prop>
            <a:iscollection>1</a:iscollection>
            <a:displayname><xsl:value-of select="b:Title"/></a:displayname>
            <a:getcontenttype>x-application/collection</a:getcontenttype>
          </a:prop>
        </a:propstat>
      </a:response>
     </xsl:for-each>
      
    <!-- items -->
    <xsl:for-each select="//b:Photo">     
    <a:response>
      <a:href><xsl:value-of select=".//b:PreAuthUrl"/></a:href>
      <a:propstat>
        <a:prop>
		  <a:uid><xsl:value-of select="b:UniqueId"/></a:uid>
		  <a:parentid><xsl:value-of select="../../b:UniqueId"/></a:parentid>
          <a:iscollection>0</a:iscollection>
          <a:displayname><xsl:value-of select="b:FileName"/></a:displayname>
          <a:creationDate><xsl:value-of select="b:WhenTaken"/></a:creationDate>
          <a:getcontenttype>image/jpeg</a:getcontenttype>
        </a:prop>
      </a:propstat>
    </a:response>  
    </xsl:for-each>  
    
    
  </a:multistatus>

</xsl:template>

</xsl:stylesheet>

