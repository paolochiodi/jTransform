#
# jTranform
# by paolochiodi chiodi84@gmail.com
#
# based on jqTransform
# by mathieu vilaplana mvilaplana@dfc-e.com
# Designer ghyslain armand garmand@dfc-e.com
#
#
# Version 1.0 25.09.08
# Version 1.1 06.08.09
# Add event click on Checkbox and Radio
# Auto calculate the size of a select element
# Can now, disabled the elements
# Correct bug in ff if click on select (overflow=hidden)
# No need any more preloading !!

defaultOptions = preloadImg: true
jqTransformImgPreloaded = false

jqTransformPreloadHoverFocusImg = (strImgUrl) ->
  #guillemets to remove for ie
  strImgUrl = strImgUrl.replace(/^url\((.*)\)/, '$1').replace(/^\"(.*)\"$/, '$1')
  imgHover = new Image()
  imgHover.src = strImgUrl.replace(/\.([a-zA-Z]*)$/,'-hover.$1')
  imgFocus = new Image()
  imgFocus.src = strImgUrl.replace(/\.([a-zA-Z]*)$/,'-focus.$1')

# Labels
jqTransformGetLabel = (objfield) ->
  selfForm = $(objfield.get(0).form)
  oLabel = objfield.next()

  unless oLabel.is('label')
    oLabel = objfield.prev()
    if oLabel.is('label')
      inputname = objfield.attr 'id'
      if inputname
        oLabel = selfForm.find 'label[for="' + inputname + '"]'

  return oLabel.css 'cursor', 'pointer' if oLabel.is 'label'
  false

# Hide all open selects
jqTransformHideSelect = (oTarget) ->
  ulVisible = $('.jqTransformSelectWrapper ul:visible')
  ulVisible.each () ->
    oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0)
    # do not hide if click on the label object associated to the select
    $(this).hide() unless (oTarget && oSelect.oLabel && oSelect.oLabel.get(0) == oTarget.get(0))

# Check for an external click
jqTransformCheckExternalClick = (event) ->
  jqTransformHideSelect $(event.target) if $(event.target).parents('.jqTransformSelectWrapper').length == 0

# Apply document listener
jqTransformAddDocumentListener = () ->
$(document).mousedown jqTransformCheckExternalClick

# Add a new handler for the reset action
jqTransformReset = (f) ->
  sel = null
  $('.jqTransformSelectWrapper select', f).each () ->
    sel = if this.selectedIndex < 0 then 0 else this.selectedIndex
    $('ul', $(this).parent()).each () ->
      $("a:eq(#{sel})", this).click()

  $('a.jqTransformCheckbox, a.jqTransformRadio', f).removeClass('jqTransformChecked');
  $('input:checkbox, input:radio', f).each () ->
    $('a', $(this).parent()).addClass('jqTransformChecked') if this.checked

# Buttons
$.fn.jqTransInputButton = () ->
  @each () ->
  newBtn = $("<button id='#{this.id}' name='#{this.name}' type='#{this.type}' class='#{this.className} jqTransformButton'><span><span>#{$(this).attr('value')}</span></span>")

  hover = () -> newBtn.addClass 'jqTransformButton_hover'
  out = () -> newBtn.removeClass 'jqTransformButton_hover'
  md = () -> newBtn.addClass 'jqTransformButton_click'
  mu = () -> newBtn.removeClass 'jqTransformButton_click'

  newBtn.hover(hover,out).mousedown(md).mouseup(mu)

  $(this).replaceWith newBtn

# Text Fields 
$.fn.jqTransInputText = () ->
  @each () ->
    $input = $(this)

    return $input.hasClass('jqtranformdone') || !$input.is('input')

    $input.addClass('jqtranformdone');

    oLabel = jqTransformGetLabel $(this)
    if oLabel
      oLabel.bind 'click', () -> $input.focus() 

    inputSize = $input.width()

    if $input.attr('size')
      inputSize = $input.attr('size') * 10
      $input.css 'width', inputSize

    $input.addClass("jqTransformInput").wrap '<div class="jqTransformInputWrapper"><div class="jqTransformInputInner"><div></div></div></div>'
    $wrapper = $input.parent().parent().parent()
    $wrapper.css "width", inputSize + 10
  
    fc = () -> $wrapper.addClass "jqTransformInputWrapper_focus"
    bl = () -> $wrapper.removeClass "jqTransformInputWrapper_focus"
    hover = () -> $wrapper.addClass "jqTransformInputWrapper_hover"
    out = () -> $wrapper.removeClass "jqTransformInputWrapper_hover"

    $input.focus(fc).blur(bl).hover(hover, out)

    # If this is safari we need to add an extra class
    if $.browser.safari
      $wrapper.addClass('jqTransformSafari')
      $input.css('width', $wrapper.width() + 16)

    @wrapper = $wrapper

