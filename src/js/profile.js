import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

import SCREEN from './constants/screen.js';

$(document).ready(() => {
    resizeProfileHeight();
    resizeProfileContainerHeight();
    getprofile();
});

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

// 회원 정보 받아서 그리기
function getprofile() {
    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/user/my@gmail.com',
        xhrFields: {
            withCredentials: true
        },
        date: {},
        success: function (response) {
            $('#profile_box').empty();
            let user = response['user'];
            let image = user['image'];
            let nickname = user['nickname'];
            let github = user['github_url'];
            let portfolio = user['portfolio_url'];
            let techStacks = user['tech_stacks'];
            let introduction = user['introduction'];
            console.log(image, nickname, github, portfolio, techStacks, introduction);
            let tempHtml = `<article class="media">
                                <figure class="media-left" style="align-self: center;">
                                    <a class="image is-128x128" href="#">
                                        <img class="is-rounded" style="border-radius: 12px;"
                                            src="${image}">
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
                                        <a href="${portfolio}"><i class="fa-solid fa-blog" style="font-size: xxx-large"
                                                aria-hidden="ture"></i></a><br>
                                        <span style="font-size: medium;">${techStacks}</span><br>
                                        <span style="font-size: medium;">${introduction}</span>
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

function openEditProfileModal() {
    $('#modal-post').addClass('is-active');
}

function closeEditProfileModal() {
    $('#modal-post').removeClass('is-active');
    editProfileContentDelete();
}

// 회원 정보 수정
function editProfile() {
    let password = $('#password').val();
    let newPassword = $('#new_password').val();
    let image = $('#image')[0].files[0];
    let techStacks = [];
    $('input[name="tech-stack"]:checked').each(function () {
        let tech = $(this).val();
        techStacks.push(tech);
    });
    let nickname = $('#nickname').val();
    let githubUrl = $('#github-url').val();
    let portfolioUrl = $('#portfolio-url').val();
    let introduction = $('#introduction').val();
    console.log(password, newPassword, image, techStacks, nickname, githubUrl, portfolioUrl, introduction);

    let formData = new FormData();
    if (!password == '') {
        formData.append('password', password);
    }

    if (!newPassword == '') {
        formData.append('new_password', newPassword);
    }

    if (!image == '') {
        formData.append('image', image);
    }

    if (!techStacks == '') {
        formData.append('tech_stacks[]', techStacks);
    }

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

    $.ajax({
        type: 'PUT',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/user',
        xhrFields: {
            withCredentials: true
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function () {
            alert('수정이 완료되었습니다.');
            window.location.reload();
            changeScreen(SCREEN['HOME']);
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function editProfileContentDelete() {
    $('#password').val('');
    $('#new_password').val('');
    $('#image').val('');
    $('input:checkbox[name="tech-stack"]').prop('checked', false);
    $('#nickname').val('');
    $('#github-url').val('');
    $('#portfolio-url').val('');
    $('#introduction').val('');
}

function changeScreen(currentScreen) {
    for (let screen in SCREEN) {
        $(`#${SCREEN[screen]}`).hide();
    }
    $(`#${currentScreen}`).show();
}