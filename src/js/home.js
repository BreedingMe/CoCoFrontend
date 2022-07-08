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
    $('#home-section-post').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            let posts = response;

            for (let index = 0; index < posts.length; index++) {
                let id = posts[index]['id'];
                let title = posts[index]['title'];
                let meetingType = posts[index]['meetingType'];
                let period = posts[index]['period'];
                let hits = posts[index]['hits'];

                let cardHTML = `<div id=${id} class="card" onclick="openPost(${id})">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                    </div>

                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span>기간</span>
                                                <span class="bubble-item">${period}</span>
                                            </div>

                                            <div class="content">
                                                <span>모임 방식</span>
                                                <span class="bubble-item">${meetingType}</span>
                                            </div>

                                            <div class="content">
                                            <span>모집 현황</span>
                                            <span id="recruitmentState" class="bubble-item">${recruitmentState}</span>
                                        </div>

                                        </div>
                                        <div class="card-content-box">
                                        <div>
                                            <div class="content">
                                                <i class="fa-regular fa-eye"></i>
                                                <span>${hits}</span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>`;

                $('#home-section-post').append(cardHTML);
            }

            resizeHomeContainer();
        }
    });
}

/* Event Listener */

window.openPost = (id) => {
    if (Cookies.get('token') == undefined) {
        window.openLoginModal();
    }
    else {
        window.location.href = '/post?id=' + id;
    }
};