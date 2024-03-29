/* Third Party CSS */

import 'bulma/css/bulma.css';

/* View CSS */

import '../css/main.css';
import '../css/home.css';
import '../css/post-detail.css';
import '../css/post_update.css';
import '../css/editor.css';
import '../css/comment.css';
import '../css/profile.css';
import '../css/message.css';
import '../css/bookmark.css';
import '../css/login-modal.css';
import '../css/register-modal.css';
import '../css/sidebar.css';
import '../css/footer.css';

/* Third Party JS */

import '@fortawesome/fontawesome-free/js/all.js';

/* Common JS */

import { initializeRouter, changeRouter } from './common/router';

/* View JS */

import './home.js';
import './post-detail.js';
import './post_update';
import './editor.js';
import './comment.js';
import './profile.js';
import './message.js';
import './bookmark.js';
import './login-modal.js';
import './register-modal.js';
import './sidebar.js';

/* JS */

window.onload = () => {
    /* Router */

    const app = document.querySelector('#app');
    const currentPathName = (window.location.pathname == '/') ? ('/home') : (window.location.pathname);

    initializeRouter(app);

    if (window['initialize' + currentPathName.charAt(1).toUpperCase() + currentPathName.slice(2)] != undefined) {
        window['initialize' + currentPathName.charAt(1).toUpperCase() + currentPathName.slice(2)]();
    }

    document.querySelectorAll('.nav-item').forEach((element) => {
        element.addEventListener('click', (event) => {
            const pathName = event.currentTarget.getAttribute('route');

            changeRouter(app, pathName);

            if (window['initialize' + pathName.charAt(1).toUpperCase() + pathName.slice(2)] != undefined) {
                window['initialize' + pathName.charAt(1).toUpperCase() + pathName.slice(2)]();
            }
            document.querySelectorAll('.container').forEach((element) => {
                const resizeContainer = () => {
                    const parentElement = element.parentElement;

                    if (parentElement.clientHeight <= document.body.clientHeight) {
                        document.body.style.height = '100%';
                        parentElement.style.height = '100%';
                        element.style.height = '100%';
                    }

                    if (element.scrollHeight > document.body.clientHeight) {
                        document.body.style.height = '';
                        parentElement.style.height = '';
                        element.style.height = '';
                    }
                };

                const initializeView = () => {
                    if (window['initialize' + element.parentElement.id.charAt(0).toUpperCase() + element.parentElement.id.slice(1)] != undefined) {
                        window['initialize' + element.parentElement.id.charAt(0).toUpperCase() + element.parentElement.id.slice(1)]();
                    }
                };

                window.addEventListener('resize', resizeContainer);
                window.addEventListener('popstate', resizeContainer);
                window.addEventListener('popstate', initializeView);

                resizeContainer();
            });
        });
    });

    /* Resize Container */

    document.querySelectorAll('.container').forEach((element) => {
        const resizeContainer = () => {
            const parentElement = element.parentElement;

            if (parentElement.clientHeight <= document.body.clientHeight) {
                document.body.style.height = '100%';
                parentElement.style.height = '100%';
                element.style.height = '100%';
            }

            if (element.scrollHeight > document.body.clientHeight) {
                document.body.style.height = '';
                parentElement.style.height = '';
                element.style.height = '';
            }
        };

        const initializeView = () => {
            if (window['initialize' + element.parentElement.id.charAt(0).toUpperCase() + element.parentElement.id.slice(1)] != undefined) {
                window['initialize' + element.parentElement.id.charAt(0).toUpperCase() + element.parentElement.id.slice(1)]();
            }
        };

        window.addEventListener('resize', resizeContainer);
        window.addEventListener('popstate', resizeContainer);
        window.addEventListener('popstate', initializeView);

        resizeContainer();
    });
};