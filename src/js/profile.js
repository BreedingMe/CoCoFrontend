
import $ from 'jquery';

// user 아이콘 누르면 profile 뜸
$(document).ready(() => {
    resizeProfileHeight();
    resizeProfileContainerHeight();
});

window.initializeProfile = () => {
    getProfile();
};

/* JS */
// 회원 정보 수정 열기 모달
window.openEditProfileModal = () => {
    $('#modal-post').css('display', 'flex');
};

//회원 정보 수정 취소 모달
//이부분이 꼭 필요한지에 대해서 예기해보기(프로필 모달을 받으면 어차피 reload해주면 되니까)
window.closeEditProfileModal = () => {
    $('#modal-post').css('display', 'none');
    window.location.reload();
};

function resizeProfileHeight() {
    let profile = $('#profile');

    if (profile.height() < $('body').height()) {
        profile.css('height', '100%');
    }
    else {
        profile.css('height', '');
    }
}

function resizeProfileContainerHeight() {
    let profileContainer = $('#profile .container');

    if (profileContainer.height() < $('body').height()) {
        profileContainer.css('height', '100%');
    }
    else {
        profileContainer.css('height', '');
    }
}

/* 회원 탈퇴 */
window.withdrawal = () => {
    withdrawal();
};

// /* 창이 닫히면 자동으로 로그아웃 */
// let closingWindow = false;
// $(window).on('focus', function () {
//     closingWindow = false;
//     //if the user interacts with the window, then the window is not being
//     //closed
// });

// // $(window).on('blur', function () {
// //     closingWindow = true;
// //     if (!document.hidden) { //when the window is being minimized
// //         closingWindow = false;
// //     }
// //     $(window).on('resize', function (e) { //when the window is being maximized
// //         closingWindow = false;
// //     });
// //     $(window).off('resize'); //avoid multiple listening
// // });

// $('html').on('mouseleave', function () {
//     closingWindow = true;
//     //if the user is leaving html, we have more reasons to believe that he's
//     //leaving or thinking about closing the window
// });

// $('html').on('mouseenter', function () {
//     closingWindow = false;
//     //if the user's mouse its on the page, it means you don't need to logout
//     //them, didn't it?
// });

// // 웹 브러우저 윈도우 창 종료 직전 발생하는 이벤트
// window.addEventListener('beforeunload', function () {
//     if (closingWindow) {
//         Cookies.remove('token');
//         window.location.href = '/home';
//     }
// });

/* AJAX */
// /{post_id} -> /post_id
// 회원 정보 받아서 그리기
function getProfile() {
    let token = localStorage.getItem('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/user',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            $('#profile_box').empty();
            let user = response;
            let profileImage = user['profileImageUrl'];
            let nickname = user['nickname'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            if (portfolio == '' || portfolio == null) {
                portfolio = '포트폴리오 주소';
            }
            let introduction = user['introduction'];
            if (introduction == '' || introduction == null) {
                introduction = '자기소개';
            }
            console.log(profileImage, nickname, github, portfolio, introduction);
            let tempHtml = `<article class="media">
                            <figure class="media-left" style="align-self: center;">
                                <a class="image is-128x128" href="#">
                                    <img class="is-rounded" style="border-radius: 50%;"
                                    src="${profileImage}">
                                </a>
                            </figure>
                        </article>
                        <button id="logoutbtn" class="button buttonDefault has-text-centered is-rounded" onclick="logout()">로그아웃</button>
                        <a id="edit-profile-modal-open-btn" class="button buttonDefault has-text-centered is-rounded" aria-label="edit" style="float: right;">
                            <span>프로필 수정</span>
                        </a>
                        <nav class="level is-mobile" style="margin-top:2rem; font-size: x-large">
                            <div class="media-content content">
                                <p>
                                    <strong style="font-weight: bold; font-size: x-large">@${nickname}</strong><br><br>
                                    <a href="${github}"><i class="fa-brands fa-github-alt" style="font-size: xxx-large"
                                            aria-hidden="ture"></i></a><br>
                                    <a href="${portfolio}">${portfolio}</a><br>
                                    <span style="font-size: large;">${introduction}</span>
                                </p>
                            </div>
                        </nav>`;
            $('#profile_box').append(tempHtml);
            $('#edit-profile-modal-open-btn').on('click', openEditProfileModal);
            $('#edit-profile-modal-background').on('click', closeEditProfileModal);
            $('#edit-profile-modal-close-btn').on('click', closeEditProfileModal);
            $('#edit-profile-btn').on('click', editProfile);
        },
        error: function (response) {
            console.log(response);
        }
    });
}

