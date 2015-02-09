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
        live: 'submitted',
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
      live: 'submitted',
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

  });
}(jQuery, window, document));
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
(function ($, window, document) {

  $(function () {

    var personAdd = $('#personAdd')
      , personDel = $('#personDel');

    personAdd.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedInput').length
        , newNum = (num + 1)
        , person = $('#person' + num)
        , newElem = person.clone().attr('id', 'person' + newNum);
      newElem.children('div').children(':eq(0)').attr('id', 'personFirstname' + newNum).attr('name', 'person[' + num + '][firstname]');
      newElem.children('div').children(':eq(1)').attr('id', 'personLastname' + newNum).attr('name', 'person[' + num + '][lastname]');
      newElem.children('div').children(':eq(2)').attr('id', 'personPhone' + newNum).attr('name', 'person[' + num + '][phone]');
      newElem.children('div').children(':eq(3)').attr('id', 'personEmail' + newNum).attr('name', 'person[' + num + '][email]');
      newElem.children('div').children(':eq(4)').attr('id', 'personDesignation' + newNum).attr('name', 'person[' + num + '][designation]');
      person.after(newElem);
      personDel.attr('disabled', false);
      if (newNum == 10)
        personAdd.attr('disabled', 'disabled');
    });

    personDel.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedInput').length;
      $('#person' + num).remove();
      personAdd.attr('disabled', false);
      if (num - 1 == 1)
        $('#personDel').attr('disabled', 'disabled');
    });

    personDel.attr('disabled', 'disabled');

  });


  $(function () {

    if (!$.fn.bootstrapValidator) return;

    $('#companyForm').bootstrapValidator({
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
          url: '/company/create',
          success: function (result) {
            if (result.valid === true) {
              window.location.href = '/company/' + result.id;
            }
          }
        });

      });

  });


  $(function () {

    $('.removeCompany').on('click', function (e) {
      e.preventDefault();
      $.ajax({
        type: 'post',
        data: {id: $(this).data('id')},
        url: '/company/remove',
        success: function (result) {
          if (result.valid === true) {
            window.location.href = '/company';
          }
        }
      });
    });

  });

}(jQuery, window, document));

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
