$(function() {
    var $content = $('#content');
    var toggleFontSize = function() {
        if ($content.css('font-size') == '22px') {
            $('#content').animate({
                fontSize: '15px'
            });
        } else {
            $('#content').animate({
                fontSize: '22px'
            });
        }
    }
    setInterval(toggleFontSize, 3000);
});