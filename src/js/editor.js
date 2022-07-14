import $ from 'jquery';
import Cookies from 'js-cookie';

/* 게시글 저장 */
window.registerPost = () => {
    let title = $('#title-input').val();
    let meetingType = $('input[name=btnradio]:checked').val();
    let contact = $('#contact').val();
    let period = $('#period').val();
    let content = $('#content-input').val();

    if (title == '') {
        alert('제목이 입력되지 않았습니다!');

        return;
    }

    if (meetingType == '') {
        alert('모임 방식을 정하지 않았습니다!');

        return;
    }

    if (contact == '') {
        alert('문의 방법이 입력되지 않았습니다!');

        return;
    }

    if (period == '') {
        alert('예상 기간이 입력되지 않았습니다!');

        return;
    }

    if (content == '') {
        alert('본문이 입력되지 않았습니다!');

        return;
    }

    let data = {
        'title': title,
        'meetingType': meetingType,
        'contact': contact,
        'period': period,
        'content': content
    };
    let token = Cookies.get('token');

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/post',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: JSON.stringify(data),
        success: function () {
            alert('글 저장이 완료되었습니다!');
            window.location.href = '/home';
        },
        error: function (response) {
            console.log(response);
            alert('글 저장에 실패하였습니다!');
        }
    });
};

/* 게시글 저장 취소 (홈으로 이동하고, 저장 위해 입력한 값 지움(페이지 전환되면 자동으로 지워짐)) */
window.cancelPost = () => {
    window.location.href = '/';
};

$(document).ready(() => {
    resizeEditorHeight();
    resizeEditorContainerHeight();
});

function resizeEditorHeight() {
    let editor = $('#editor');

    if (editor.height() < $('body').height()) {
        editor.css('height', '100%');
    }
    else {
        editor.css('height', '');
    }
}

function resizeEditorContainerHeight() {
    let editorContainer = $('#editor .container');

    if (editorContainer.height() < $('body').height()) {
        editorContainer.css('height', '100%');
    }
    else {
        editorContainer.css('height', '');
    }
}

// function changeScreen(currentScreen) {
//     for (let screen in SCREEN) {
//         $(`#${SCREEN[screen]}`).hide();
//     }
//     $(`#${currentScreen}`).show();
// }