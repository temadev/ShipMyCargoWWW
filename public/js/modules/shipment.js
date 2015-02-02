(function ($, window, document) {

  $(function () {

    if (!$.fn.bootstrapValidator) return;

    $('#shipmentForm').bootstrapValidator({
      container: 'tooltip',
      feedbackIcons: {
        valid: 'fa fa-check',
        invalid: 'fa fa-times',
        validating: 'fa fa-refresh'
      },
      live: 'submitted',
      fields: {}
    })
      .on('success.form.bv', function (e) {

        e.preventDefault();

        var $form = $(e.target),
          validator = $form.data('bootstrapValidator'),
          submitButton = validator.getSubmitButton();

        $.ajax({
          type: 'post',
          data: $form.serializeJSON(),
          contentType: 'application/json',
          url: '/shipment/create',
          success: function (result) {
            if (result.valid === true) {
              window.location.href = '/shipment/' + result.id;
            }
          }
        });

      });

  });

}(jQuery, window, document));
