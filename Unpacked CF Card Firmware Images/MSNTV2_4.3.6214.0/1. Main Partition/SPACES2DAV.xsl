<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" version="1.0"/>
  <!--<xsl:param name="filter"/>-->
 

  <xsl:template match="root">
  <a:multistatus xmlns:a="DAV:">
      
      <!-- folders -->
      
      <xsl:for-each select="results/ArrayOfAlbum/Album">     
      <a:response>
        <a:href><xsl:value-of select="uniqueId"/></a:href>
        <a:propstat>
          <a:prop>
            <a:iscollection>1</a:iscollection>
            <a:displayname><xsl:value-of select="name"/></a:displayname>
            <a:getcontenttype>x-application/collection</a:getcontenttype>
          </a:prop>
        </a:propstat>
      </a:response>
     </xsl:for-each>
     
      
    
    <!-- items -->
    <xsl:for-each select="results/album/ArrayOfPhoto/Photo">     
    <a:response>
      <a:href><xsl:value-of select="imageLocations/imageLocation[2]/preAuthURL"/></a:href>
      <a:propstat>
        <a:prop>
          <a:iscollection>0</a:iscollection>
          <a:displayname><xsl:value-of select="name"/></a:displayname>
          <a:creationDate><xsl:value-of select="date"/></a:creationDate>
          <a:getcontenttype>image/jpeg</a:getcontenttype>
        </a:prop>
      </a:propstat>
    </a:response>  
    </xsl:for-each>  

    <xsl:copy-of select="status" />

  </a:multistatus>

</xsl:template>

</xsl:stylesheet>

