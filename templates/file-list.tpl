{include file='head.tpl' jsIncludes=["jquery", "file-list", "tablesorter"] pageTitle="File List - CCAFS Climate" pageDescription="List of files available for download from CCAFS data portal." keywords="files,download,CCAFS"}
{include file='header.tpl' current="data"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="file-list">
    <h3>File List</h3>
    <hr>
    <br>
    <p>
        Please select one or more files you want to download.
    </p>
    <form id="files-form" action="/form.php" method="POST">
        <table id="files-table" class="tablesorter">
            <thead>
                <tr>
                    <th><input type="checkbox" id="check-all" />Select All</th>
                    <th>File Name</th>
                    <th>File Set</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {foreach from=$files item=file}
                    <tr>
                        <td>
                            {* Checkbox is shown only if the file is available *}
                            {if $file.availability_id == "2"}
                                <input class="checkbox-file" type="checkbox" name="download-files[]" value="{$file["id"]}" />
                            {else}
                                <input class="checkbox-file" type="checkbox" disabled="disabled" />
                            {/if}
                        </td>
                        <td>{$file.name}</td>
                        <td>{$file.fileset}</td>
                        <td>{$file.availability}</td>

                    </tr>
                {/foreach}
            </tbody>
        </table>
        <input type="hidden" name="file-type" value="file" />
        <button id="download-button" type="submit" disabled="disabled">Generate Download Links</button>
    </form>
</div>
{include file='footer.tpl'}
