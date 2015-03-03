(function ($, window, document) {

  $(function () {

    $('#bookingPoint').autocomplete({
      serviceUrl: '/api/cities'
    });

    $('#deliveryPoint').autocomplete({
      serviceUrl: '/api/cities'
    });

    $('.datetimepicker').datetimepicker({
      format: 'L',
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-arrow-up',
        down: 'fa fa-arrow-down',
        previous: 'fa fa-long-arrow-left',
        next: 'fa fa-long-arrow-right'
      }
    });

    $('#items').find('tbody').append(itemRow(1));

    $('#itemAdd').on('click', function (e) {
      e.preventDefault();
      var items = $('#items')
        , i = items.find('.item').length
        , newItem = itemRow(i + 1);
      items.find('tbody').append(newItem);
    });

    $(document).on('click', '.itemRemove', function (e) {
      e.preventDefault();
      $(this).parents('tr.item').remove();
      weightUpdate();
    });

    function itemRow(i) {
      return '<tr class="item" data-item="' + i + '">'
        + '<td>' + handlingUnit(i) + '</td>'
        + '<td>' + itemInput(i, "length") + '</td>'
        + '<td>' + itemInput(i, "breadth") + '</td>'
        + '<td>' + itemInput(i, "height") + '</td>'
        + '<td><div class="radio c-radio">'
        + '<label class="radio-inline"><input type="radio" name="items[' + i + '][measure]" value="inch" checked><span class="fa fa-check"></span>&nbsp;inch</label>'
        + '<label class="radio-inline"><input type="radio" name="items[' + i + '][measure]" value="cm"><span class="fa fa-check"></span>&nbsp;cm</label>'
        + '</div></td>'
        + '<td><div class="input-group">' + itemInput(i, "weight", "weight") + '<div class="input-group-addon">kg</div></div></td>'
        + '<td>' + itemInput(i, "units", "units") + '</td>'
        + '<td><a class="btn btn-default itemRemove" href="#"><i class="fa fa-trash-o"></i></a></td>'
        + '</tr>';

      function handlingUnit(i) {
        var units = ['Pallets', 'Boxes', 'Cartons', 'Crates', 'Drums', 'Bags', 'Bales', 'Cans', 'Carboys', 'Carpets', 'Cases', 'Coils', 'Cylinders', 'Loose', 'Pails', 'Reels', 'Rolls', 'Tubes/Pipes', 'Other']
          , options = '';
        $.each(units, function (i, val) {
          options += '<option>' + val + '</option>';
        });
        return '<select class="form-control" name="items[' + i + '][unit]">' + '<option selected disabled>Please Select</option>' + options + '</select>';
      }

      function itemInput(i, name, className) {
        if (typeof className === 'undefined')
          return '<input type="text" name="items[' + i + '][' + name + ']" class="form-control">';
        else
          return '<input type="text" name="items[' + i + '][' + name + ']" class="form-control ' + className + '">';
      }
    }

    weightUpdate();

    $(document).on('keyup', '.weight', function (e) {
      weightUpdate();
    });

    $(document).on('keyup', '.units', function (e) {
      weightUpdate();
    });

    function weightUpdate() {
      var items = $('#items').find('.item')
        , totalWeight = 0;
      $.each(items, function () {
        var weight = $(this).find('.weight')
          , units = $(this).find('.units');

        if (weight.val() !== "" && !isNaN(weight.val()) && units.val() !== "" && !isNaN(units.val()))
          totalWeight += parseFloat(weight.val() * units.val(), 10);
        else if (weight.val() !== "" && !isNaN(weight.val()))
          totalWeight += parseFloat(weight.val(), 10);
      });
      $('#totalWeight').val(isNaN(totalWeight) ? 0 : totalWeight);
    }

    $('#shipmentForm')
      .bootstrapValidator({
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
                message: 'Please fill this'
              }
            }
          },
          delivery_point: {
            validators: {
              notEmpty: {
                message: 'Please fill this'
              }
            }
          },
          booking_pincode: {
            validators: {
              digits: {
                message: 'Only digits allowed here'
              }
            }
          },
          delivery_pincode: {
            validators: {
              digits: {
                message: 'Only digits allowed here'
              }
            }
          },
          total_value: {
            validators: {
              notEmpty: {
                message: 'Please fill this'
              }
            }
          }
        }
      })
      .on('success.field.bv', function(e, data) {
        var $parent = data.element.parents('.form-group');
        $parent.removeClass('has-success');
        data.element.data('bv.icon').hide();
      })
      .on('success.form.bv', function (e, data) {
        e.preventDefault();

        var $form = $(e.target);

        $.ajax({
          type: 'post',
          data: $form.serializeJSON(),
          contentType: 'application/json',
          url: '/request',
          success: function (result) {
            if (result.valid === true) {
              if (result.login) {
                window.location.href = '/auth/login';
              } else {
                window.location.href = '/request/' + result.id;
              }
            }
          }
        });

      });

  });

}(jQuery, window, document));
