/* Third Party JS */

import $ from 'jquery';

/* JS */

window.initializeHome = () => {
    let check = localStorage.getItem('check');
    $('#recruitmentStateCheckbox').prop('checked', JSON.parse(check));
    if ($('input:checkbox[id="recruitmentStateCheckbox"]').is(':checked')) {
        getPosts();
    }
    else {
        getRecrutingPosts();
    }
};

window.recruitmentStateCheckbox = () => {
    localStorage.setItem('check', $('#recruitmentStateCheckbox').is(':checked'));

    if ($('input:checkbox[id="recruitmentStateCheckbox"]').is(':checked')) {
        getPosts();
    }
    else {
        getRecrutingPosts();
    }
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
// 모집 중인 게시글만 (default)
function getRecrutingPosts() {
    $('#home-section-post').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/recruit/list',
        success: function (response) {
            let posts = response;

            for (let index = 0; index < posts.length; index++) {
                let id = posts[index]['id'];
                let title = posts[index]['title'];
                let meetingType = posts[index]['meetingType'];
                let period = posts[index]['period'];
                let hits = posts[index]['hits'];
                let recruitmentState = posts[index]['recruitmentState'] ? '모집 완료' : '모집 중';

                let recruitmentStateColor = posts[index]['recruitmentState'] ? 'is-default' : 'is-pink';
                let recruitmentStateColorBack = posts[index]['recruitmentState'] ? 'is-white' : 'is-gray';

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}" onclick="openPost(${id})">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                    </div>

                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span>기간</span>
                                                <span class="bubble-item bubble">${period}</span>
                                            </div>

                                            <div class="content">
                                                <span>모임 방식</span>
                                                <span class="bubble-item bubble">${meetingType}</span>
                                            </div>

                                            <div class="content">
                                            <span>모집 현황</span>
                                            <span class="bubble-item ${recruitmentStateColor}">${recruitmentState}</span>
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

// 모집 중 & 모집완료 게시글 모두
function getPosts() {
    $('#home-section-post').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list',
        success: function (response) {
            let posts = response;

            for (let index = 0; index < posts.length; index++) {
                let id = posts[index]['id'];
                let title = posts[index]['title'];
                let meetingType = posts[index]['meetingType'];
                let period = posts[index]['period'];
                let hits = posts[index]['hits'];
                let recruitmentState = posts[index]['recruitmentState'] ? '모집 완료' : '모집 중';

                let recruitmentStateColor = posts[index]['recruitmentState'] ? 'is-default' : 'is-pink';
                let recruitmentStateColorBack = posts[index]['recruitmentState'] ? 'is-white' : 'is-gray';

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}" onclick="openPost(${id})">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                    </div>

                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span>기간</span>
                                                <span class="bubble-item bubble">${period}</span>
                                            </div>

                                            <div class="content">
                                                <span>모임 방식</span>
                                                <span class="bubble-item bubble">${meetingType}</span>
                                            </div>

                                            <div class="content">
                                            <span>모집 현황</span>
                                            <span id="recruitmentState" class="bubble-item ${recruitmentStateColor}">${recruitmentState}</span>
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
    if (localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
        window.openLoginModal();
    }
    else {
        window.location.href = '/post?id=' + id;
    }
};

/* 사이드바 권한 제한 */
window.authorizationProfile = () => {
    if (localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
        window.openLoginModal();
    }
};

window.authorizationMessage = () => {
    if (localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
        window.openLoginModal();
    }
};

window.authorizationBookmark = () => {
    if (localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
        window.openLoginModal();
    }
};

window.authorizationEditor = () => {
    if (localStorage.getItem('token') == undefined || localStorage.getItem('token') == '') {
        window.openLoginModal();
    }
};