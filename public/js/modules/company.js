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

}(jQuery, window, document));
