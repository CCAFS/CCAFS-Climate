var stations = 1
$(document).ready(function() {
  $('#submit-station').on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/data-station.php",
      data: $('#station-form').serialize(),
      success: function(data) {
        if (data == '1') {
          alert('success');
        } else {
          alert('error');
        }
      },
      error: function(e, st, th) {
        alert(st + '/' + th);
      }
    });
  });
  $('#agregar-estacion').on('click', function() {
    $.ajax({
      type: "POST",
      dataType: "text",
      url: "/ajax/geostation-line.php",
      data: {id: stations},
      success: function(data) {
        $("#station-tab").append(data);
        stations++;
        $("#stations-count").val(stations);
      },
      error: function(e, st, th) {
        alert(st + '/' + th);
      }
    });
  }
  );
}
);