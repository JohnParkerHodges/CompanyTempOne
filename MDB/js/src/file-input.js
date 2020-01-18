(function ($) {

  $(document).on('change', '.file-field input[type="file"]',  (e) => {

    const $this       = $(e.target);
    const $fileField = $this.closest('.file-field');
    const $pathInput = $fileField.find('input.file-path');
    const files       = $this[0].files;
    const fileNames  = [];
    files.forEach((file) => fileNames.push(file.name));
    $pathInput.val(fileNames.join(', '));
    $pathInput.trigger('change');

  });

}(jQuery));
