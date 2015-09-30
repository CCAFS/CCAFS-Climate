<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$profile = $_REQUEST['profile'];
?>
<script>
  $("#gotoclimate").on('click', function() {
    $(".remodal-overlay").hide();
  });

  $("#goback").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 0},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });
  
  $("#goback1").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: -1},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });
  
  $("#policy-l").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 1},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });

  $("#govermental-l").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 2},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });

  $("#academic-l").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 3},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });

  $("#researcher-l").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 4},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });
  
  $("#profiles").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 0},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });

//  $(".policy").on('click', function() {
//    $.ajax({
//      type: "POST",
//      dataType: "text",
//      url: "/ajax/user-profiles.php",
//      data: {profile: 1},
//      success: function(data) {
//        $("#whatisamkn").html(data);
//      }
//    });
//  });
//
//  $("#govermental").on('click', function() {
//    $.ajax({
//      type: "POST",
//      dataType: "text",
//      url: "/ajax/user-profiles.php",
//      data: {profile: 2},
//      success: function(data) {
//        $("#whatisamkn").html(data);
//      }
//    });
//  });

//  $("#academic").on('click', function() {
//    $.ajax({
//      type: "POST",
//      dataType: "text",
//      url: "/ajax/user-profiles.php",
//      data: {profile: 3},
//      success: function(data) {
//        $("#whatisamkn").html(data);
//      }
//    });
//  });
//
//  $("#researcher").on('click', function() {
//    $.ajax({
//      type: "POST",
//      dataType: "text",
//      url: "/ajax/user-profiles.php",
//      data: {profile: 4},
//      success: function(data) {
//        $("#whatisamkn").html(data);
//      }
//    });
//  });
  
  $("#profiles").on('click', function() {
    $("#goback1").show();
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 0},
      success: function(data) {
        $("#whatisamkn").html(data);
      }
    });
  });
