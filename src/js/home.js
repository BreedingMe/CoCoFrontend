import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

// 로그인모달
$('#login-modal-open-btn').on('click', openLoginModal);
$('#login-modal-background').on('click', closeLoginModal);
$('#login-btn').on('click', login);
$('#register-btn').on('click', openRegisterModal);
// 구글 로그인
$('#oauth-google').on('click', oauthGoogle);
$('#login-modal-close-btn').on('click', closeLoginModal);
// 이메일모달
$('#id-modal-background').on('click', closeRegisterModal);
$('#access-code-btn').on('click', sendAccessCode);
$('#verification-btn').on('click', emailVerification);
$('#id-modal-close-btn').on('click', closeRegisterModal);
//비밀번호모달
$('#password-modal-background').on('click', closePasswordModal);
$('#password-check-btn').on('click', checkPassword);
$('#password-modal-close-btn').on('click', closePasswordModal);
// 기타정보모달
$('#others-modal-background').on('click', closeOthersdModal);
$('#others-check-btn').on('click', checkOthers);
$('#others-modal-close-btn').on('click', closeOthersdModal);
// 기술스택모달
$('#tech-stacks-modal-background').on('click', closeTechStacksModal);
$('#frontend').on('click', openFrontendList);
$('#backend').on('click', openBackendList);
$('#android').on('click', openAndroidList);
$('#ios').on('click', openIosList);
$('#design').on('click', openDesignList);
$('#tech-stacks-check-btn').on('click', checkTechStacks);
$('#tech-stacks-modal-close-btn').on('click', closeTechStacksModal);

$(document).ready(() => {
    resizeHomeHeight();
    resizeHomeContainerHeight();

    getPosts();
});

function resizeHomeHeight() {
    let home = $('#home');

    if (home.height() < $('body').height()) {
        home.css('height', '100%');
    }
    else {
        home.css('height', '');
    }
}

function resizeHomeContainerHeight() {
    let homeContainer = $('#home .container');

    if (homeContainer.height() < $('body').height()) {
        homeContainer.css('height', '100%');
    }
    else {
        homeContainer.css('height', '');
    }
}

