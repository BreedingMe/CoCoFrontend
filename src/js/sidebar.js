/* Third Party JS */

import $ from 'jquery';

/* Event Listener */

window.toggleMobileSidebarMenu = () => {
    $('#mobile-sidebar').toggleClass('is-active');
    $('#mobile-sidebar-menu').toggleClass('is-active');
};