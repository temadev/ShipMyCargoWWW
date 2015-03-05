(function ($, window, document) {
  $(function () {
    $('#shippingBtn').on('click', function (e) {
      e.preventDefault();
      $('#shipping').fadeIn();
    });
    $('#shipping').find('select').on('change', function (e) {
      var $this = $(this)
        , formbox = $('#formbox');
      $('#welcome').fadeOut();
      formbox.html('<p class="lead text-center"><i class="fa fa-spinner fa-spin"></i> Please wait...</p>');
      if ($this.val() === '1' || $this.val() === '2') {
        formbox.load('/form_commercial');
      }
    })
  });
}(jQuery, window, document));