function getPosts() {
    $('#card-section').empty();

    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/post/list',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            let posts = response['posts'];

            for (let index = 0; index < posts.length; index++) {
                let title = posts[index]['title'];
                let recruitmentFields = posts[index]['recruitment_fields'];
                let region = posts[index]['region'];
                let hits = posts[index]['hits'];

                let tempHTML = `<div class="card">
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
                                                <span class="bubble-item">${recruitmentFields}</span>
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
                                                    <span>좋아요 수</span>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <i class="fa-regular fa-bookmark"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                $('#card-section').append(tempHTML);

                resizeHomeHeight();
                resizeHomeContainerHeight();
            }
        }
    });
}

// 로그인
function openLoginModal() {
    // 쿠키가 있으면 프로필 화면으로 이동
    if (getCookie('token')) {
        // 프로필 화면
        console.log('프로필 화면으로 이동');
    }
    // 쿠키가 없으면 로그인 화면으로 이동
    else {
        $('#login-modal').addClass('is-active');
    }
}

function closeLoginModal() {
    $('#login-id').val('');
    $('#login-pwd').val('');
    $('#help-id-login').text('');
    $('#help-password-login').text('');
    $('#login-modal').removeClass('is-active');
}

function login() {
    let id = $('#login-id').val();
    let password = $('#login-pwd').val();

    if (id == '') {
        $('#help-id-login').text('이메일을 입력해주세요');
        $('#login-id').focus();
        // return;
    }
    else {
        $('#help-id-login').text('');
    }

    if (password == '') {
        $('#help-password-login').text('비밀번호를 입력해주세요.');
        $('#login-pwd').focus();
        // return;
    }
    else {
        $('#help-password-login').text('');
    }

    $.ajax({
        type: 'POST',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/login',
        xhrFields: {
            withCredentials: true
        },
        data: {
            id: id,
            password: password
        },
        success: function (response) {
            if (response['status'] == 'Success') {
                // 로그인 하면 쿠키를 생성
                setCookie('token', response['token'], 1);
                alert('로그인 완료');
                window.location.href = '/';
            }
        },
        error: function (response) {
            console.log(response['status']);
            alert('이메일/비밀번호가 일치하지 않습니다.');
        }
    });
}

function oauthGoogle() {
    ///
}

// 이메일
function openRegisterModal() {
    $('#register-id-modal').addClass('is-active');
}

function closeRegisterModal() {
    $('#id').val('');
    $('#password1').val('');
    $('#password2').val('');
    $('#nickname').val('');
    $('#github-url').val('');
    $('#portfolio-url').val('');
    $('input:checkbox[name="tech-stack"]').prop('checked', false);
    $('#register-id-modal').removeClass('is-active');
}

function sendAccessCode() {
    let id = $('#id').val();
    checkId(id);

    $.ajax({
        type: 'POST',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/verification',
        data: { id: id },
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            if (response['status'] == 'Success') {
                alert('인증번호를 전송했습니다!');
            }
        },
        error: function (response) {
            console.log(response['status']);
        }
    });
}

function emailVerification() {
    let id = $('#id').val();
    let accessCode = $('#access-code').val();
    checkId(id);

    $.ajax({
        type: 'PUT',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/verification',
        xhrFields: {
            withCredentials: true
        },
        data: {
            id: id,
            code: accessCode
        },
        success: function (response) {
            if (response['status'] == 'Success') {
                alert('인증에 성공했습니다.');
                $('#register-passwored-modal').addClass('is-active');
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function checkId(id) {
    if (id == '') {
        alert('이메일을 입력해주세요!');
        $('#id').focus();
        return;
    }
    else if (!isEmail(id)) {
        alert('정확히 입력해주세요.');
        $('#id').focus();
        return;
    }
}

function isEmail(email) {
    let regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/i;
    return regExp.test(email);
}

// 비밀번호
function closePasswordModal() {
    $('#register-passwored-modal').removeClass('is-active');
}

function checkPassword() {
    let password1 = $('#password1').val();
    let password2 = $('#password2').val();

    if (password1 === '') {
        alert('비밀번호를 입력해주세요!');
        $('#password1').focus();
    }
    else if (password1 !== password2) {
        alert('비밀번호가 다릅니다!');
        $('#password1').focus();
    }
    else if (!isPassword(password1)) {
        alert('영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요.');
        $('#password1').focus();
    }
    else {
        $('#register-others-modal').addClass('is-active');
    }
}

function isPassword(password) {
    let regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/;
    return regExp.test(password);
}

// 기타 정보 입력
function closeOthersdModal() {
    $('#register-others-modal').removeClass('is-active');
}

function checkOthers() {
    let nickname = $('#nickname').val();

    if (nickname === '') {
        alert('닉네임은 필수로 입력해주세요!');
        $('#nickname').focus();
    }
    else {
        clearTechlist();
        $('#register-tech-modal').addClass('is-active');
    }
}

function clearTechlist() {
    $('#tech-frontend-list').hide();
    $('#tech-backend-list').hide();
    $('#tech-android-list').hide();
    $('#tech-ios-list').hide();
    $('#tech-design-list').hide();
}

// 기술스택
function closeTechStacksModal() {
    $('#register-tech-modal').removeClass('is-active');
}

function openFrontendList() {
    $('#tech-frontend-list').show();
    $('#tech-backend-list').hide();
    $('#tech-android-list').hide();
    $('#tech-ios-list').hide();
    $('#tech-design-list').hide();
}

function openBackendList() {
    $('#tech-frontend-list').hide();
    $('#tech-backend-list').show();
    $('#tech-android-list').hide();
    $('#tech-ios-list').hide();
    $('#tech-design-list').hide();
}

function openAndroidList() {
    $('#tech-frontend-list').hide();
    $('#tech-backend-list').hide();
    $('#tech-android-list').show();
    $('#tech-ios-list').hide();
    $('#tech-design-list').hide();
}

function openIosList() {
    $('#tech-frontend-list').hide();
    $('#tech-backend-list').hide();
    $('#tech-android-list').hide();
    $('#tech-ios-list').show();
    $('#tech-design-list').hide();
}

function openDesignList() {
    $('#tech-frontend-list').hide();
    $('#tech-backend-list').hide();
    $('#tech-android-list').hide();
    $('#tech-ios-list').hide();
    $('#tech-design-list').show();
}

function checkTechStacks() {
    let checkStacks = $('input:checkbox[name=tech-stack]:checked').length;

    if (checkStacks === 0) {
        alert('최소 1개 이상은 선택해주세요!');
        return;
    }

    register();
}

function register() {
    let id = $('#id').val();
    let password = $('#password1').val();
    let nickname = $('#nickname').val();
    let githubUrl = '';
    if ($('#github-url').val()) {
        githubUrl = $('#github-url').val();
    }

    let portfolioUrl = '';
    if ($('#portfolio-url').val()) {
        portfolioUrl = $('#portfolio-url').val();
    }

    let techStack = [];
    $('input[type="checkbox"]:checked').each(function () {
        let tech = $(this).val();
        techStack.push(tech);
    });

    $.ajax({
        type: 'POST',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/user',
        xhrFields: {
            withCredentials: true
        },
        data: {
            'id': id,
            'password': password,
            'nickname': nickname,
            'github_url': githubUrl,
            'portfolio_url': portfolioUrl,
            'tech_stacks': techStack
        },
        success: function (response) {
            if (response['status'] == 'Success') {
                alert('회원 가입에 성공했습니다!');
                window.location.reload();
            }
        },
        error: function (response) {
            console.log(response);
            alert('회원 가입에 실패했습니다.');
        }
    });
}

// function setCookie(name, value, exp, path, domain) {
//     let date = new Date();
//     date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
//     let cookieText = excape(name) + '=' + escape(value);
//     cookieText += (exp ? '; EXPIRES=' + exp.toGMTString() : '; EXPIRES=' + date.toUTCString());
//     cookieText += (path ? '; PATH=' + cookiePath : '; PATH=/');
//     cookieText += (domain ? '; DOMAIN=' + cookieDomain : '');
//     document.cookie = cookieText;
// }

// function getCookie(name) {
//     let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
//     return value ? unescape(value[2]) : null;
// }

function setCookie(cookieName, cookieValue, cookieExpire, cookiePath, cookieDomain, cookieSecure) {
    let cookieText = escape(cookieName) + '=' + escape(cookieValue);
    cookieText += (cookieExpire ? '; EXPIRES=' + cookieExpire : '');
    cookieText += (cookiePath ? '; PATH=' + cookiePath : '');
    cookieText += (cookieDomain ? '; DOMAIN=' + cookieDomain : '');
    cookieText += (cookieSecure ? '; SECURE' : '');
    document.cookie = cookieText;
}

function getCookie(cookieName) {
    let cookieValue = null;
    if (document.cookie) {
        let array = document.cookie.split((escape(cookieName) + '='));
        if (array.length >= 2) {
            let arraySub = array[1].split(';');
            cookieValue = unescape(arraySub[0]);
        }
    }
    return cookieValue;
}