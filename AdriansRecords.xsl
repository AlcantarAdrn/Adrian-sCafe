<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="recordsTable" border="1" class="indent">
        <thead>
            <tr>
                <th colspan="3">Your Records</th>
            </tr>
            <tr>
                <th>Select </th>
                <th>Title</th>
                <th> Price </th>
            </tr>
            </thead>
            <tbody>
                <xsl:for-each select = "/recordsmenu/section">
                


            </tbody>
                