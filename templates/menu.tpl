<nav id="main-menu">
  <ul id="navlist">
    <li {if $current == 'home'}class="current"{/if}><a href="/">Home</a></li>
    <!--<li {if $current == 'methods'}class="current dropdown"{else}class="dropdown"{/if}><a href="/methods/">Methods</a>
      <ul class="sub-menu">
        <li {if $current == 'downscaling'}class="current"{/if}><a href="/spatial_downscaling/">Spatial Downscaling</a></li>
        <li {if $current == 'dissagregation'}class="current"{/if}><a href="/spatial_disaggregation/">Spatial Dissagregation</a></li>
        <li><a href="/bias_correction/">Bias Correction</a></li>
      </ul>	
	</li>-->
    <!--<li {if $current == 'downscaling'}class="current"{/if}><a href="/spatial_downscaling/">Spatial Downscaling</a></li>
    <li {if $current == 'dissagregation'}class="current"{/if}><a href="/spatial_disaggregation/">Spatial Dissagregation</a></li>-->
    <li {if $current == 'downscaling'}class="current"{/if}><a href="/downscaling/">Downscaling</a></li>
    <li {if $current == 'dissagregation'}class="current"{/if}><a href="/bias_correction/">Bias Correction</a></li>	
    <li {if $current == 'data'}class="current dropdown"{else}class="dropdown"{/if}><a href="/data/">Data</a>
      <ul class="sub-menu">
        <li><a href="/data_spatial_downscaling/">Spatial downscaling</a></li>
        <li><a href="/data_bias_corrected/">Bias Correction</a></li>
        <li><a href="/weather_stations/">Weather Stations</a></li>
      </ul>
    </li>
    {*        <li {if $current == 'weather_stations'}class="current"{/if}><a href="/weather_stations/">Weather Stations</a></li>*}
    <li {if $current == 'documentation'}class="current"{/if}><a href="/documentation/">Documentation</a></li>
    <li {if $current == 'links'}class="current"{/if}><a href="/links/">Links</a></li>
    <li {if $current == 'citations'}class="current"{/if}><a href="/citations/">Citations</a></li>
  </ul>
</nav>
<script>
  $(document).ready(function() {
    $('.dropdown').hover(
            function() {
              $(this).children('.sub-menu').slideDown(200);
            },
            function() {
              $(this).children('.sub-menu').slideUp(200);
            }
    );
  });
</script>