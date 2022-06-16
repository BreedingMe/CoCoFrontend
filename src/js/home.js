/* Third Party JS */

import $ from 'jquery';
import Cookies from 'js-cookie';

/* JS */

window.initializeHome = () => {
    getPosts();
};

function resizeHomeContainer() {
    let body = $('body');
    let home = $('#home');
    let homeContainer = $('#home .container');

    if (home.innerHeight() <= body.innerHeight()) {
        body.css('height', '100%');
        home.css('height', '100%');
        homeContainer.css('height', '100%');
    }

    if (homeContainer.prop('scrollHeight') > body.innerHeight()) {
        body.css('height', '');
        home.css('height', '');
        homeContainer.css('height', '');
    }
}

/* AJAX */

function getPosts() {
    $('#card-section').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            let posts = response['posts'];

            for (let index = 0; index < posts.length; index++) {
                let id = posts[index]['_id'];
                let title = posts[index]['title'];
                let recruitmentFields = posts[index]['recruitment_fields'];
                let region = posts[index]['region'];
                let hits = posts[index]['hits'];
                let likes = posts[index]['likes'];

                let recruitmentFieldsHTML = '';

                for (let recruitmentField in recruitmentFields) {
                    recruitmentFieldsHTML += `<span class="bubble-item">${recruitmentField}</span>`;
                }

                let cardHTML = `<div id=${id} class="card" onclick="openPost()">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>

                                        <p class="card-header-icon">
                                            <img src="./static/icon/React.svg" width="16" height="16" class="tech-stack-icon"/>
                                            <img src="./static/icon/Spring.svg" width="16" height="16" class="tech-stack-icon"/>
                                        </p>
                                    </div>

                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span>모집 분야</span>
                                                ${recruitmentFieldsHTML}
                                            </div>

                                            <div class="content">
                                                <span>지역</span>
                                                <span class="bubble-item">${region}</span>
                                            </div>
                                        </div>

                                        <div class="card-content-box">
                                            <div>
                                                <div class="content">
                                                    <i class="fa-regular fa-eye"></i>
                                                    <span>${hits}</span>
                                                </div>

                                                <div class="content">
                                                    <i class="fa-regular fa-heart"></i>
                                                    <span>${likes}</span>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <i class="fa-regular fa-bookmark"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                $('#card-section').append(cardHTML);
            }

            resizeHomeContainer();
        }
    });
}

/* Event Listener */

window.openPost = () => {
    if (Cookies.get('token') == undefined) {
        window.openLoginModal();
    }
};