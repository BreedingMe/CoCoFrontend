/* Third Party JS */

import $ from 'jquery';
import Cookies from 'js-cookie';

/* AJAX */
window.enterkey = () => {
    if (window.event.keyCode == 13) {
        requestLogin();
    }
};

function login(id, password) {
    $('#login-modal-help').text('');

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/login',
        contentType: 'application/json',
        data: JSON.stringify({
            email: id,
            password: password
        }),
        success: function (response) {
            let date = new Date();
            // 3시간
            date.setTime(date.getTime() + 3600000 * 3);
            Cookies.set('token', response['token'], { expires: date });

            window.location.reload();
        },
        error: function () {
            $('#login-modal-help').text('이메일 또는 비밀번호를 잘못 입력했습니다.');
        }
    });
}

/* Event Listener */

window.openLoginModal = () => {
    $('#login-modal').css('display', 'flex');
};

window.closeLoginModal = () => {
    $('#login-modal').css('display', 'none');
    $('#login-modal-input-id').removeClass('is-danger');
    $('#login-modal-input-password').removeClass('is-danger');
    $('#login-modal-help').text('');
    location.href = 'home';
};

window.requestLogin = () => {
    let id = $('#login-modal-input-id').val();
    let password = $('#login-modal-input-password').val();

    // 이메일 입력 여부 검증

    if (id == '') {
        $('#login-modal-input-id').addClass('is-danger');
        $('#login-modal-input-id').focus();
        $('#login-modal-help').text('이메일을 입력해 주세요.');

        return;
    }

    $('#login-modal-input-id').removeClass('is-danger');
    $('#login-modal-help').text('');

    // 비밀번호 입력 여부 검증

    if (password == '') {
        $('#login-modal-input-password').addClass('is-danger');
        $('#login-modal-input-password').focus();
        $('#login-modal-help').text('비밀번호를 입력해 주세요.');

        return;
    }

    $('#login-modal-input-password').removeClass('is-danger');
    $('#login-modal-help').text('');

    // 로그인 API 호출

    $('#login-modal-input-id').val('');
    $('#login-modal-input-password').val('');

    login(id, password);
};