</script>
<?php
switch ($profile) {
  case -1:
    ?>
    <div class="modal-first modal-whatis">
      <h2><strong>What is CCAFS-Climate?</strong></h2>
      <p>
        The CCAFS-Climate data portal provides users global and regional future high-resolution climate datasets that can help assess the impacts of climate change in a variety of fields related to biodiversity, agriculture in others. 
      </p>
    </div>
    <h2><strong>Who are you?</strong></h2>
    <div class="modal-first modal-whoare">
      Applications of CCAFS-Climate data include assessing  agriculture, ecosystem functioning, options for policy-making, food security and adaptation planning, in others. 
      <a id="profiles" href="#">See how CCAFS-Climate can help to your specific field</a>
    </div>
    <div class="modal-first modal-whoare modal-icons">
      <div id="policy" class="icon-container">
        <div class="policy icon">
        </div>
        <div class="icon-text">
          Policy/Deciton-Maker
        </div>
      </div>
      <div id="govermental" class="icon-container">
        <div class="govermental icon">
        </div>
        <div class="icon-text">
          Governmental Staff
        </div>
      </div>
      <div id="academic" class="icon-container">
        <div class="academic icon">
        </div>
        <div class="icon-text">
          Academic
        </div>
      </div>
      <div id="researcher" class="icon-container">
        <div class="researcher icon">
        </div>
        <div class="icon-text">
          Researcher
        </div>
      </div>
    </div>
<!--    <div class="buttons">
      <div class="buttons-c">
        <a id="gotoclimate" class="gotoclimate">Return to Website</a>
      </div>
    </div>-->
<?php
    break;
  case 0:
    ?>

    <h2><strong>Who are you?</strong></h2>
    <div class="profiles-container">
      <div id="policy-l" class="icon-container">
        <div class="policy icon-l">
        </div>
        <div class="icon-text-l">
          Policy/Deciton-Maker
        </div>
      </div>
      <div id="govermental-l" class="icon-container">
        <div class="govermental icon-l">
        </div>
        <div class="icon-text-l">
          Governmental Staff
        </div>
      </div>
      <div id="academic-l" class="icon-container">
        <div class="academic icon-l">
        </div>
        <div class="icon-text-l">
          Academic
        </div>
      </div>
      <div id="researcher-l" class="icon-container">
        <div class="researcher icon-l">
        </div>
        <div class="icon-text-l">
          Researcher
        </div>
      </div>
<!--      <div class="buttons">
          <div class="buttons-c">
          <a id="goback1" class="gotoclimate">Back</a>
          <a id="gotoclimate" class="gotoclimate">Return to Website</a>
          </div>
        </div>-->
    </div>
    <?php
    break;
  case 1:
    ?>

    <div class="profiles-container">
      <div class="icon-detail-container">
        <h2><strong>Who are you?</strong></h2>
        <div class="icon-container-d">
          <div class="policy icon-l">
          </div>
          <div class="icon-text-l">
            Policy/Deciton-Maker
          </div>
        </div>
      </div>
      <div class="profile-detail">
        <div class="profile-detail-1">
          <div class="icon-container-d1" title="<ul>
               <li>Policy making, food security, and adaptation planning</li><li>Assessing / enhancing agricultural practices.
               </li><li>The informing of crop insurance policy development 
               </li><li>Inform agricultural investment prioritization 
               </li><li>Food security assessment.
               </li><li>Vulnerability assessment especially in developing countries.
               </li></ul>">
            <div class="topic-02 icon-c">
            </div>
            <div class="icon-text-c">
              Agriculture
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Prioritize conservation efforts, for policy and planning in national parks/wildlife reserves and by municipalities
               </li>
               <li>Inform prioritization of conservation efforts</li>
               </ul>">
            <div class="topic-09 icon-c">
            </div>
            <div class="icon-text-c">
              National Parks & Wildlife Reserves
            </div>
          </div>
          <div class="icon-container-d1" title="<ul><li>Understanding downscaled climate modeling in order to create more robust impact assessments</li></ul>">
            <div class="topic-04 icon-c">
            </div>
            <div class="icon-text-c">
              Agro-climatology
            </div>
          </div>
        </div>
        <div class="profile-detail-2">
          <div class="icon-container-d2" title="<ul>
               <li>Policy making, food security, and adaptation planning</li>
               <li>Custom analyses for specific places to support adaptation planning</li>
               <li>The informing of water policy development</li>
               <li>Land-use planning</li>
               <li>Adaptative capacity enhancement in developing countries</li>
               </ul>">
            <div class="topic-05 icon-c">
            </div>
            <div class="icon-text-c">
              Ecosystem functioning
            </div>
          </div>
          <div id="policy" class="icon-container-d2" title="<ul>
               <li>Adaptative capacity enhancement in developing countries</li>
               <li>Inform design of CC adaptation interventions/measure by NGOs and development agencies</li>
               <li>Inform decision making at national level or local/community level</li>
               </ul>">
            <div class="topic-06 icon-c">
            </div>
            <div class="icon-text-c">
              Other impact assessments
            </div>
          </div>
        </div>
<!--        <div class="buttons">
          <div class="buttons-c">
          <a id="goback" class="gotoclimate">Back</a>
          <a id="gotoclimate" class="gotoclimate">Return to Website</a>
          </div>
        </div>-->
      </div>
    </div>
    <!--    <div class="profile-detail">
          <div class="profile-detail-1">

          </div>
          <div class="profile-detail-2">

          </div>
        </div>-->
    <?php
    break;
  case 2:
    ?>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <h2><strong>Who are you?</strong></h2>
        <div id="govermental" class="icon-container-d">
          <div class="govermental icon-l">
          </div>
          <div class="icon-text-l">
            Governmental Staff
          </div>
        </div>
      </div>
      <div class="profile-detail">
        <div class="profile-detail-1">
          <div class="icon-container-d1" title="<ul>
               <li>Policy making, food security, and adaptation planning</li><li>Assessing / enhancing agricultural practices.
               </li><li>Assessing / enhancing agricultural practices
               </li><li>Define investment prioritization 
               </li><li>Food security assessment.
               </li><li>Vulnerability assessment especially in developing countries.
               </li></ul>">
            <div class="topic-02 icon-c">
            </div>
            <div class="icon-text-c">
              Agriculture
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Prioritize conservation efforts, for policy and planning in national parks/wildlife reserves and by municipalities
               </li>
               <li>Prioritization of conservation efforts</li>
               </ul>">
            <div class="topic-09 icon-c">
            </div>
            <div class="icon-text-c">
              Biodiversity & Genetic
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Agroclimatic and vulnerability assessment, especially in developing countries
               </li>
               <li>Generation of early warning information
               </li>
               </ul>">
            <div class="topic-04 icon-c">
            </div>
            <div class="icon-text-c">
              Agro-climatology
            </div>
          </div>
        </div>
        <div class="profile-detail-2">
          <div class="icon-container-d2" title="<ul>
               <li>Water policy development
               </li>
               <li>Policy making and adaptation planning
               </li>
               <li>Custom analyses for specific places to support adaptation planning
               </li>
               <li>Land-use planning
               </li>
               <li>Adaptative capacity enhancement in developing countries
               </li>
               </ul>">
            <div class="topic-05 icon-c">
            </div>
            <div class="icon-text-c">
              Ecosystem functioning
            </div>
          </div>
          <div id="policy" class="icon-container-d2" title="<ul>
               <li>Inform decision making at national level or local/community level
               </li>
               <li>Adaptative capacity enhancement in developing countries
               </li>
               <li>Government planning purposes
               </li>
               <li>Inform design of CC adaptation interventions/measure by governmental bodies
               </li>
               </ul>">
            <div class="topic-10 icon-c">
            </div>
            <div class="icon-text-c">
              Other impact assessments
            </div>
          </div>
        </div>
<!--        <div class="buttons">
          <div class="buttons-c">
          <a id="goback" class="gotoclimate">Back</a>
          <a id="gotoclimate" class="gotoclimate">Return to Website</a>
          </div>
        </div>-->
      </div>
    </div>
    <?php
    break;
  case 3:
    ?>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <h2><strong>Who are you?</strong></h2>
        <div id="academic" class="icon-container-d">
          <div class="academic icon-l">
          </div>
          <div class="icon-text-l">
            Academic
          </div>
        </div>
      </div>
      <div class="profile-detail">
        <div class="profile-detail-1">
          <div class="icon-container-d1" title="<ul>
               <li>Influence of the progressive climate change over agriculture
               </li>
               <li>Vulnerability assessment especially in developing countries
               </li>
               <li>Primary data for specific modeling uses (e.g. DSSAT, APSIM, EPIC, etc)
               </li></ul>">
            <div class="topic-02 icon-c">
            </div>
            <div class="icon-text-c">
              Agriculture
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Ecology and species distribution
               </li>
               <li>Shifting the focus of a crop breeding program
               </li>
               <li>Modeling of the situation of economic cultures and rainforest species
               </li>
               </ul>">
            <div class="topic-03 icon-c">
            </div>
            <div class="icon-text-c">
              Biodiversity & Genetic
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Climate dynamics
               </li>
               <li>Understanding downscaled climate modeling in order to create more robust impact assessments 
               </li>
               <li>Generation of early warning information
               </li></ul>">
            <div class="topic-04 icon-c">
            </div>
            <div class="icon-text-c">
              Agro-climatology
            </div>
          </div>
        </div>
        <div class="profile-detail-2">
          <div class="icon-container-d2" title="<ul>
               <li>Hydrological modeling
               </li>
               <li>Study of climate change at regional or country-level for informing decision makers
               </li>
               <li>Adaptative capacity enhancement in developing countries
               </li>
               <li>Primary data for specific modeling uses (e.g. SWAT, InVEST, RIOS, etc)
               </li>
               </ul>">
            <div class="topic-05 icon-c">
            </div>
            <div class="icon-text-c">
              Ecosystem functioning
            </div>
          </div>
          <div id="policy" class="icon-container-d2" title="<ul>
               <li>Capacity building / Academia (teaching, Master, PhD)
               </li>
               </ul>">
            <div class="topic-08 icon-c">
            </div>
            <div class="icon-text-c">
              Academia
            </div>
          </div>
        </div>
<!--        <div class="buttons">
          <div class="buttons-c">
          <a id="goback" class="gotoclimate">Back</a>
          <a id="gotoclimate" class="gotoclimate">Return to Website</a>
          </div>
        </div>-->
      </div>
    </div>
    <?php
    break;
  case 4:
    ?>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <h2><strong>Who are you?</strong></h2>
        <div id="researcher" class="icon-container-d">
          <div class="researcher icon-l">
          </div>
          <div class="icon-text-l">
            Researcher
          </div>
        </div>
      </div>
      <div class="profile-detail">
        <div class="profile-detail-1">
          <div class="icon-container-d1" title="<ul>
               <li>Influence of the progressive climate change over agriculture 
               </li>
               <li>Primary data for specific modeling uses (e.g. DSSAT, APSIM, EPIC, etc)
               </li></ul>">
            <div class="topic-02 icon-c">
            </div>
            <div class="icon-text-c">
              Agriculture
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Ecology and species distribution
               </li>
               <li>Shifting the focus of a crop breeding program
               </li>
               </ul>">
            <div class="topic-03 icon-c">
            </div>
            <div class="icon-text-c">
              Biodiversity & Genetic
            </div>
          </div>
          <div class="icon-container-d1" title="<ul>
               <li>Climate dynamics
               </li>
               <li>Understanding downscaled climate modeling in order to create more robust impact assessments 
               </li>
               <li>Generation of early warning information
               </li></ul>">
            <div class="topic-04 icon-c">
            </div>
            <div class="icon-text-c">
              Agro-climatology
            </div>
          </div>
        </div>
        <div class="profile-detail-2">
          <div class="icon-container-d2" title="<ul>
               <li>Primary data for specific modeling uses (e.g. SWAT, InVEST, RIOS, etc)
               </li>
               <li>Study of climate change at regional or country-level for informing decision makers
               </li>
               </ul>">
            <div class="topic-05 icon-c">
            </div>
            <div class="icon-text-c">
              Ecosystem functioning
            </div>
          </div>
          <div id="policy" class="icon-container-d2" title="<ul>
               <li>Vulnerability assessment especially in developing countries
               </li>
               </ul>">
            <div class="topic-06 icon-c">
            </div>
            <div class="icon-text-c">
              Other impact assessments
            </div>
          </div>
        </div>
<!--        <div class="buttons">
          <div class="buttons-c">
          <a id="goback" class="gotoclimate">Back</a>
          <a id="gotoclimate" class="gotoclimate">Return to Website</a>
          </div>
        </div>-->
      </div>
    </div>
    <?php
    break;
  default:
    break;
}