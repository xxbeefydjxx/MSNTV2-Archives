<?xml version="1.0" encoding="UTF-8" ?>
<!--
	converting from MSNTV favorites to roaming favorites
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
	<req op="imp">
		<favorites>
			<xsl:apply-templates select="/favorites"/>
		</favorites>
	</req>
</xsl:template>
<xsl:template match="favfolder">
	<xsl:if test="@title != '' ">
		<fd fl="0x4">
			<xsl:attribute name="t"><xsl:value-of select="@title"/></xsl:attribute>
			<xsl:apply-templates select="favfolder" />
			<xsl:apply-templates select="favorite" />
		</fd>
	</xsl:if>
</xsl:template>
<xsl:template match="favorite">
	<xsl:if test="(title != '') and (href != '')">
		<f ut="1" k="" tg="">
			<xsl:attribute name="t"><xsl:value-of select="title" /></xsl:attribute>
			<xsl:attribute name="u"><xsl:value-of select="href" /></xsl:attribute>
		</f>
	</xsl:if>
</xsl:template>
</xsl:stylesheet>

  