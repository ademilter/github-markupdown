function MarkupDown(textarea) {
  var _this = this;
  this.textarea = textarea;
  this.$el = $("<div/>").append(this.TEMPLATE);
  this.bindEvents();

  this.$el.on('action', function (event, actionName) {
    var area = _this.textarea;
    var selectedText = area.value.substr(area.selectionStart, area.selectionEnd - area.selectionStart);
    var replacementText = _this[actionName](selectedText);
    _this.applyReplacement(replacementText);
  });
}

// Using sindresorhus' multiline function to manage templates easily.
MarkupDown.prototype.TEMPLATE = multiline(function () {/*
  <div class="markupdown">
    <div class="btn-group">
      <button class="btn btn-sm" data-action="link" type="button"><span class="octicon octicon-link"></span></button>
      <button class="btn btn-sm" data-action="bold" type="button"><b>b</b></button>
      <button class="btn btn-sm" data-action="italic" type="button"><em>i</em></button>
      <button class="btn btn-sm" data-action="insert" type="button"><del>del</del></button>
      <button class="btn btn-sm" data-action="code" type="button"><span class="octicon octicon-code"></span></button>
      <button class="btn btn-sm" data-action="quote" type="button"><span class="octicon octicon-quote"></span></button>
    </div>
    <div class="btn-group">
      <button class="btn btn-sm" data-action="ul" type="button"><span class="octicon octicon-list-unordered"></span></button>
      <button class="btn btn-sm" data-action="ol" type="button"><span class="octicon octicon-list-ordered"></span></button>
    </div>
    <div class="btn-group">
      <button class="btn btn-sm" data-action="check" type="button">[ ]</button>
      <button class="btn btn-sm" data-action="checked" type="button">[x]</button>
    </div>
  </div>
*/});

MarkupDown.prototype.bindEvents = function () {
  var _this = this;
  this.$el.find(".btn").click(function () {
    _this.$el.trigger('action', $(this).data('action'));
  });
};

MarkupDown.prototype.link = function (selectedText) {
  return "[" + selectedText + "](" + prompt("Please enter your link", "") + ")";
};

MarkupDown.prototype.bold = function (selectedText) {
  return this.toggleWrap('**', selectedText);
};

MarkupDown.prototype.italic = function (selectedText) {
  return this.toggleWrap('*', selectedText);
};

MarkupDown.prototype.insert = function (selectedText) {
  return this.toggleWrap('~~', selectedText);
};

MarkupDown.prototype.code = function (selectedText) {
  return this.toggleWrap('`', selectedText);
};

MarkupDown.prototype.quote = function (selectedText) {
  return "\n> " + selectedText + "\n";
};

MarkupDown.prototype.ul = function (selectedText) {
  return "\n- " + selectedText;
};

MarkupDown.prototype.ol = function (selectedText) {
  return "\n1. " + selectedText;
};

MarkupDown.prototype.check = function (selectedText) {
  return "\n- [ ] " + selectedText;
};

MarkupDown.prototype.checked = function (selectedText) {
  return "\n- [x] " + selectedText;
};

// Helper Functions
MarkupDown.prototype.toggleWrap = function (wrapper, text) {

  // Escape for RegExp
  wrapperRegExp = wrapper.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  var wrap = new RegExp("(^"+ wrapperRegExp +")|("+ wrapperRegExp +"$)", "gm");
  if (wrap.test(text)) {
    return text.replace(wrap, "");
  } else {
    return text.replace(/(^)|($)/gm, wrapper);
  }
};

MarkupDown.prototype.applyReplacement = function (replacementText) {
  var area = this.textarea;
  var beforePart = area.value.substr(0, area.selectionStart);
  var afterPart = area.value.substr(area.selectionEnd);

  var rangeStart = area.selectionStart;
  var rangeEnd = rangeStart + replacementText.length;

  area.value = beforePart + replacementText + afterPart;
  area.focus();
  area.setSelectionRange(rangeStart, rangeEnd);
};

function init() {
  $("#new_commit_comment_field, #new_comment_field, [id^=new_inline_comment], #pull_request_body")
    .filter(":not(.markupdown-applied)")
    .each(function () {
      var markupDown = new MarkupDown(this);
      $(this).closest('.write-content').prepend(markupDown.$el);
      $(this).addClass('markupdown-applied');
  });
}

$(document).on("ready", function () {
  init();
  setInterval(init, 500); // check for new elements
});
