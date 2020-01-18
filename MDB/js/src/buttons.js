(function ($) {

  $(document).ready(() => {

    $.fn.reverse = [].reverse;

    $(document).on('mouseenter.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function () {

      const $this = $(this);
      openFABMenu($this);
    });

    $(document).on('mouseleave.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function () {

      const $this = $(this);
      closeFABMenu($this);
    });

    $(document).on('click.fixedActionBtn', '.fixed-action-btn.click-to-toggle > a', function () {

      const $this = $(this);
      const $menu = $this.parent();

      if ($menu.hasClass('active')) {

        closeFABMenu($menu);
      } else {

        openFABMenu($menu);
      }
    });
  });

  $.fn.extend({
    openFAB() {

      openFABMenu($(this));
    },
    closeFAB() {

      closeFABMenu($(this));
    }
  });

  const openFABMenu = (btn) => {

    const fab = btn;
    if (!fab.hasClass('active')) {

      fab.addClass('active');
      const btnList = document.querySelectorAll('ul .btn-floating');
      btnList.forEach((el) => {

        el.classList.add('shown');
      });

    }
  };

  const closeFABMenu = (btn) => {

    const fab = btn;

    fab.removeClass('active');
    const btnList = document.querySelectorAll('ul .btn-floating');
    btnList.forEach((el) => {

      el.classList.remove('shown');
    });
  };

  $('.fixed-action-btn').on('click', (e) => {

    e.preventDefault();
    toggleFABMenu($('.fixed-action-btn'));

    return false;
  });

  function toggleFABMenu(btn) {

    const elem = btn;

    if (elem.hasClass('active')) {

      closeFABMenu(elem);
    } else {

      openFABMenu(elem);
    }
  }

}(jQuery));
