var SETTINGS = {
  container: '.write-content',
  textareas: [
    // If you need to add any other elements in time, just add to this array.
    "#new_commit_comment_field",
    "#new_comment_field",
    "[id^=new_inline_comment_]",
    "#pull_request_body",
    "#issue_body"
  ],
  // Checks DOM in milliseconds if the elements appeared above.
  DOMCheckInterval: 500
};

function MarkupDown(textarea) {
  var _this = this;
  this.textarea = textarea;
  this.$el = $("<div/>").append(this.TEMPLATE);
  this.bindEvents();

  this.$el.on('action', function (event, actionName) {
    var area = _this.textarea;
    var selectedText = area.value.substr(area.selectionStart, area.selectionEnd - area.selectionStart).trim();
    var replacementText = _this[actionName](selectedText, area.value);
    _this.applyReplacement(replacementText, !!selectedText);
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
  var link = prompt("Please enter your link", "");
  var text = selectedText || link;

  return "[" + text + "](" + link + ")";
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
  if (/\n/.test(selectedText)) { // if code is multilined, make it bigger.
    return "\n```" + prompt("What language is this code?") + "\n" + selectedText + "\n```\n";
  }
  return this.toggleWrap('`', selectedText);
};

MarkupDown.prototype.quote = function (selectedText) {
  return this.multilineReplacer(selectedText, function (listItem) {
    return '> ' + listItem;
  });
};

MarkupDown.prototype.ul = function (selectedText) {
  return this.multilineReplacer(selectedText, function (listItem) {
    return '- ' + listItem;
  });
};

MarkupDown.prototype.ol = function (selectedText, allText) {
  var lastItemIndex = 0;
  var beforePart;
  if (selectedText) {
    beforePart = allText.substr(0, allText.indexOf(selectedText));
  } else {
    beforePart = allText;
  }
  var findItems = beforePart.match(/^(\d+)\./gm);
  if (findItems) {
    lastItemIndex = +findItems.pop().replace(/\D+/, '');
  }

  return this.multilineReplacer(selectedText, function (listItem, index) {
    return (lastItemIndex + index + 1) + '. ' + listItem;
  });
};

MarkupDown.prototype.check = function (selectedText) {
  return this.multilineReplacer(selectedText, function (listItem) {
    return '- [ ] ' + listItem;
  });
};

MarkupDown.prototype.checked = function (selectedText) {
  return this.multilineReplacer(selectedText, function (listItem) {
    return '- [x] ' + listItem;
  });
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

MarkupDown.prototype.multilineReplacer = function (replacementText, mapper) {
  return "\n" + replacementText.split(/\n/gm).map(mapper).join("\n");
};

MarkupDown.prototype.applyReplacement = function (replacementText, canBeSelected) {
  var area = this.textarea;
  var beforePart = area.value.substr(0, area.selectionStart);
  var afterPart = area.value.substr(area.selectionEnd);

  var rangeStart = area.selectionStart;
  var rangeEnd = rangeStart + replacementText.length;

  if (!beforePart.trim()) {
    // If there's no before part, we don't need spaces before replacement.
    replacementText = replacementText.replace(/^\n/g, '');
  }

  area.value = beforePart + replacementText + afterPart;
  area.focus();
  if (canBeSelected === true) {
    area.setSelectionRange(rangeStart, rangeEnd);
  } else {
    // Move cursor to the end of selection.
    area.setSelectionRange(rangeEnd, rangeEnd);
  }
};

function init() {
  $(SETTINGS.textareas.join())
    .filter(":not(.markupdown-applied)")
    .each(function () {
      var markupDown = new MarkupDown(this);
      $(this).closest(SETTINGS.container).prepend(markupDown.$el.hide().fadeIn());
      $(this).addClass('markupdown-applied');
  });
}

$(document).on("ready", function () {
  init();
  setInterval(init, SETTINGS.DOMCheckInterval); // check for new elements
});
