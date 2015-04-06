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
        formbox.load('/form_commercial?category=' + $this.val());
      }
    });
    $.fn.getNumBids = function () {
      var that = this;
      var id = this.selector.split('_')[2];
      $.ajax({
        type: 'post',
        data: {id: id},
        url: '/bid/num_bids',
        success: function (result) {
          if (result.valid == true) {
            $(that.selector).html(result.num);
          } else {
            $(that.selector).html('—');
          }
        }
      });
      return this;
    };
    $.fn.getLowestBid = function () {
      var that = this;
      var id = this.selector.split('_')[2];
      $.ajax({
        type: 'post',
        data: {id: id},
        url: '/bid/lowest_bid',
        success: function (result) {
          if (result.valid == true) {
            console.log(result.bid);
            $(that.selector).html(result.bid);
          } else {
            $(that.selector).html('—');
          }
        }
      });
      return this;
    };
  });
}(jQuery, window, document));