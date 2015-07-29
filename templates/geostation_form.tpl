{include file='head.tpl' jsIncludes=["jquery", "tablesorter"] pageTitle="Geostation Form - CCAFS Climate" pageDescription="internal page to commit stations on the DB" keywords=""}
{include file='header.tpl' current=""}
<script src="{$smarty.const.SMARTY_JS_URI}/geostation_form.js"></script> 
<div id="subheader-image">
</div>
<div id="scontent" class="form">
  <div id="div-form">
    <form id="station-form">
      <input type="hidden" id="stations-count" name="stations-count" value="1" />
      <div style="width:100%;overflow: scroll">
        <table id="station-tab">
          <tr>
            <td>Code</td>
            <td>Category</td>
            <td>Type</td>
            <td>Station Name</td>
            <td>Longitude</td>
            <td>Latitude</td>
            <td>Elevation</td>
            <td>Institute</td>
            <td>URL</td>
            <td>Instalation date</td>
            <td>Variables</td>
          </tr>
          <tr>
            <td>
              <input id="code0" type="text" name="code0" />
            </td>
            <td>
              <select id="cat0" name="cat0">
                <option value="0">---</option>
                {foreach from=$categories item=category}
                  <option value="{$category.id}">{$category.name}</option>
                {/foreach}
              </select>
            </td>
            <td>
              <select id="type0" name="type0">
                <option value="0">---</option>
                {foreach from=$types item=type}
                  <option value="{$type.id}">{$type.name}</option>
                {/foreach}
              </select>
            </td>
            <td>
              <input id="name0" type="text" name="name0" />
            </td>
            <td>
              <input id="lon0" type="text" name="lon0" />
            </td>
            <td>
              <input id="lat0" type="text" name="lat0" />
            </td>
            <td>
              <input id="elev0" type="text" name="elev0" />
            </td>
            <td>
              <select id="ins0" name="ins0">
                <option value="0">---</option>
                {foreach from=$institutes item=institute}
                  <option value="{$institute.id}">{$institute.name}</option>
                {/foreach}
              </select>
            </td>
            <td>
              <input id="url0" type="text" name="url0" />
            </td>
            <td>
              <input id="date0" type="text" name="date0" />
            </td>
            <td>
              <input id="vars0" type="text" name="vars0" />
            </td>
          </tr>
        </table>
        <div id="agregar-estacion" style="width: 140px; cursor: pointer;">Agregar estacion</div>
      </div>
      <div class="submit-button">
        <button id="submit-station" type="button">Submit</button>
        <img id="ajax-loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
        <span id="message"></span>
      </div>
    </form>
  </div>
</div>
{include file='footer.tpl'}