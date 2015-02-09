(function ($, window, document) {

  $(function () {

    if (!$.fn.autocomplete) return;

    $('#bookingPoint').autocomplete({
      serviceUrl: '/api/cities',
      onSelect: function (suggestion) {
        console.log(suggestion);
        //window.location.href = suggestion.url;
      }
    });

    $('#deliveryPoint').autocomplete({
      serviceUrl: '/api/cities',
      onSelect: function (suggestion) {
        console.log(suggestion);
        //window.location.href = suggestion.url;
      }
    });

  });


}(jQuery, window, document));