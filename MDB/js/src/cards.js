(function ($) {

  $(document).on('click.card', '.card', function (e) {

    const $reveal = $(this).find('.card-reveal');

    if ($reveal.length) {

      const $clicked = $(e.target);
      const isTitle = $clicked.is('.card-reveal .card-title');
      const isTitleIcon = $clicked.is('.card-reveal .card-title i');
      const isActivator = $clicked.is('.card .activator');
      const isActivatorIcon = $clicked.is('.card .activator i');

      if (isTitle || isTitleIcon) {

        $reveal.removeClass('show');
      } else if (isActivator || isActivatorIcon) {

        $reveal.addClass('show');
      }
    }
  });

  $('.rotate-btn').on('click', function () {

    const cardId = $(this).attr('data-card');
    $(`#${cardId}`).toggleClass('flipped');
  });

  $('.card-share > a').on('click', function (e) {

    e.preventDefault();

    $(this)
      .toggleClass('share-expanded')
      .parent()
      .find('div')
      .toggleClass('social-reveal-active');
  });
}(jQuery));
