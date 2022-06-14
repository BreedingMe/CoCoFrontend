/* JS */

import { router } from '../router/router.js';

function initializeRouter(element) {
    renderHTML(element, router[window.location.pathname]);

    window.onpopstate = () => {
        renderHTML(element, router[window.location.pathname]);
    };
}

function changeRouter(element, pathName) {
    window.history.pushState({}, pathName, window.location.origin + pathName);
    renderHTML(element, router[pathName]);
}

function renderHTML(element, view) {
    element.innerHTML = view;
}

export {
    initializeRouter,
    changeRouter
};