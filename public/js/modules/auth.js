(function ($, window, document) {
  $(function () {

    if (!$.fn.bootstrapValidator) return;

    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    $('#captchaOperation').html([randomNumber(1, 50), '+', randomNumber(1, 10), '='].join(' '));

    $('#registerForm')
      .bootstrapValidator({
        container: 'tooltip',
        feedbackIcons: {
          valid: 'fa fa-check',
          invalid: 'fa fa-times',
          validating: 'fa fa-refresh'
        },
        live: 'disabled',
        fields: {
          email: {
            validators: {
              notEmpty: {
                message: 'Please enter a valid email address.'
              },
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
          password: {
            validators: {
              notEmpty: {
                message: 'Passwords must be at least 6 characters.'
              },
              stringLength: {
                min: 6,
                max: 20,
                message: 'Passwords must be at least 6 characters.'
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
          },
          phone: {
            validators: {
              notEmpty: {
                message: 'Please enter your phone number.'
              }
            }
          },
          captcha: {
            validators: {
              callback: {
                message: 'Wrong answer.',
                callback: function (value, validator) {
                  var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
                  return value == sum;
                }
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

        $.post('/auth/register', $form.serialize(), function (result) {
          if (result.valid == true || result.valid == 'true') {
            window.location.href = '/';
          }
        }, 'json');
      });

    $('#loginForm').bootstrapValidator({
      container: 'tooltip',
      feedbackIcons: {
        valid: 'fa fa-check',
        invalid: 'fa fa-times',
        validating: 'fa fa-refresh'
      },
      live: 'disabled',
      fields: {
        loginEmail: {
          validators: {
            notEmpty: {
              message: 'Enter your email to sign in.'
            },
            emailAddress: {
              message: 'Enter your email to sign in.'
            },
            remote: {
              type: 'POST',
              url: '/auth/getUser',
              data: function (validator) {
                return {
                  loginEmail: validator.getFieldElements('loginEmail').val()
                };
              }
            }
          }
        },
        loginPassword: {
          validators: {
            notEmpty: {
              message: 'Enter your password to sign in.'
            },
            remote: {
              type: 'POST',
              url: '/auth/login',
              data: function (validator) {
                return {
                  loginEmail: validator.getFieldElements('loginEmail').val(),
                  loginPassword: validator.getFieldElements('loginPassword').val()
                };
              }
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

        $.post('/auth/login', $form.serialize(), function (result) {
          if (result.valid == true || result.valid == 'true') {
            window.location.href = '/';
          }
        }, 'json');
      });

    $('#completeForm')
      .bootstrapValidator({
        container: 'tooltip',
        feedbackIcons: {
          valid: 'fa fa-check',
          invalid: 'fa fa-times',
          validating: 'fa fa-refresh'
        },
        live: 'disabled',
        fields: {
          email: {
            validators: {
              notEmpty: {
                message: 'Please enter a valid email address.'
              },
              emailAddress: {
                message: 'Please enter a valid email address.'
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: 'Passwords must be at least 6 characters.'
              },
              stringLength: {
                min: 6,
                max: 20,
                message: 'Passwords must be at least 6 characters.'
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
          },
          phone: {
            validators: {
              notEmpty: {
                message: 'Please enter your phone number.'
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

        $.post('/auth/complete', $form.serialize(), function (result) {
          if (result.valid == true || result.valid == 'true') {
            window.location.href = '/';
          }
        }, 'json');
      });

  });
}(jQuery, window, document));