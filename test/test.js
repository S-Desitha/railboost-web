$(document).ready(function() {
    $('.timeline-item').each(function(index) {
        $(this).delay(200 * index).fadeIn();
    });
});
