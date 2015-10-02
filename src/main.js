var dataa = '<div class="markupdown">' +
  '<div class="btn-group">' +
  '<button class="btn btn-sm" data-set="link" type="button"><span class="octicon octicon-link"></span></button>' +
  '<button class="btn btn-sm" data-set="bold" type="button"><b>b</b></button>' +
  '<button class="btn btn-sm" data-set="italic" type="button"><em>i</em></button>' +
  '<button class="btn btn-sm" data-set="ins" type="button"><del>del</del></button>' +
  '<button class="btn btn-sm" data-set="code" type="button"><span class="octicon octicon-code"></span></button>' +
  '<button class="btn btn-sm" data-set="quote" type="button"><span class="octicon octicon-quote"></span></button>' +
  '</div>' +
  '<div class="btn-group">' +
  '<button class="btn btn-sm" data-set="ul" type="button"><span class="octicon octicon-list-unordered"></span></button>' +
  '<button class="btn btn-sm" data-set="ol" type="button"><span class="octicon octicon-list-ordered"></span></button>' +
  '</div>' +
  '<div class="btn-group">' +
  '<button class="btn btn-sm" data-set="check" type="button">[ ]</button>' +
  '<button class="btn btn-sm" data-set="checked" type="button">[x]</button>' +
  '</div>' +
  '</div>';

$('.previewable-comment-form .write-content').prepend(dataa);


$(document).on('click', '.markupdown button', function(e) {

  var buttonName = $(e.target).data('set');
  var txtComment = document.getElementById('new_comment_field');

  if (typeof(txtComment.selectionStart) != "undefined") {

    var tagBegin = "";
    var tagEnd = "";

    switch (buttonName) {
      case 'link':
        var testt = prompt("Please enter your link", "");
        tagBegin = "[";
        tagEnd = "](" + testt + ")";
        break;
      case 'bold':
        tagBegin = "**";
        tagEnd = tagBegin;
        break;
      case 'italic':
        tagBegin = "*";
        tagEnd = tagBegin;
        break;
      case 'ins':
        tagBegin = "~~";
        tagEnd = tagBegin;
        break;
      case 'code':
        tagBegin = "`";
        tagEnd = tagBegin;
        break;
      case 'quote':
        tagBegin = "\n> ";
        tagEnd = "\n";
        break;
      case 'ul':
        tagBegin = "\n- ";
        break;
      case 'ol':
        tagBegin = "\n1. ";
        break;
      case 'check':
        tagBegin = "\n- [ ] ";
        break;
      case 'checked':
        tagBegin = "\n- [x] ";
        break;
    }

    var begin = txtComment.value.substr(0, txtComment.selectionStart);
    var selection = txtComment.value.substr(txtComment.selectionStart, txtComment.selectionEnd - txtComment.selectionStart);
    var end = txtComment.value.substr(txtComment.selectionEnd);

    txtComment.value = begin + tagBegin + selection + tagEnd + end;
  }
});
