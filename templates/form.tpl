{include file='head.tpl' jsIncludes=["jquery", "form", "tablesorter"] pageTitle="Data Form - CCAFS Climate" pageDescription="Form to fill for downloading data from the CCAFS climate data portal." keywords="CCAFS,registration,download"}
{include file='header.tpl' current="data"}
<script>
  $selectedFiles = {$downloads};
</script>
<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="form">
  <h3>Terms and conditions</h3> 
  <hr>
  <br>
  <p>
    To continue downloading your files, please first fill in your email and then some basic information. This information will be used by CCAFS solely for impact assessment and CGIAR and Center level reporting purposes. Filling it in will greatly help us to track the use of the portal and keep improving it. This portal provides data to a very large community of users and improving its usability and efficiency is a key aspect we work on continuously. However, you may click on <a id="skip-form" href="#">skip <input type="hidden" id="fileSet" name="fileSet" value="{$filsetTem}" />
    </a> to download links directly.
  </p>
  <p>
    These open-access datasets are hosted by <a href="http://aws.amazon.com/datasets/0241269495883982" target="_blank">Amazon Web Services</a>.
  </p>

  <div id="div-form">
    <form id="contact-form" action="/ajax/user-info.php" method="GET">
      <input type="hidden" id="user-id" name="userId" value="-1" />
      <input type="hidden" id="file-type" name="file-type" value="{$fileType}" />
	  <input type="hidden" id="tile_name" name="tile_name" value="{$tileName}" />
      <div class="input-form">
        <label class="label" for="email">Email:</label>
        <input id="email" name="email" type="email" />
        <button id="email-button" type="submit"><img class="button-image" src="{$smarty.const.SMARTY_IMG_URI}/search-icon.png" />Search</button>
        <img class="ajax-loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
        <span class="error">Please enter a valid email address.</span> <br>
      </div>
      <fieldset id="additional-information">
        <p id="welcome-message"></p>
        <div class="input-form user-name">
          <label class="label" for="first-name">First Name: </label>
          <input id="first-name" type="text" name="firstName" />
        </div>
        <div class="input-form user-name">
          <label class="label" for="last-name">Last Name: </label>
          <input id="last-name" type="text" name="lastName"/>
        </div>
        <div class="input-form">
          <label class="label" for="institute-name">Institute Name: </label>
          <input id="institute-name" type="text" name="instituteName"/>
        </div>
        <div class="checkbox-form institute-regions">
          <span class="group-label">Region(s) where your institute is located:</span>
          <div class="check-group">
            <input type="checkbox" id="i_africa" name="institute-regions[]" value="africa" /><label for="i_africa" class="label">Africa</label><br>
            <input type="checkbox" id="i_asia" name="institute-regions[]" value="asia" /><label for="i_asia" class="label">Asia</label><br>
            <input type="checkbox" id="i_oceania" name="institute-regions[]" value="oceania" /><label for="i_oceania" class="label">Australia and Oceania</label><br>
            <input type="checkbox" id="i_central_america_caribbean" name="institute-regions[]" value="central_america_caribbean" /><label for="i_central_america_caribbean" class="label">Central America and the Caribbean</label><br>
            <input type="checkbox" id="i_europe" name="institute-regions[]" value="europe" /><label for="i_europe" class="label">Europe</label><br>
            <input type="checkbox" id="i_middle_east_north_africa" name="institute-regions[]" value="middle_east_north_africa" /><label for="i_middle_east_north_africa" class="label">Middle East and North Africa</label><br>
            <input type="checkbox" id="i_north_america" name="institute-regions[]" value="north_america" /><label for="i_north_america" class="label">North America</label><br>
            <input type="checkbox" id="i_south_america" name="institute-regions[]" value="south_america" /><label for="i_south_america" class="label">South America</label><br>
          </div>
        </div>
        <div class="checkbox-form research-regions">
          <span class="group-label">Region(s) of your research interest:</span>
          <div class="check-group">
            <input type="checkbox" id="r_africa" name="research-regions[]" value="africa" /><label for="r_africa" class="label">Africa</label><br>
            <input type="checkbox" id="r_asia" name="research-regions[]" value="asia" /><label for="r_asia" class="label">Asia</label><br>
            <input type="checkbox" id="r_oceania" name="research-regions[]" value="oceania" /><label for="r_oceania" class="label">Australia and Oceania</label><br>
            <input type="checkbox" id="r_central_america_caribbean" name="research-regions[]" value="central_america_caribbean" /><label for="r_central_america_caribbean" class="label">Central America and the Caribbean</label><br>
            <input type="checkbox" id="r_europe" name="research-regions[]" value="europe" /><label for="r_europe" class="label">Europe</label><br>
            <input type="checkbox" id="r_middle_east_north_africa" name="research-regions[]" value="middle_east_north_africa" /><label for="r_middle_east_north_africa" class="label">Middle East and North Africa</label><br>
            <input type="checkbox" id="r_north_america" name="research-regions[]" value="north_america" /><label for="r_north_america" class="label">North America</label><br>
            <input type="checkbox" id="r_south_america" name="research-regions[]" value="south_america" /><label for="r_south_america" class="label">South America</label><br>
          </div>
        </div>
        <div class="text-area-form">
          <label for="use">Intended use of the data:</label>
          <textarea id="use" name="use" cols="40" rows="5" ></textarea>
        </div>
        <p id="disclaimer">
          Submitting this information constitutes acceptance of our intellectual property policy and <a href="{$smarty.const.SMARTY_DOCS_URI}/GCM_Data_Portal_Disclaimer.pdf">disclaimers</a>.
        </p>
        <div class="submit-button">
          <button id="submit-user-info" type="submit">Submit</button>
          <img id="ajax-loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
          <span id="message"></span>
        </div>
      </fieldset>
    </form>
  </div>
  <div class="skip-button">
    <input type="hidden" id="fileSet" name="fileSet" value="{$filsetTem}" />
    <input type="hidden" id="tile_name" name="tile_name" value="{$tileName}" />
    <img id="ajax-loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
    <span id="message"></span>
  </div>
  <div id="download-files">
    <p>The following links will be available for {$smarty.const.LINK_DAYS} days.</p>
    <table id="download-table" class="tablesorter">
      <thead  style="display: block;border-spacing: 1;width: 100%;">
        <tr>
          <th style="width: 54px;">No.</th>
          <th style="width: 738px;">File</th>
        </tr>
      </thead>
      <tbody id ="dataTable" style="max-height: 500px; overflow: auto;display: inline-block; margin-right: 10px;width: 100%;">
      </tbody>
    </table>
  </div>
</div>
{include file='footer.tpl'}