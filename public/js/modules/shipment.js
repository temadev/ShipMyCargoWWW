(function ($, window, document) {

  $(function () {

    var warehouse = $('#warehouse');

    $('#warehousing').on('change', function () {
      if (this.checked) {
        warehouse.show();
      } else {
        warehouse.hide();
      }
    });

  });

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
      fields: {
        booking_point: {
          validators: {
            notEmpty: {
              message: 'Please enter your Booking Point.'
            }
          }
        },
        delivery_point: {
          validators: {
            notEmpty: {
              message: 'Please enter your Delivery Point.'
            }
          }
        }
      }
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
          url: '/shipment',
          success: function (result) {
            if (result.valid === true) {
              window.location.href = '/shipment/' + result.id;
            }
            if (result.login) {
              window.location.href = '/auth/login';
            }
          }
        });

      });

    $('#enquiryForm').bootstrapValidator({
      container: 'tooltip',
      feedbackIcons: {
        valid: 'fa fa-check',
        invalid: 'fa fa-times',
        validating: 'fa fa-refresh'
      },
      live: 'submitted',
      fields: {
        email: {
          validators: {
            notEmpty: {
              message: 'Please enter your Email address.'
            }
          }
        },
        phone: {
          validators: {
            notEmpty: {
              message: 'Please enter your Phone number.'
            }
          }
        },
        name: {
          validators: {
            notEmpty: {
              message: 'Please enter your Name.'
            }
          }
        }
      }
    })
      .on('success.form.bv', function (e) {

        e.preventDefault();

        var $form = $(e.target),
          validator = $form.data('bootstrapValidator'),
          submitButton = validator.getSubmitButton();

        submitButton.attr('disabled', true).html('<i class="fa fa-spin fa-circle-o-notch"></i> Please Wait...');

        $.ajax({
          type: 'post',
          data: $form.serializeJSON(),
          contentType: 'application/json',
          url: '/enquiry',
          success: function (result) {
            submitButton.html('Send Enquiry');
            setTimeout(function () {
              $('#modalEnquiry').modal('hide');
            }, 1000);
          },
          error: function (result) {
            submitButton.html('Send Enquiry');
          }
        });

      });

  });

}(jQuery, window, document));
