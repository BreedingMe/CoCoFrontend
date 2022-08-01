/* Third Party JS */

import $ from 'jquery';
import Cookies from 'js-cookie';

/* JS */

// 검색창에서 엔터치면 searchPost()실행
window.enterkeySearch = () => {
    if (window.event.keyCode == 13) {
        searchPost();
    }
};

// 배너 누르면 새로고침
window.refreshHome = () => {
    window.location.reload();
};

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

// 모집 중 / 모집 마감 버튼 클릭에 따른 이벤트
window.recruitmentStateCheckbox = () => {
    localStorage.setItem('check', $('#recruitmentStateCheckbox').is(':checked'));
    let value = $('#sort-post option:selected').val();
    if ($('input:checkbox[id="recruitmentStateCheckbox"]').is(':checked')) {
        if (value == '1') {
            getPosts();
        }
        else if (value == '2') {
            sortHitsPost();
        }
        else if (value == '3') {
            sortCommentsSizePost();
        }
    }
    else {
        if (value == '1') {
            getRecrutingPosts();
        }
        else if (value == '2') {
            sortRecruitingHitsPost();
        }
        else if (value == '3') {
            sortRecruitingCommentsSizePost();
        }
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

// 다른 페이지에서 북마크 불러오기
window.getPosts = () => {
    getPosts();
};

// 필터 (Select) 변경 감지
window.sortPost = () => {
    $('#home-section-post').empty();
    let value = $('#sort-post option:selected').val();
    if ($('input:checkbox[id="recruitmentStateCheckbox"]').is(':checked')) {
        if (value == '1') {
            getPosts();
        }
        else if (value == '2') {
            sortHitsPost();
        }
        else if (value == '3') {
            sortCommentsSizePost();
        }
    }
    else {
        if (value == '1') {
            getRecrutingPosts();
        }
        else if (value == '2') {
            sortRecruitingHitsPost();
        }
        else if (value == '3') {
            sortRecruitingCommentsSizePost();
        }
    }
};

// 인기순 정렬 (모집 중인거만)
window.sortRecruitingHitsPost = () => {
    $('#home-section-post').empty();
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list/recruit/hits',
        success: function (response) {
            console.log(response);
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
};

// 인기순 정렬 (모집 완료 포함)
window.sortHitsPost = () => {
    $('#home-section-post').empty();
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list/hits',
        success: function (response) {
            console.log(response);
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
};
// 댓글수순 정렬  (모집 중인거만)
window.sortRecruitingCommentsSizePost = () => {
    $('#home-section-post').empty();
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list/recruit/comments',
        success: function (response) {
            console.log(response);
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
};

// 댓글수순 정렬  (모집 완료 포함)
window.sortCommentsSizePost = () => {
    $('#home-section-post').empty();
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list/comments',
        success: function (response) {
            console.log(response);
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
};

// 검색
window.searchPost = () => {
    $('#home-section-post').empty();
    let searchQuery = $('#search-input').val();
    if (searchQuery == '') {
        alert('검색어를 입력해주세요!');
        $('#search-input').focus();
        return;
    }
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/search?query=' + searchQuery,
        success: function (response) {
            console.log(response);
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
};
/* AJAX */
// 모집 중인 게시글만 (default)
function getRecrutingPosts() {
    $('#home-section-post').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list/recruit',
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}">
                                            <i class="fa-solid fa-bookmark" onclick="registerBookmark(${id})"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
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

                let cardHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${id})">${title}</p>
                                        <div class="content bookmark" id="bookmarkColor-${id}" onclick="registerBookmark(${id})">
                                            <i class="fa-solid fa-bookmark"></i>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${id})">
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
            getMyBookmarkList();
        }
    });
}

/* Event Listener */

window.openPost = (id) => {
    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
        window.openLoginModal();
    }
    else {
        window.location.href = '/post?id=' + id;
    }
};

window.removeToggle = () => {
    $('#sidebar-mobile').removeClass('is-active');
    $('#sidebar-menu-mobile').removeClass('is-active');
};

/* 사이드바 권한 제한 */
window.authorizationProfile = () => {
    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
        window.openLoginModal();
    }
    else {
        $('#sidebar-mobile').removeClass('is-active');
        $('#sidebar-menu-mobile').removeClass('is-active');
    }
};

window.authorizationMessage = () => {
    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
        window.openLoginModal();
    }
    else {
        $('#sidebar-mobile').removeClass('is-active');
        $('#sidebar-menu-mobile').removeClass('is-active');
    }
};

window.authorizationBookmark = () => {
    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
        window.openLoginModal();
    }
    else {
        $('#sidebar-mobile').removeClass('is-active');
        $('#sidebar-menu-mobile').removeClass('is-active');
    }
};

window.authorizationEditor = () => {
    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
        window.openLoginModal();
    }
    else {
        $('#sidebar-mobile').removeClass('is-active');
        $('#sidebar-menu-mobile').removeClass('is-active');
    }
};
