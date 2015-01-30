(function ($, window, document) {

  $(function () {

    $('body').on('hidden.bs.modal', '.modal', function () {
      $(this).removeData('bs.modal');
    });

    $('.logout').on('click', function (e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: '/auth/logout',
        success: function () {
          window.location.href = '/';
        }
      });
    });

  });

}(jQuery, window, document));
