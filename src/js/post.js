import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

import SCREEN from './constants/screen.js';

$(document).ready(() => {
    resizePostHeight();
    resizePostContainerHeight();
});

function resizePostHeight() {
    let post = $('#post');

    if (post.height() < $('body').height()) {
        post.css('height', '100%');
    }
    else {
        post.css('height', '');
    }
}

function resizePostContainerHeight() {
    let postContainer = $('#post .container');

    if (postContainer.height() < $('body').height()) {
        postContainer.css('height', '100%');
    }
    else {
        postContainer.css('height', '');
    }
}

$('#update_bookmark').on('click', toggleBookmark);
$('#update_like').on('click', toggleLike);
$('#writeComment').on('click', writeComment);

function writeComment() {
    let comment = $('#comment').val();
    let today = new Date().toISOString();
    if (comment == '') {
        alert('댓글을 작성해주세요!');
        $('#comment').focus();
    }
    else {
        $.ajax({
            type: 'POST',
            url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/comment/' + window.currentPostId,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'comment': comment,
                'date_give': today
            },
            success: function () {
                alert('댓글이 작성되었습니다');
                getComment1();
            },
        });
    }
}

function getComment1() {
    $('#comment-box').empty();
    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/comment/list/' + window.currentPostId,
        xhrFields: {
            withCredentials: true
        },
        date: {},
        success: function (response) {
            console.log(response);
            let comments = response['comments'];
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i]['comment'];
                let timeComment = new Date(comments[i]['date'] + '+0900');
                console.log(comments[i]['date']);
                let commentId = comments[i]['_id'];
                let timeBefore = time2str(timeComment);
                let tempHtml = `<article class="media" id="${commentId}">
                                    <figure class="media-left">
                                        <p class="image is-24x24">
                                            <img src="https://bulma.io/images/placeholders/128x128.png">
                                        </p>
                                    </figure>
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                <span style="font-weight: normal">@닉네임</span>
                                                <small>· ${timeBefore}</small>
                                                <br>
                                                ${comment}
                                                <a id="deleteComment${i}" class="button has-text-centered is-rounded is-small")">삭제</a>
                                            </p>
                                        </div>
                                    </div>
                                </article>`;
                $('#comment-box').append(tempHtml);
                $(document).on('click', `#deleteComment${i}`, { 'id_comment': commentId }, deleteComment);
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function deleteComment(e) {
    $.ajax({
        type: 'DELETE',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/comment/' + e.data.id_comment,
        xhrFields: {
            withCredentials: true
        },
        data: {},
        success: function (response) {
            console.log(response);
            getComment1();
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60;
    console.log(today, date);
    if (time < 60) {
        return parseInt(time) + '분 전';
    }
    time = time / 60;
    if (time < 24) {
        return parseInt(time) + '시간 전';
    }
    time = time / 24;
    if (time < 7) {
        return parseInt(time) + '일 전';
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toggleBookmark() {
    $.ajax({
        type: 'PUT',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/bookmark/' + window.currentPostId,
        xhrFields: {
            withCredentials: true
        },
        data: {},
        success: function () {
            if ($('#update_bookmark').hasClass('fa-regular') == true) {
                $('#update_bookmark').addClass('fa-solid').removeClass('fa-regular');
            }
            else {
                $('#update_bookmark').addClass('fa-regular').removeClass('fa-solid');
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function toggleLike() {
    if ($('#update_like').hasClass('fa-solid') == true) {
        $.ajax({
            type: 'POST',
            url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/like/' + window.currentPostId,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'post_id': postId,
                'user_id': userId
            },
            success: function () {
                $('#update_like').addClass('fa-reqular').removeClass('fa-solid');
            },
            e: function () {
                $('#update_like').addClass('fa-solid').removeClass('fa-reqular');
            }
        });
    }
}

function changeScreen(currentScreen) {
    for (let screen in SCREEN) {
        $(`#${SCREEN[screen]}`).hide();
    } $(`#${currentScreen}`).show();
}