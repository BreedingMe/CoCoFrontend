/* Third Party JS */

import $ from 'jquery';

/* AJAX */

function register(id, password, nickname, githubURL, portfolioURL, admin, adminToken) {
    $('#register-modal-help').text('');

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/register',
        contentType: 'application/json',
        data: JSON.stringify({
            email: id,
            password: password,
            nickname: nickname,
            githubUrl: githubURL,
            portfolioUrl: portfolioURL,
            admin: admin,
            adminToken: adminToken
        }),
        success: function () {
            alert('회원 가입을 완료했습니다.');
            window.closeRegisterModal();
        },
        error: function () {
            alert('회원 가입을 실패했습니다.');
        }
    });
}

/* Event Listener */

window.openRegisterModal = () => {
    window.closeLoginModal();

    $('#register-modal').css('display', 'flex');
};

window.closeRegisterModal = () => {
    $('#register-modal').css('display', 'none');
};

window.toggleRegisterModalFieldAdminPassword = () => {
    $('#register-modal-field-admin-token').toggleClass('is-hidden');
};

window.requestRegister = () => {
    let id = $('#register-modal-input-id').val();
    let password = $('#register-modal-input-password').val();
    let confirmPassword = $('#register-modal-input-confirm-password').val();
    let nickname = $('#register-modal-input-nickname').val();
    let githubURL = $('#register-modal-input-github-url').val();
    let portfolioURL = $('#register-modal-input-portfolio-url').val();
    let admin = $('#register-modal-checkbox-admin').prop('checked');
    let adminToken = $('#register-modal-input-admin-token').val();

    if (githubURL == '') {
        githubURL = null;
    }

    if (portfolioURL == '') {
        portfolioURL = null;
    }

    // 이메일 입력 여부 검증

    if (id == '') {
        $('#register-modal-input-id').addClass('is-danger');
        $('#register-modal-input-id').focus();
        $('#register-modal-help').text('이메일을 입력해 주세요.');

        return;
    }

    $('#register-modal-input-id').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 비밀번호 입력 여부 검증

    if (password == '') {
        $('#register-modal-input-password').addClass('is-danger');
        $('#register-modal-input-password').focus();
        $('#register-modal-help').text('비밀번호를 입력해 주세요.');

        return;
    }

    $('#register-modal-input-password').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 비밀번호 확인 입력 여부 검증

    if (confirmPassword == '') {
        $('#register-modal-input-confirm-password').addClass('is-danger');
        $('#register-modal-input-confirm-password').focus();
        $('#register-modal-help').text('비밀번호 확인을 입력해 주세요.');

        return;
    }

    $('#register-modal-input-confirm-password').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 비밀번호 일치 여부 검증

    if (password != confirmPassword) {
        $('#register-modal-input-password').addClass('is-danger');
        $('#register-modal-input-confirm-password').addClass('is-danger');
        $('#register-modal-input-password').focus();
        $('#register-modal-help').text('비밀번호가 일치하지 않습니다.');

        return;
    }

    $('#register-modal-input-password').removeClass('is-danger');
    $('#register-modal-input-confirm-password').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 닉네임 입력 여부 검증

    if (nickname == '') {
        $('#register-modal-input-nickname').addClass('is-danger');
        $('#register-modal-input-nickname').focus();
        $('#register-modal-help').text('닉네임을 입력해 주세요.');

        return;
    }

    $('#register-modal-input-nickname').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 관리자 토큰 입력 여부 검증

    if (admin == true && adminToken == '') {
        $('#register-modal-input-admin-token').addClass('is-danger');
        $('#register-modal-input-admin-token').focus();
        $('#register-modal-help').text('관리자 토큰을 입력해 주세요.');

        return;
    }

    $('#register-modal-input-admin-token').removeClass('is-danger');
    $('#register-modal-help').text('');

    // 회원 가입 API 호출

    $('#register-modal-input-id').val('');
    $('#register-modal-input-password').val('');
    $('#register-modal-input-confirm-password').val('');
    $('#register-modal-input-nickname').val('');
    $('#register-modal-input-github-url').val('');
    $('#register-modal-input-portfolio-url').val('');
    $('#register-modal-checkbox-admin').prop('checked', false);
    $('#register-modal-input-admin-token').val('');
    $('#register-modal-field-admin-token').addClass('is-hidden');

    register(id, password, nickname, githubURL, portfolioURL, admin, adminToken);
};