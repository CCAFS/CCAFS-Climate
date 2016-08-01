$(document).ready(function() {

  $(document).tooltip({
    position: {
      my: "center bottom-20",
      at: "center top",
      using: function(position, feedback) {
        $(this).css(position);
        $("<div>")
                .addClass("arrow")
                .addClass(feedback.vertical)
                .addClass(feedback.horizontal)
                .appendTo(this);
      }
    },
    items: "[title]",
    content: function() {
      var element = $(this);
      if (element.is("[title]")) {
        return element.attr("title");
      }
    }
  });

  $("#gotoclimate").on('click', function() {
    closeLandingPage();
  });

  $("#profiles").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 0},
      success: function(data) {
        $("#whatisamkn").html(data);
        $("#goback1").show();
      }
    });
  });
  
  $("#goback").on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/user-profiles.php",
      data: {profile: 0},
      success: function(data) {
        $("#whatisamkn").html(data);
        $("#goback").hide();
        $("#goback1").show();
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
        $("#goback").hide();
        $("#goback1").hide();
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

  $("#chk_showmsg").on('change', function() {
    applyShowMsg();
  });

  $(".color").hover(
    function() {
      $(this).stop().css({'z-index': '10'}).animate({
        "width": "151.68px",
        "height": "336px",
        "top": "-23px",
        "left": "-8px"
      }, "fast");
    },
    function() {
      $(this).stop().css({'z-index': '1'}).animate({
        "width": "140px", //126.4px",
        "height": "300px",//"280px",
        "top": "0",
        "left": "0"
      }, "fast");
  });
  var a = getCookie("showmsg");
  if (null != a && "" != a && "true" == a) {
    //noticeInitial();
  } else {
    // Remodal-master http://vodkabears.github.io/remodal/ 
    openLandingPage();
  }
  function openLandingPage() {
    $('.remodal').show();
    inst = $('[data-remodal-id=modal]').remodal({"hashTracking": false});
    inst.open();
  }
  function closeLandingPage() {
    inst.close();
    //noticeInitial();
  }
  function applyShowMsg() {
    showmsg = document.getElementById("chk_showmsg").checked, null != showmsg && "" != showmsg && setCookie("showmsg", showmsg, 365)
  }
  function getCookie(a) {
    var b = document.cookie, c = b.indexOf(" " + a + "=");
    if (-1 == c && (c = b.indexOf(a + "=")), -1 == c)
      b = null;
    else {
      c = b.indexOf("=", c) + 1;
      var d = b.indexOf(";", c);
      -1 == d && (d = b.length), b = unescape(b.substring(c, d))
    }
    return b
  }
  function setCookie(a, b, c) {
    var d = new Date;
    d.setDate(d.getDate() + c);
    var e = escape(b) + (null == c ? "" : "; expires=" + d.toUTCString());
    document.cookie = a + "=" + e
  }
});