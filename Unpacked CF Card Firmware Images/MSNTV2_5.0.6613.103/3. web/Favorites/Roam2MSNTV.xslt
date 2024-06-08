<?xml version="1.0" encoding="UTF-8" ?>
<!--
	converting from roaming favorites to MSNTV favorites and sorted by title and ascending order
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
	<favorites sortedby="title" direction="ascending" showthumbs="true" showurls="true" showfeatured="true">
		<xsl:apply-templates select="/resp/favorites"/>
	</favorites>
</xsl:template>
<xsl:template match="*">
	<xsl:for-each select="fd">
		<xsl:sort select="@t" order="ascending" />
		<xsl:if test="(@del =0) or not(@del)">
			<favfolder created="" >
				<xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="@t"/></xsl:attribute>
				<xsl:apply-templates select="." />
			</favfolder>
		</xsl:if>
	</xsl:for-each>
	<xsl:for-each select="f">
		<xsl:sort select="@t" order="ascending" />
		<xsl:if test="(@del =0) or not(@del)">
			<favorite>
				<xsl:attribute name="lv"><xsl:value-of select="@lv" /></xsl:attribute>
				<xsl:attribute name="vc">1</xsl:attribute>
				<xsl:attribute name="id"><xsl:value-of select="generate-id()" /></xsl:attribute>
				<title><xsl:value-of select="@t"/></title>
				<href><xsl:value-of select="@u" /></href>
				<created><xsl:value-of select="@lv"/></created>
			</favorite>
		</xsl:if>
	</xsl:for-each>
</xsl:template>
</xsl:stylesheet>

  
