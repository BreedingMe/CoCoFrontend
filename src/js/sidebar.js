import $ from 'jquery';

import SCREEN from './constants/screen.js';

$('#mobile-sidebar').on('click', toggleMobileSidebarMenu);

function toggleMobileSidebarMenu() {
    $('#mobile-sidebar').toggleClass('is-active');
    $('#mobile-sidebar-menu').toggleClass('is-active');
}

$('#desktop-sidebar-home-btn').on('click', () => {
    changeScreen(SCREEN['HOME']);
});

$('#mobile-sidebar-menu-home-btn').on('click', () => {
    changeScreen(SCREEN['HOME']);
});

function changeScreen(currentScreen) {
    for (let screen in SCREEN) {
        $(`#${SCREEN[screen]}`).hide();
    }

    $(`#${currentScreen}`).show();
}