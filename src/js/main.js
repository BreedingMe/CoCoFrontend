import 'bulma/css/bulma.css';

import '../css/main.css';
import '../css/home.css';
import '../css/sidebar.css';
import '../css/footer.css';

import $ from 'jquery';

import '@fortawesome/fontawesome-free/js/all.js';

import './home.js';
import './sidebar.js';

$(document).ready(() => {
    resizeContainerHeight();
});

function resizeContainerHeight() {
    let containers = $('.container');

    if (containers.height() < $('body').height()) {
        containers.css('height', '100%');
    }
    else {
        containers.css('height', '');
    }
}