// 회원 정보 수정 모달
function openEditProfileModal() {
    let token = localStorage.getItem('token');
    $('#modal-post').addClass('is-active');
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/user',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let user = response;
            let nickname = user['nickname'];
            let profileImage = user['profileImageUrl'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            let introduction = user['introduction'];
            if (github == '' || github == null) {
                github = '깃허브 주소';
            }
            if (portfolio == '' || portfolio == null) {
                portfolio = '포트폴리오 주소';
            }
            if (introduction == '' || introduction == null) {
                introduction = '자기소개';
            }
            console.log(nickname, profileImage, github, portfolio, introduction);

            $('#nickname').val(`${nickname}`);
            $('#profileImage').val(`${profileImage}`);
            $('#githubUrl').val(`${github}`);
            $('#portfolioUrl').val(`${portfolio}`);
            $('#introduction').val(`${introduction}`);
        }
    });
}

function closeEditProfileModal() {
    $('#modal-post').removeClass('is-active');
    editProfileContentDelete();
}

// TODO: password, iamge, techStacks 보류! => 추후 보완 예정
// 회원 정보 수정
// function editProfile() {
window.editProfile = () => {
    let nickname = $('#nickname').val();
    let githubUrl = $('#githubUrl').val();
    let portfolioUrl = $('#portfolioUrl').val();
    let introduction = $('#introduction').val();
    let profileImage = $('input[name="image"]').get(0).files[0];
    let formData = new FormData();
    console.log(nickname, githubUrl, portfolioUrl, introduction, profileImage);

    // formData로 바꿔주는 부분.
    if (!nickname == '') {
        formData.append('nickname', nickname);
    }

    if (!profileImage == '') {
        formData.append('file', profileImage);
    }

    if (!githubUrl == '') {
        formData.append('githubUrl', githubUrl);
    }

    if (!portfolioUrl == '') {
        formData.append('portfolioUrl', portfolioUrl);
    }

    if (!introduction == '') {
        formData.append('introduction', introduction);
    }

    // let data = {
    //     'nickname': nickname,
    //     'profileImageUrl': profileImage,
    //     'githubUrl': githubUrl,
    //     'portfolioUrl': portfolioUrl,
    //     'introduction': introduction
    // };

    let token = localStorage.getItem('token');
    $.ajax({
        type: 'PUT',
        url: process.env.BACKEND_HOST + '/user',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        contentType: false,
        processData: false,
        enctype: 'multipart/form-data',
        data: formData,
        success: function () {
            alert('수정이 완료되었습니다.');
            window.location.reload();
            changeScreen(SCREEN['HOME']);
        },
        error: function (response) {
            console.log(response);
            alert('프로필 수정에 실패하였습니다.');
        }
    });
    // window.location.href = '/profile';
};

function editProfileContentDelete() {
    $('#nickname').val('');
    $('#image').val(`${profileImage}`);
    $('#githubUrl').val('');
    $('#portfolioUrl').val('');
    $('#introduction').val('');
}

// 회원 탈퇴
function withdrawal() {
    let token = localStorage.getItem('token');
    $.ajax({
        type: 'DELETE',
        url: process.env.BACKEND_HOST + '/user',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            console.log(response);
            localStorage.removeItem('token');
            alert('회원탈퇴에 성공했습니다.');
            window.location.href = '/home';
        },
        error: function (response) {
            console.log(response);
        }
    });
}

// 로그아웃
window.logout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.removeItem('token');
    window.location.href = '/home';
};

// function changeScreen(currentScreen) {
//     for (let screen in SCREEN) {
//         $(`#${SCREEN[screen]}`).hide();
//     }
//     $(`#${currentScreen}`).show();
// }

// 유저 프로필 보기 하는거 보류!
// window.openMessageModal = () => {
//     $('#message-create-modal').css('display', 'flex');
// };