# Check Boxes 
$.fn.jqTransCheckBox = () ->
  @each () ->
    return if $(this).hasClass 'jqTransformHidden'

    $input = $(this)
    inputSelf = this

    # set the click on the label
    oLabel = jqTransformGetLabel $input
    if oLabel
      oLabel.click () -> aLink.trigger 'click'

    aLink = $('<a href="#" class="jqTransformCheckbox"></a>')

    # wrap and add the link
    $input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink)
    # on change, change the class of the link
    $input.change () ->
      if this.checked then aLink.addClass('jqTransformChecked') else aLink.removeClass('jqTransformChecked')
      true

    # Click Handler, trigger the click and change event on the input
    aLink.click () ->
      # do nothing if the original input is disabled
      return false if $input.attr('disabled')
      # trigger the envents on the input object
      $input.trigger('click').trigger("change")
      false

    # set the default state
    aLink.addClass('jqTransformChecked') if this.checked


# Radio Buttons 
$.fn.jqTransRadio = () ->
  @each () ->
    return if $(this).hasClass 'jqTransformHidden'

    $input = $(this)
    inputSelf = this

    oLabel = jqTransformGetLabel($input);
    if oLabel
      oLabel.click () -> aLink.trigger 'click'

    aLink = $('<a href="#" class="jqTransformRadio" rel="' + this.name + '"></a>')
    $input.addClass('jqTransformHidden').wrap('<span class="jqTransformRadioWrapper"></span>').parent().prepend(aLink);

    $input.change () ->
      $('.jqTransformRadio[rel=' + $input.attr('name') + ']',inputSelf.form).removeClass('jqTransformChecked')
      if inputSelf.checked then aLink.addClass('jqTransformChecked') else aLink.removeClass('jqTransformChecked')
      true

    # Click Handler
    aLink.click () ->
      return false if $input.attr 'disabled'

      $input.trigger('click').trigger('change');

      # uncheck all others of same name input radio elements
      $('input[name="' + $input.attr('name') + '"]', inputSelf.form).not($input).each () ->
        $(this).trigger('change') if $(this).attr('type') == 'radio'

      false

    # set the default state
    aLink.addClass('jqTransformChecked') if inputSelf.checked

# TextArea 
$.fn.jqTransTextarea = () ->
  @each () ->
    textarea = $(this)

    return if textarea.hasClass 'jqtransformdone'
    textarea.addClass 'jqtransformdone'

    oLabel = jqTransformGetLabel textarea
    if oLabel
      oLabel.click () -> textarea.focus()

    strTable = '''
                  <table cellspacing="0" cellpadding="0" border="0" class="jqTransformTextarea">
                    <tr>
                      <td id="jqTransformTextarea-tl"></td>
                      <td id="jqTransformTextarea-tm"></td>
                      <td id="jqTransformTextarea-tr"></td>
                    </tr>
                    <tr>
                      <td id="jqTransformTextarea-ml">&nbsp;</td>
                      <td id="jqTransformTextarea-mm">
                        <div></div>
                      </td>
                      <td id="jqTransformTextarea-mr">&nbsp;</td>
                    </tr>
                    <tr>
                      <td id="jqTransformTextarea-bl"></td>
                      <td id="jqTransformTextarea-bm"></td>
                      <td id="jqTransformTextarea-br"></td>
                    </tr>
                  </table>
                '''
    oTable = $(strTable).insertAfter(textarea)

    hover = () -> oTable.addClass 'jqTransformTextarea-hover' unless oTable.hasClass 'jqTransformTextarea-focus'
    out = () -> oTable.removeClass('jqTransformTextarea-hover')

    oTable.hover(hover, out)
  
    fc = () -> oTable.removeClass('jqTransformTextarea-hover').addClass('jqTransformTextarea-focus')
    bl = () -> oTable.removeClass('jqTransformTextarea-focus')

    textarea.focus(fc).bl(bl).appendTo $('#jqTransformTextarea-mm div',oTable)

    @oTable = oTable
    if $.browser.safari
      $('#jqTransformTextarea-mm', oTable)
        .addClass('jqTransformSafariTextarea')
        .find('div')
        .css
          height: textarea.height()
          width: textarea.width()


