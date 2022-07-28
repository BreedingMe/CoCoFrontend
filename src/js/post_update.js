import $ from 'jquery';
import Cookies from 'js-cookie';

// postupdate 페이지를 띄울 때 실행
window.initializePostupdate = () => {
    showPostInfo();
};

// 게시글 수정 화면을 띄울 때, 현재 게시글 정보 (제목, 모임방식, 문의방법, 예상기간, 본문)를 띄워놓음
function showPostInfo() {
    let post = JSON.parse(localStorage.getItem('post'));
    console.log(post);
    $('#title-update-input').val(`${post.title}`);
    $(`input:radio[name="btnradio-recruitment"]:input[value=${post.recruitmentState}]`).attr('checked', true);
    $(`input:radio[name="btnradio-update"]:input[value=${post.meetingType}]`).attr('checked', true);
    $('#period').val(`${post.period}`);
    $('#contact').val(`${post.contact}`);
    $('#content-update-input').val(`${post.content}`);
}

/* 게시글 수정 */
window.updatePost = () => {
    // 게시글 정보 가져오기
    let post = JSON.parse(localStorage.getItem('post'));

    let title = $('#title-update-input').val();
    let recruitmentState = $('input[name=btnradio-recruitment]:checked').val();
    let meetingType = $('input[name=btnradio-update]:checked').val();
    let contact = $('#contact').val();
    let period = $('#period').val();
    let content = $('#content-update-input').val();

    if (title == '') {
        alert('제목이 입력되지 않았습니다!');

        return;
    }

    if (recruitmentState == '') {
        alert('모임 방식을 정하지 않았습니다!');

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

    // 전송할 데이터
    let data = {
        'title': title,
        'recruitmentState': recruitmentState,
        'meetingType': meetingType,
        'contact': contact,
        'period': period,
        'content': content
    };
    console.log(data);

    let token = Cookies.get('token');
    console.log(token);

    // 게시글 수정 요청
    $.ajax({
        type: 'PUT',
        url: process.env.BACKEND_HOST + '/post/' + post.id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: JSON.stringify(data),
        success: function () {
            alert('글 수정이 완료되었습니다!');
            window.location.href = '/post?id=' + post.id;
        },
        error: function (response) {
            console.log(response);
            if (response.status == 400) {
                alert('본문은 2000자 이내로 작성해주세요.');
            }
            else {
                alert('글 수정에 실패하였습니다!');
            }
        }
    });
};

/* 게시글 수정 취소 (게시글 상세 페이지로 이동하고, 저장 위해 입력한 값 지움) */
window.cancelUpdate = () => {
    let post = JSON.parse(localStorage.getItem('post'));
    window.location.href = '/post?id=' + post.id;
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