import $ from 'jquery';

$(document).ready(() => {
    resizeHomeHeight();
});

function resizeHomeHeight() {
    let home = $('#home');

    if (home.height() < $('body').height()) {
        home.css('height', '100%');
    }
    else {
        home.css('height', '');
    }
}