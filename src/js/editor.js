import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

import SCREEN from './constants/screen.js';

$('#resister').on('click', resisterPost);
$('#cancle').on('click', canclePost);

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

function resisterPost() {
    let title = $('#title-input').val();
    let techStacks = [];
    $('input[name="tech-stack"]:checked').each(function () {
        let tech = $(this).val();
        techStacks.push(tech);
    });

    let recruitmentFields = [];
    $('input[name="recruitment-fields"]:checked').each(function () {
        let recruitment = $(this).val();
        recruitmentFields.push(recruitment);
    });
    console.log(techStacks);
    console.log(recruitmentFields);

    let region = $('#region-input').val();
    let period = $('#period-input').val();
    let contact = $('#contact-input').val();
    let content = $('#content-input').val();

    if (title == '') {
        alert('제목이 입력되지 않았습니다!');

        return;
    }

    if (techStacks.length == '') {
        alert('기술 스택이 선택되지 않았습니다!');

        return;
    }
    if (recruitmentFields.length == '') {
        alert('모집 분야가 선택되지 않았습니다!');

        return;
    }
    if (region == '') {
        alert('지역이 입력되지 않았습니다!');

        return;
    }

    if (period == '') {
        alert('예상 기간이 입력되지 않았습니다!');

        return;
    }

    if (contact == '') {
        alert('문의 방법이 입력되지 않았습니다!');

        return;
    }

    if (content == '') {
        alert('본문이 입력되지 않았습니다!');

        return;
    }

    let formData = new FormData();

    formData.append('title', title);
    formData.append('tech_stacks[]', techStacks);
    formData.append('recruitment_fields[]', recruitmentFields);
    formData.append('region', region);
    formData.append('period', period);
    formData.append('contact', contact);
    formData.append('content', content);

    $.ajax({
        type: 'POST',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/post',
        xhrFields: {
            withCredentials: true },
        data: {
            'title': title,
            'tech_stacks[]': techStacks,
            'recruitment_fields[]': recruitmentFields,
            'region': region,
            'period': period,
            'contact': contact,
            'content': content },
        success: function () {
            alert('글 저장이 완료되었습니다!');
            window.location.reload();
            changeScreen(SCREEN['HOME']);
            registerPostContentDelete();
        },
        error: function (response) {
            console.log(response);
            alert('글 저장에 실패하였습니다!');
        }
    });
}

function canclePost() {
    $('#home').show();
    window.location.reload();
    registerPostContentDelete();
}

function changeScreen(currentScreen) {
    for (let screen in SCREEN) {
        $(`#${SCREEN[screen]}`).hide();
    }
    $(`#${currentScreen}`).show();
}

function registerPostContentDelete() {
    $('#title-input').val('');
    $('input:checkbox[name="tech-stack"]').prop('checked', false);
    $('input:checkbox[name="recruitment-fields"]').prop('checked', false);
    $('#region-input').val('');
    $('#period-input').val('');
    $('#contact-input').val('');
    $('#content-input').val('');
}