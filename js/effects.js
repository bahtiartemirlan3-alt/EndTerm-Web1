'use strict';

function revealBox(element) {
  $(element).stop(true, true).hide().removeClass('d-none').slideDown(250);
}

function hideBox(element) {
  $(element).stop(true, true).slideUp(200, function () { $(this).addClass('d-none'); });
}

$(function () {

  const $backTop = $('<button type="button" class="back-top" aria-label="Back to top">&uarr;</button>')
    .hide()
    .appendTo('body');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $backTop.fadeIn(200);
    } else {
      $backTop.fadeOut(200);
    }
  });

  $backTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

  $('#featuredGrid, #fleetGrid').on('click', '.details-btn', function () {
    const $button = $(this);
    const $details = $button.closest('.car-card').find('.car-details');
    const opening = $button.attr('aria-expanded') === 'false';

    $details.stop(true, true).slideToggle(200);
    $button.attr('aria-expanded', String(opening)).text(opening ? 'Hide' : 'Details');
  });

  $('form .form-control, form .form-select').on('focus blur', function (event) {
    $(this).closest('.col-12').find('.form-label').first().toggleClass('label-active', event.type === 'focus');
  });

  $('#notes').on('input', function () {
    const left = 300 - $(this).val().length;
    $(this).next('.char-count')
      .text(left + ' characters left')
      .toggleClass('text-danger', left < 30);
  });

  $('#faqSearch').on('input', function () {
    const query = $.trim($(this).val()).toLowerCase();
    let matches = 0;

    $('#faq .accordion-item').each(function () {
      const $item = $(this);
      if ($item.text().toLowerCase().indexOf(query) !== -1) {
        matches++;
        $item.slideDown(150);
      } else {
        $item.slideUp(150);
      }
    });

    const $empty = $('#faqEmpty');
    if (matches === 0) { $empty.slideDown(150); } else { $empty.slideUp(150); }
  });

  $('#insuranceTable tbody tr').on('click', function () {
    const $row = $(this);
    const tier = getInsuranceById($row.data('plan'));
    $row.addClass('table-active').siblings().removeClass('table-active');

    $('#planInfo').stop(true, true).fadeOut(100, function () {
      $(this).find('.plan-name').text(tier.name);
      $(this).find('.plan-summary').text(tier.summary + ' ');
      $(this).find('a').attr('href', 'contact.html?insurance=' + tier.id);
      $(this).fadeIn(250);
    });
  }).on('keydown', function (event) {
    if (event.key === 'Enter') $(this).trigger('click');
  });

});