# Select
$.fn.jqTransSelect = () ->
  @each (index) ->
    $select = $(this);

    return if $select.hasClass('jqTransformHidden') or $select.attr('multiple')

    oLabel = jqTransformGetLabel $select
    # First thing we do is Wrap it
    $wrapper = $select
      .addClass('jqTransformHidden')
      .wrap('<div class="jqTransformSelectWrapper"></div>')
      .parent()
      .css(zIndex: 10-index)

    # Now add the html for the select
    $wrapper.prepend('<div><span></span><a href="#" class="jqTransformSelectOpen"></a></div><ul></ul>')
    $ul = $('ul', $wrapper).css(width: $select.width()).hide()

    # Now we add the options
    $('option', this).each (i) ->
      oLi = $('<li><a href="#" index="' + i + '">' + $(this).html() + '</a></li>')
      $ul.append(oLi)

    # Add click handler to the a
    $ul.find('a').click () ->
      $('a.selected', $wrapper).removeClass('selected')
      $(this).addClass('selected')
      #Fire the onchange event
      if $select[0].selectedIndex != $(this).attr('index') and $select[0].onchange
        $select[0].selectedIndex = $(this).attr('index'); $select[0].onchange()

      $select[0].selectedIndex = $(this).attr('index')
      $('span:eq(0)', $wrapper).html $(this).html()
      $ul.hide()
      false

    # Set the default
    $("a:eq(#{this.selectedIndex})", $ul).click()
    $('span:first', $wrapper).click () -> $("a.jqTransformSelectOpen",$wrapper).trigger 'click'
    if oLabel
      oLabel.click () -> $("a.jqTransformSelectOpen", $wrapper).trigger 'click'

    @oLabel = oLabel

    # Apply the click handler to the Open
    oLinkOpen = $('a.jqTransformSelectOpen', $wrapper)
      .click () ->
        # Check if box is already open to still allow toggle, but close all other selects
        jqTransformHideSelect() if $ul.css('display') == 'none'
        return false if $select.attr('disabled')
  
        $ul.slideToggle 'fast', () ->
          offSet = $('a.selected', $ul).offset().top - $ul.offset().top
          $ul.animate(scrollTop: offSet)
  
        false
  
    # Set the new width
    iSelectWidth = $select.outerWidth()
    oSpan = $('span:first', $wrapper)
    newWidth = if (iSelectWidth > oSpan.innerWidth()) then iSelectWidth + oLinkOpen.outerWidth() else $wrapper.width()
    $wrapper.css width: newWidth
    $ul.css width: newWidth-2
    oSpan.css width: iSelectWidth
  
    # Calculate the height if necessary, less elements that the default height
    # show the ul to calculate the block, if ul is not displayed li height value is 0
    $ul.css  display:'block', visibility:'hidden'
    iSelectHeight = $('li', $ul).length * $('li:first', $ul).height() # +1 else bug ff
    $ul.css height: iSelectHeight, overflow: 'hidden' if iSelectHeight < $ul.height() # hidden else bug with ff
    $ul.css display:'none', visibility:'visible'

$.fn.jqTransform = (options) ->
  opt = $.extend {}, defaultOptions, options
  #each form
  @each () ->
    selfForm = $(this)
    return if selfForm.hasClass 'jqtransformdone'

    selfForm.addClass 'jqtransformdone'

    $('input:submit, input:reset, input[type="button"]', this).jqTransInputButton()
    $('input:text, input:password', this).jqTransInputText()
    $('input:checkbox', this).jqTransCheckBox()
    $('input:radio', this).jqTransRadio()
    $('textarea', this).jqTransTextarea()
  
    jqTransformAddDocumentListener() if $('select', this).jqTransSelect().length > 0
  
    selfForm.bind 'reset', () ->
      action = () =>
        jqTransformReset(this)
  
      window.setTimeout action, 10