import $ from 'jquery';

// user 아이콘 누르면 profile 뜸
$(document).ready(() => {
    resizeProfileHeight();
    resizeProfileContainerHeight();
    getProfile();
});

/* JS */
// 회원 정보 수정 열기 모달
window.openEditProfileModal = () => {
    $('#modal-post').css('display', 'flex');
};

//회원 정보 수정 취소 모달
window.closeEditProfileModal = () => {
    $('#modal-post').css('display', 'none');
    // window.initializeProfile(); 이거 넣는거 맞나...?
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

/* AJAX */
// /{post_id} -> /post_id
// 회원 정보 받아서 그리기
function getProfile() {
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/user',
        xhrFields: {
            withCredentials: true
        },
        // date: {},
        success: function (response) {
            $('#profile_box').empty();
            let user = response;

            let nickname = user['nickname'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            let introduction = user['introduction'];
            console.log(nickname, github, portfolio, introduction);
            let tempHtml = `<article class="media">
                                <figure class="media-left" style="align-self: center;">
                                    <a class="image is-128x128" href="#">
                                        <img class="is-rounded" style="border-radius: 50%;"
                                            src="./static/profile/basicProfile3.png">
                                    </a>
                                </figure>
                            </article>
                            <a id="edit-profile-modal-open-btn" class="button has-text-centered is-rounded" aria-label="edit" style="float: right;">
                                <span>프로필 수정</span>
                            </a>
                            <nav class="level is-mobile" style="margin-top:2rem; font-size: x-large">
                                <div class="media-content content">
                                    <p>
                                        <strong style="font-weight: bold; font-size: x-large">@${nickname}</strong><br><br>
                                        <a href="${github}"><i class="fa-brands fa-github" style="font-size: xxx-large"
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
    // alert('되나요~');
    $('#modal-post').addClass('is-active');
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/user',
        xhrFields: {
            withCredentials: true
        },
        data: {},
        contentType: 'application/json',

        success: function (response) {
            let user = response;
            console.log();
            let nickname = user['nickname'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            let introduction = user['introduction'];

            console.log(nickname, github, portfolio, introduction);

            $('#nickname').val(`${nickname}`);
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

    console.log(nickname, githubUrl, portfolioUrl, introduction);

    let formData = new FormData();

    if (!nickname == '') {
        formData.append('nickname', nickname);
    }

    if (!githubUrl == '') {
        formData.append('github_url', githubUrl);
    }

    if (!portfolioUrl == '') {
        formData.append('portfolio_url', portfolioUrl);
    }

    if (!introduction == '') {
        formData.append('introduction', introduction);
    }

    let data = {
        'nickname': nickname,
        'githubUrl': githubUrl,
        'portfolioUrl': portfolioUrl,
        'introduction': introduction
    };

    $.ajax({
        type: 'PUT',
        url: process.env.BACKEND_HOST + '/user',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        // cache: false,
        // contentType: false,
        // processData: false,
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
    $('#github-url').val('');
    $('#portfolio-url').val('');
    $('#introduction').val('');
}

// 회원 탈퇴

// function changeScreen(currentScreen) {
//     for (let screen in SCREEN) {
//         $(`#${SCREEN[screen]}`).hide();
//     }
//     $(`#${currentScreen}`).show();
// }