/* Third Party JS */

import $ from 'jquery';

/* Event Listener */

window.toggleMobileSidebarMenu = () => {
    $('#sidebar-mobile').toggleClass('is-active');
    $('#sidebar-menu-mobile').toggleClass('is-active');
};