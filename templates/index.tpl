{include file='head.tpl' jsIncludes=['jquery', 'index'] pageTitle="CCAFS Climate" pageDescription="Climate change downscaled data portal provided by CIAT and CCAFS." keywords="downscaling,GCM,climate change,CIAT,CCAFS"}
{include file='header.tpl' current="home"}

<div id="content" class="home">
    <table id="sections">
        <tbody>
            <tr>
                <td>
                    <a href="/spatial_downscaling/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_spatial_downscaling.png" />
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/spatial_disaggregation/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_spatial_disaggregation.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/data/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_data.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/documentation/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_docs.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/links/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_links.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/citations/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_citations.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/contact/">
                        <div id="section">
                            <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_contact.png">
                        </div>
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="content-description">
        <h4>Data Provided by the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS)</h4>
        <p>
            The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
            Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
            Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
            For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
        </p>
        <p>
            These open-access datasets are hosted by <a href="http://aws.amazon.com/datasets/0241269495883982" target="_blank">Amazon Web Services</a>.
        </p>
        <p>
            CCAFS provides these data without any warranty of any kind whatsoever, either express or implied, including warranties of merchantability and fitness for a particular purpose.
            CCAFS shall not be liable for incidental, consequential, or special damages arising out of the use of any data published here.
        </p>
    </div>
</div>
{include file='footer.tpl'}