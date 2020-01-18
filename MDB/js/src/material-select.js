(function ($) {

  const toggleEntryFromArray = function (entriesArray, entryIndex, select) {

    const index = entriesArray.indexOf(entryIndex);
    const notAdded = index === -1;

    if (notAdded) {

      entriesArray.push(entryIndex);
    } else {

      entriesArray.splice(index, 1);
    }

    select.siblings('ul.dropdown-content').find('li:not(.optgroup)').eq(entryIndex).toggleClass('active');

    select.find('option').eq(entryIndex).prop('selected', notAdded);
    setValueToInput(entriesArray, select);

    return notAdded;
  };

  const setValueToInput = function (entriesArray, select) {

    let value = '';

    for (let count = entriesArray.length, i = 0; i < count; i++) {

      const text = select.find('option').eq(entriesArray[i]).text();

      if (i === 0) {

        value += text;
      } else {

        value += `, ${text}`;
      }
    }

    if (value === '') {

      value = select.find('option:disabled').eq(0).text();
    }

    select.siblings('input.select-dropdown').val(value);
  };

  const guid = function () {

    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  };

  const appendOptionWithIcon = function (options, option, type) {

    const disabledClass = option.is(':disabled') ? 'disabled ' : '';
    const optgroupClass = type === 'optgroup-option' ? 'optgroup-option ' : '';

    const iconUrl = option.data('icon');
    const classes = option.attr('class');
    if (iconUrl) {

      let classString = '';
      if (classes) {

        classString = ` class="${classes}"`;
      }

      if (type === 'multiple') {

        options.append($(`<li class="${disabledClass}"><img alt="" src="${iconUrl}"${classString}><span class="filtrable"><input type="checkbox"${disabledClass}/><label></label>${option.html()}</span></li>`));
      } else {

        options.append($(`<li class="${disabledClass}${optgroupClass}"><img alt="" src="${iconUrl}"${classString}><span class="filtrable">${option.html()}</span></li>`));
      }

      return true;
    }

    if (type === 'multiple') {

      options.append($(`<li class="${disabledClass}"><span class="filtrable"><input type="checkbox"${disabledClass}/><label></label>${option.html()}</span></li>`));
    } else {

      options.append($(`<li class="${disabledClass}${optgroupClass}"><span class="filtrable">${option.html()}</span></li>`));
    }
  };


  const applySeachInList = function () {

    const $this = $(this);
    const ul = $this.closest('ul');
    const searchValue = $this.val();
    const opts = ul.find('li span.filtrable');

    opts.each(function () {

      const $option = $(this);
      if (typeof this.outerHTML === 'string') {

        const liValue = this.textContent.toLowerCase();

        if (liValue.indexOf(searchValue.toLowerCase()) === -1) {

          $option.hide().parent().hide();
        } else {

          $option.show().parent().show();
        }
      }
    });
  };

  const setSearchableOption = function ($select, options) {

    const placeholder = $select.attr('searchable');
    const element = $(`<span class="search-wrap ml-2"><div class="md-form mt-0"><input type="text" class="search form-control" placeholder="${placeholder}"></div></span>`);

    options.append(element);
    element.find('.search').keyup(applySeachInList);
  };

  $.fn.material_select = function (callback) {

    $(this).each(function () {

      const $select = $(this);

      if ($select.hasClass('browser-default')) {
        return;
      }

      const multiple = Boolean($select.attr('multiple'));
      const lastID = $select.data('select-id');

      if (lastID) {

        $select.parent().find('span.caret').remove();
        $select.parent().find('input').remove();

        $select.unwrap();
        $(`ul#select-options-${lastID}`).remove();
      }

      if (callback === 'destroy') {

        $select.data('select-id', null).removeClass('initialized');
        return;
      }

      const uniqueID = guid();
      $select.data('select-id', uniqueID);

      const wrapper = $('<div class="select-wrapper"></div>');
      wrapper.addClass($select.attr('class'));

      const options = $(`<ul id="select-options-${uniqueID}" class="dropdown-content select-dropdown ${multiple ? 'multiple-select-dropdown' : ''}"></ul>`);
      const selectChildren = $select.children('option, optgroup');
      const valuesSelected = [];

      const label = $select.find('option:selected').html() || $select.find('option:first').html() || '';
      const searchable = Boolean($select.attr('searchable'));

      let optionsHover = false;

      if (searchable) {
        setSearchableOption($select, options);
      }

      const appendOptionWithIcon = function (options, option, type) {

        const disabledClass = option.is(':disabled') ? 'disabled ' : '';
        const optgroupClass = type === 'optgroup-option' ? 'optgroup-option ' : '';

        const iconUrl = option.data('icon');
        const classes = option.attr('class');
        if (iconUrl) {

          let classString = '';
          if (classes) {

            classString = ` class="${classes}"`;
          }

          if (type === 'multiple') {

            options.append($(`<li class="${disabledClass}"><img alt="" src="${iconUrl}"${classString}><span class="filtrable"><input type="checkbox"${disabledClass}/><label></label>${option.html()}</span></li>`));
          } else {

            options.append($(`<li class="${disabledClass}${optgroupClass}"><img alt="" src="${iconUrl}"${classString}><span class="filtrable">${option.html()}</span></li>`));
          }

          return true;
        }

        if (type === 'multiple') {

          options.append($(`<li class="${disabledClass}"><span class="filtrable"><input type="checkbox"${disabledClass}/><label></label>${option.html()}</span></li>`));
        } else {

          options.append($(`<li class="${disabledClass}${optgroupClass}"><span class="filtrable">${option.html()}</span></li>`));
        }
      };

      if (selectChildren.length) {

        selectChildren.each(function () {

          const $this = $(this);
          if ($this.is('option')) {

            if (multiple) {

              appendOptionWithIcon(options, $this, 'multiple');
            } else {

              appendOptionWithIcon(options, $this);
            }
          } else if ($this.is('optgroup')) {

            const selectOptions = $this.children('option');
            options.append($(`<li class="optgroup"><span>${$this.attr('label')}</span></li>`));

            selectOptions.each(function () {

              appendOptionWithIcon(options, $(this), 'optgroup-option');
            });
          }
        });
      }

      const hasOptgroup = Boolean($select.find('optgroup').length);

      const saveSelect = $select.parent().find('button.btn-save');
      if (saveSelect.length) {

        saveSelect.on('click', () => {

          $('input.select-dropdown').trigger('close');
        });
      }

      options.find('li:not(.optgroup)').each(function (i) {

        $(this).click(function (e) {

          const $this = $(this);

          if (!$this.hasClass('disabled') && !$this.hasClass('optgroup')) {

            let selected = true;

            if (multiple) {

              $('input[type="checkbox"]', this).prop('checked', (i, v) => {
                return !v;
              });

              if (searchable) {

                if (hasOptgroup) {

                  selected = toggleEntryFromArray(valuesSelected, $this.index() - $this.prevAll('.optgroup').length - 1, $select);
                } else {

                  selected = toggleEntryFromArray(valuesSelected, $this.index() - 1, $select);
                }
              } else if (hasOptgroup) {

                selected = toggleEntryFromArray(valuesSelected, $this.index() - $this.prevAll('.optgroup').length, $select);
              } else {

                selected = toggleEntryFromArray(valuesSelected, $this.index(), $select);
              }

              $newSelect.trigger('focus');
            } else {

              options.find('li').removeClass('active');
              $this.toggleClass('active');
              $newSelect.val($this.text());
            }

            activateOption(options, $this);
            $select.find('option').eq(i).prop('selected', selected);
            $select.trigger('change');

            if (typeof callback !== 'undefined') {

              callback();
            }
          }

          e.stopPropagation();
        });
      });

      $select.wrap(wrapper);
      const dropdownIcon = $('<span class="caret">&#9660;</span>');
      if ($select.is(':disabled')) {

        dropdownIcon.addClass('disabled');
      }

      const sanitizedLabelHtml = label.replace(/"/g, '&quot;');

      const $newSelect = $(`<input type="text" class="select-dropdown" readonly="true" ${$select.is(':disabled') ? 'disabled' : ''} data-activates="select-options-${uniqueID}" value="${sanitizedLabelHtml}"/>`);
      $select.before($newSelect);
      $newSelect.before(dropdownIcon);

      $newSelect.after(options);
      if (!$select.is(':disabled')) {

        $newSelect.dropdown({
          hover: false,
          closeOnClick: false
        });
      }

      if ($select.attr('tabindex')) {

        $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
      }

      $select.addClass('initialized');

      $newSelect.on({
        focus() {

          const $this = $(this);
          if ($('ul.select-dropdown').not(options[0]).is(':visible')) {

            $('input.select-dropdown').trigger('close');
          }

          if (!options.is(':visible')) {

            $this.trigger('open', ['focus']);

            const label = $this.val();
            const selectedOption = options.find('li').filter(function () {

              return $(this).text().toLowerCase() === label.toLowerCase();
            })[0];

            activateOption(options, selectedOption);
          }
        },
        click(e) {

          e.stopPropagation();
        }
      });

      $newSelect.on('blur', function () {

        if (!multiple && !searchable) {

          $(this).trigger('close');
        }

        options.find('li.selected').removeClass('selected');
      });

      if (!multiple && searchable) {

        options.find('li').on('click', () => {

          $newSelect.trigger('close');
        });
      }

      options.hover(() => {

        optionsHover = true;
      }, () => {

        optionsHover = false;
      });

      options.on('mousedown', function (e) {

        if ($('.modal-content').find(options).length) {

          if (this.scrollHeight > this.offsetHeight) {

            e.preventDefault();
          }
        }
      });

      $(window).on({

        click() {

          (multiple || searchable) && (optionsHover || $newSelect.trigger('close'));
        }
      });

      if (multiple) {

        $select.find('option:selected:not(:disabled)').each(function () {

          const index = $(this).index();

          toggleEntryFromArray(valuesSelected, index, $select);
          options.find('li').eq(index).find(':checkbox').prop('checked', true);
        });
      }

      const activateOption = function (collection, newOption) {

        if (newOption) {

          collection.find('li.selected').removeClass('selected');

          const option = $(newOption);
          option.addClass('selected');
        }
      };

      let filterQuery = [];
      const onKeyDown = function (e) {

        const isTab = e.which === 9;
        const isEsc = e.which === 27;
        const isEnter = e.which === 13;
        const isArrowUp = e.which === 38;
        const isArrowDown = e.which === 40;

        if (isTab) {
          $newSelect.trigger('close');
          return;
        }

        if (isArrowDown && !options.is(':visible')) {
          $newSelect.trigger('open');
          return;
        }

        if (isEnter && !options.is(':visible')) {
          return;
        }

        e.preventDefault();

        // CASE WHEN USER TYPE LETTERS
        const letter = String.fromCharCode(e.which).toLowerCase();
        const nonLetters = [9, 13, 27, 38, 40];

        const isLetterSearchable = letter && nonLetters.indexOf(e.which) === -1;

        if (isLetterSearchable) {

          filterQuery.push(letter);

          const string = filterQuery.join('');
          const newOption = options.find('li').filter(function () {

            return $(this).text().toLowerCase().indexOf(string) === 0;
          })[0];

          if (newOption) {

            activateOption(options, newOption);
          }
        }

        if (isEnter) {

          const activeOption = options.find('li.selected:not(.disabled)')[0];
          if (activeOption) {

            $(activeOption).trigger('click');
            if (!multiple) {

              $newSelect.trigger('close');
            }
          }
        }

        if (isArrowDown) {

          if (options.find('li.selected').length) {

            newOption = options.find('li.selected').next('li:not(.disabled)')[0];
          } else {

            newOption = options.find('li:not(.disabled)')[0];
          }
          activateOption(options, newOption);
        }

        if (isEsc) {

          $newSelect.trigger('close');
        }

        if (isArrowUp) {

          newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
          if (newOption) {

            activateOption(options, newOption);
          }
        }

        setTimeout(() => {

          filterQuery = [];
        }, 1000);
      };

      $newSelect.on('keydown', onKeyDown);
    });
  };
}(jQuery));

jQuery('select').siblings('input.select-dropdown').on('mousedown', (e) => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
      e.preventDefault();
    }
  }
});
