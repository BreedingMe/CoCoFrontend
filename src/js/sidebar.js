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

$('#desktop-sidebar-profile-btn').on('click', () => {
    changeScreen(SCREEN['PROFILE']);
});

$('#mobile-sidebar-menu-profile-btn').on('click', () => {
    changeScreen(SCREEN['PROFILE']);
});

$('#desktop-sidebar-message-btn').on('click', () => {
    changeScreen(SCREEN['MESSAGE']);
});

$('#mobile-sidebar-menu-message-btn').on('click', () => {
    changeScreen(SCREEN['MESSAGE']);
});

$('#desktop-sidebar-editor-btn').on('click', () => {
    changeScreen(SCREEN['EDITOR']);
});

$('#mobile-sidebar-menu-editor-btn').on('click', () => {
    changeScreen(SCREEN['EDITOR']);
});

function changeScreen(currentScreen) {
    for (let screen in SCREEN) {
        $(`#${SCREEN[screen]}`).hide();
    }

    $(`#${currentScreen}`).show();
}