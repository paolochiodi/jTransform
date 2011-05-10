(function() {
  var defaultOptions, jqTransformAddDocumentListener, jqTransformCheckExternalClick, jqTransformGetLabel, jqTransformHideSelect, jqTransformImgPreloaded, jqTransformPreloadHoverFocusImg, jqTransformReset;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  defaultOptions = {
    preloadImg: true
  };
  jqTransformImgPreloaded = false;
  jqTransformPreloadHoverFocusImg = function(strImgUrl) {
    var imgFocus, imgHover;
    strImgUrl = strImgUrl.replace(/^url\((.*)\)/, '$1').replace(/^\"(.*)\"$/, '$1');
    imgHover = new Image();
    imgHover.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-hover.$1');
    imgFocus = new Image();
    return imgFocus.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-focus.$1');
  };
  jqTransformGetLabel = function(objfield) {
    var inputname, oLabel, selfForm;
    selfForm = $(objfield.get(0).form);
    oLabel = objfield.next();
    if (!oLabel.is('label')) {
      oLabel = objfield.prev();
      if (oLabel.is('label')) {
        inputname = objfield.attr('id');
        if (inputname) {
          oLabel = selfForm.find('label[for="' + inputname + '"]');
        }
      }
    }
    if (oLabel.is('label')) {
      return oLabel.css('cursor', 'pointer');
    }
    return false;
  };
  jqTransformHideSelect = function(oTarget) {
    var ulVisible;
    ulVisible = $('.jqTransformSelectWrapper ul:visible');
    return ulVisible.each(function() {
      var oSelect;
      oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
      if (!(oTarget && oSelect.oLabel && oSelect.oLabel.get(0) === oTarget.get(0))) {
        return $(this).hide();
      }
    });
  };
  jqTransformCheckExternalClick = function(event) {
    if ($(event.target).parents('.jqTransformSelectWrapper').length === 0) {
      return jqTransformHideSelect($(event.target));
    }
  };
  jqTransformAddDocumentListener = function() {};
  $(document).mousedown(jqTransformCheckExternalClick);
  jqTransformReset = function(f) {
    var sel;
    sel = null;
    $('.jqTransformSelectWrapper select', f).each(function() {
      sel = this.selectedIndex < 0 ? 0 : this.selectedIndex;
      return $('ul', $(this).parent()).each(function() {
        return $("a:eq(" + sel + ")", this).click();
      });
    });
    $('a.jqTransformCheckbox, a.jqTransformRadio', f).removeClass('jqTransformChecked');
    return $('input:checkbox, input:radio', f).each(function() {
      if (this.checked) {
        return $('a', $(this).parent()).addClass('jqTransformChecked');
      }
    });
  };
  $.fn.jqTransInputButton = function() {
    var hover, md, mu, newBtn, out;
    this.each(function() {});
    newBtn = $("<button id='" + this.id + "' name='" + this.name + "' type='" + this.type + "' class='" + this.className + " jqTransformButton'><span><span>" + ($(this).attr('value')) + "</span></span>");
    hover = function() {
      return newBtn.addClass('jqTransformButton_hover');
    };
    out = function() {
      return newBtn.removeClass('jqTransformButton_hover');
    };
    md = function() {
      return newBtn.addClass('jqTransformButton_click');
    };
    mu = function() {
      return newBtn.removeClass('jqTransformButton_click');
    };
    newBtn.hover(hover, out).mousedown(md).mouseup(mu);
    return $(this).replaceWith(newBtn);
  };
  $.fn.jqTransInputText = function() {
    return this.each(function() {
      var $input, $wrapper, bl, fc, hover, inputSize, oLabel, out;
      $input = $(this);
      return $input.hasClass('jqtranformdone') || !$input.is('input');
      $input.addClass('jqtranformdone');
      oLabel = jqTransformGetLabel($(this));
      if (oLabel) {
        oLabel.bind('click', function() {
          return $input.focus();
        });
      }
      inputSize = $input.width();
      if ($input.attr('size')) {
        inputSize = $input.attr('size') * 10;
        $input.css('width', inputSize);
      }
      $input.addClass("jqTransformInput").wrap('<div class="jqTransformInputWrapper"><div class="jqTransformInputInner"><div></div></div></div>');
      $wrapper = $input.parent().parent().parent();
      $wrapper.css("width", inputSize + 10);
      fc = function() {
        return $wrapper.addClass("jqTransformInputWrapper_focus");
      };
      bl = function() {
        return $wrapper.removeClass("jqTransformInputWrapper_focus");
      };
      hover = function() {
        return $wrapper.addClass("jqTransformInputWrapper_hover");
      };
      out = function() {
        return $wrapper.removeClass("jqTransformInputWrapper_hover");
      };
      $input.focus(fc).blur(bl).hover(hover, out);
      if ($.browser.safari) {
        $wrapper.addClass('jqTransformSafari');
        $input.css('width', $wrapper.width() + 16);
      }
      return this.wrapper = $wrapper;
    });
  };
  $.fn.jqTransCheckBox = function() {
    return this.each(function() {
      var $input, aLink, inputSelf, oLabel;
      if ($(this).hasClass('jqTransformHidden')) {
        return;
      }
      $input = $(this);
      inputSelf = this;
      oLabel = jqTransformGetLabel($input);
      if (oLabel) {
        oLabel.click(function() {
          return aLink.trigger('click');
        });
      }
      aLink = $('<a href="#" class="jqTransformCheckbox"></a>');
      $input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink);
      $input.change(function() {
        if (this.checked) {
          aLink.addClass('jqTransformChecked');
        } else {
          aLink.removeClass('jqTransformChecked');
        }
        return true;
      });
      aLink.click(function() {
        if ($input.attr('disabled')) {
          return false;
        }
        $input.trigger('click').trigger("change");
        return false;
      });
      if (this.checked) {
        return aLink.addClass('jqTransformChecked');
      }
    });
  };
  $.fn.jqTransRadio = function() {
    return this.each(function() {
      var $input, aLink, inputSelf, oLabel;
      if ($(this).hasClass('jqTransformHidden')) {
        return;
      }
      $input = $(this);
      inputSelf = this;
      oLabel = jqTransformGetLabel($input);
      if (oLabel) {
        oLabel.click(function() {
          return aLink.trigger('click');
        });
      }
      aLink = $('<a href="#" class="jqTransformRadio" rel="' + this.name + '"></a>');
      $input.addClass('jqTransformHidden').wrap('<span class="jqTransformRadioWrapper"></span>').parent().prepend(aLink);
      $input.change(function() {
        $('.jqTransformRadio[rel=' + $input.attr('name') + ']', inputSelf.form).removeClass('jqTransformChecked');
        if (inputSelf.checked) {
          aLink.addClass('jqTransformChecked');
        } else {
          aLink.removeClass('jqTransformChecked');
        }
        return true;
      });
      aLink.click(function() {
        if ($input.attr('disabled')) {
          return false;
        }
        $input.trigger('click').trigger('change');
        $('input[name="' + $input.attr('name') + '"]', inputSelf.form).not($input).each(function() {
          if ($(this).attr('type') === 'radio') {
            return $(this).trigger('change');
          }
        });
        return false;
      });
      if (inputSelf.checked) {
        return aLink.addClass('jqTransformChecked');
      }
    });
  };
  $.fn.jqTransTextarea = function() {
    return this.each(function() {
      var bl, fc, hover, oLabel, oTable, out, strTable, textarea;
      textarea = $(this);
      if (textarea.hasClass('jqtransformdone')) {
        return;
      }
      textarea.addClass('jqtransformdone');
      oLabel = jqTransformGetLabel(textarea);
      if (oLabel) {
        oLabel.click(function() {
          return textarea.focus();
        });
      }
      strTable = '<table cellspacing="0" cellpadding="0" border="0" class="jqTransformTextarea">\n  <tr>\n    <td id="jqTransformTextarea-tl"></td>\n    <td id="jqTransformTextarea-tm"></td>\n    <td id="jqTransformTextarea-tr"></td>\n  </tr>\n  <tr>\n    <td id="jqTransformTextarea-ml">&nbsp;</td>\n    <td id="jqTransformTextarea-mm">\n      <div></div>\n    </td>\n    <td id="jqTransformTextarea-mr">&nbsp;</td>\n  </tr>\n  <tr>\n    <td id="jqTransformTextarea-bl"></td>\n    <td id="jqTransformTextarea-bm"></td>\n    <td id="jqTransformTextarea-br"></td>\n  </tr>\n</table>';
      oTable = $(strTable).insertAfter(textarea);
      hover = function() {
        if (!oTable.hasClass('jqTransformTextarea-focus')) {
          return oTable.addClass('jqTransformTextarea-hover');
        }
      };
      out = function() {
        return oTable.removeClass('jqTransformTextarea-hover');
      };
      oTable.hover(hover, out);
      fc = function() {
        return oTable.removeClass('jqTransformTextarea-hover').addClass('jqTransformTextarea-focus');
      };
      bl = function() {
        return oTable.removeClass('jqTransformTextarea-focus');
      };
      textarea.focus(fc).bl(bl).appendTo($('#jqTransformTextarea-mm div', oTable));
      this.oTable = oTable;
      if ($.browser.safari) {
        return $('#jqTransformTextarea-mm', oTable).addClass('jqTransformSafariTextarea').find('div').css({
          height: textarea.height(),
          width: textarea.width()
        });
      }
    });
  };
  $.fn.jqTransSelect = function() {
    return this.each(function(index) {
      var $select, $ul, $wrapper, iSelectHeight, iSelectWidth, newWidth, oLabel, oLinkOpen, oSpan;
      $select = $(this);
      if ($select.hasClass('jqTransformHidden') || $select.attr('multiple')) {
        return;
      }
      oLabel = jqTransformGetLabel($select);
      $wrapper = $select.addClass('jqTransformHidden').wrap('<div class="jqTransformSelectWrapper"></div>').parent().css({
        zIndex: 10 - index
      });
      $wrapper.prepend('<div><span></span><a href="#" class="jqTransformSelectOpen"></a></div><ul></ul>');
      $ul = $('ul', $wrapper).css({
        width: $select.width()
      }).hide();
      $('option', this).each(function(i) {
        var oLi;
        oLi = $('<li><a href="#" index="' + i + '">' + $(this).html() + '</a></li>');
        return $ul.append(oLi);
      });
      $ul.find('a').click(function() {
        $('a.selected', $wrapper).removeClass('selected');
        $(this).addClass('selected');
        if ($select[0].selectedIndex !== $(this).attr('index') && $select[0].onchange) {
          $select[0].selectedIndex = $(this).attr('index');
          $select[0].onchange();
        }
        $select[0].selectedIndex = $(this).attr('index');
        $('span:eq(0)', $wrapper).html($(this).html());
        $ul.hide();
        return false;
      });
      $("a:eq(" + this.selectedIndex + ")", $ul).click();
      $('span:first', $wrapper).click(function() {
        return $("a.jqTransformSelectOpen", $wrapper).trigger('click');
      });
      if (oLabel) {
        oLabel.click(function() {
          return $("a.jqTransformSelectOpen", $wrapper).trigger('click');
        });
      }
      this.oLabel = oLabel;
      oLinkOpen = $('a.jqTransformSelectOpen', $wrapper).click(function() {
        if ($ul.css('display') === 'none') {
          jqTransformHideSelect();
        }
        if ($select.attr('disabled')) {
          return false;
        }
        $ul.slideToggle('fast', function() {
          var offSet;
          offSet = $('a.selected', $ul).offset().top - $ul.offset().top;
          return $ul.animate({
            scrollTop: offSet
          });
        });
        return false;
      });
      iSelectWidth = $select.outerWidth();
      oSpan = $('span:first', $wrapper);
      newWidth = iSelectWidth > oSpan.innerWidth() ? iSelectWidth + oLinkOpen.outerWidth() : $wrapper.width();
      $wrapper.css({
        width: newWidth
      });
      $ul.css({
        width: newWidth - 2
      });
      oSpan.css({
        width: iSelectWidth
      });
      $ul.css({
        display: 'block',
        visibility: 'hidden'
      });
      iSelectHeight = $('li', $ul).length * $('li:first', $ul).height();
      $ul.css({
        height: iSelectHeight,
        overflow: iSelectHeight < $ul.height() ? 'hidden' : void 0
      });
      return $ul.css({
        display: 'none',
        visibility: 'visible'
      });
    });
  };
  $.fn.jqTransform = function(options) {
    var opt;
    opt = $.extend({}, defaultOptions, options);
    return this.each(function() {
      var selfForm;
      selfForm = $(this);
      if (selfForm.hasClass('jqtransformdone')) {
        return;
      }
      selfForm.addClass('jqtransformdone');
      $('input:submit, input:reset, input[type="button"]', this).jqTransInputButton();
      $('input:text, input:password', this).jqTransInputText();
      $('input:checkbox', this).jqTransCheckBox();
      $('input:radio', this).jqTransRadio();
      $('textarea', this).jqTransTextarea();
      if ($('select', this).jqTransSelect().length > 0) {
        jqTransformAddDocumentListener();
      }
      return selfForm.bind('reset', function() {
        var action;
        action = __bind(function() {
          return jqTransformReset(this);
        }, this);
        return window.setTimeout(action, 10);
      });
    });
  };
}).call(this);
