<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:live="http://api.live.com/schemas" xmlns:media="http://search.yahoo.com/mrss/" exclude-result-prefixes="atom live media"
	version="1.0">
	<xsl:output method="html" version="1.0" />
	<!--<xsl:param name="filter"/>-->
	<xsl:template match="/">
		<a:multistatus xmlns:a="DAV:">
			<xsl:for-each select="//atom:entry">
				<xsl:choose>
					<!-- folders -->
					<xsl:when test="live:category='Photos'">
						<a:response>
							<a:href>
								<xsl:value-of select="live:resourceId" />
							</a:href>
							<a:propstat>
								<a:prop>
									<a:iscollection>1</a:iscollection>
									<a:displayname>
										<xsl:value-of select="atom:title" />
									</a:displayname>
									<a:sharingLevel>
										<xsl:value-of select="live:sharingLevel" />
									</a:sharingLevel>
									<a:count>
										<xsl:value-of select="live:itemCount" />
									</a:count>
									<a:getcontenttype>x-application/collection</a:getcontenttype>
								</a:prop>
							</a:propstat>
						</a:response>
					</xsl:when>
					<!-- items -->
					<xsl:when test="live:type='Photo'">
						<a:response>
							<xsl:if test="substring(media:thumbnail/@url,1,5)='https'">
								<a:href>http<xsl:value-of select="substring(media:thumbnail/@url,6)" /></a:href>
							</xsl:if>
							<xsl:if test="substring(media:thumbnail/@url,1,5)='http:'">
								<a:href>
									<xsl:value-of select="media:thumbnail/@url" />
								</a:href>
							</xsl:if>
							<a:propstat>
								<a:prop>
									<a:uid>
										<xsl:value-of select="live:resourceId" />
									</a:uid>
									<a:parentid>
										<xsl:value-of select="live:parentId" />
									</a:parentid>
									<a:iscollection>0</a:iscollection>
									<a:displayname>
										<xsl:value-of select="atom:title" />
									</a:displayname>
									<a:creationDate>
										<xsl:value-of select="atom:published" />
									</a:creationDate>
									<a:getcontenttype>image/jpeg</a:getcontenttype>
								</a:prop>
							</a:propstat>
						</a:response>
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</a:multistatus>
	</xsl:template>
</xsl:stylesheet>
