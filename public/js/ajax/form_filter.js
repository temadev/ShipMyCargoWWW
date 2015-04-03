(function ($, window, document) {

  $(function () {

    var requests = $('#requests');

    requests.html('<p class="lead text-center"><i class="fa fa-spinner fa-spin"></i> Please wait...</p>');

    requests.load('/request/ajax', {});

    $('#formFilter')
      .on('change', 'select.form-control', function (e) {
        $(this).submit();
      })
      .on('submit', function (e) {
        e.preventDefault();
        var $this = $(this);

        console.log(JSON.parse($this.serializeJSON()));

        requests.html('<p class="lead text-center"><i class="fa fa-spinner fa-spin"></i> Please wait...</p>');
        requests.load('/request/ajax', JSON.parse($this.serializeJSON()));
      });

  });

}(jQuery, window, document));
