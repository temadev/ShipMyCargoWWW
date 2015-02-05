(function ($, window, document) {
  $(function () {

    if (!$.fn.bootstrapValidator) return;

    $('#profileForm')
      .bootstrapValidator({
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
              emailAddress: {
                message: 'Please enter a valid email address.'
              },
              remote: {
                type: 'POST',
                url: '/auth/checkRegister',
                data: function (validator) {
                  return {
                    email: validator.getFieldElements('email').val()
                  };
                }
              }
            }
          },
          lastname: {
            validators: {
              notEmpty: {
                message: 'Please enter your first name.'
              }
            }
          },
          firstname: {
            validators: {
              notEmpty: {
                message: 'Please enter your last name.'
              }
            }
          }
        }
      })
      .on('success.form.bv', function (e) {
        // Prevent form submission
        e.preventDefault();

        var $form = $(e.target),
          validator = $form.data('bootstrapValidator'),
          submitButton = validator.getSubmitButton();

        $.post('/profile', $form.serialize(), function (result) {
          if (result.valid == true || result.valid == 'true') {
            window.location.href = '/profile';
          }
        }, 'json');
      });

  });
}(jQuery, window, document));