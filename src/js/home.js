import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

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
                let id = posts[index]['_id'];
                let title = posts[index]['title'];
                let recruitmentFields = posts[index]['recruitment_fields'];
                let region = posts[index]['region'];
                let hits = posts[index]['hits'];

                let tempHTML = `<div class="card" id=${id}>
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
                $(`#${id}`).on('click', function () {
                    window.currentPostId = id;
                    $('#post').show();
                    $('#home').hide();
                    getPost(id);
                    getComment();
                });
            }
        }
    });
}

function getPost(currentPostId) {
    $('#post-box').empty();
    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/post/' + currentPostId,
        xhrFields: {
            withCredentials: true
        },
        date: {},
        success: function (response) {
            console.log(response);
            let post = response['post'];
            let title = post['title'];
            let nickname = post['user_nickname'];
            let techStacks = post['tech_stacks'];
            let recruitment = post['recruitment_fields'];
            let region = post['region'];
            let period = post['period'];
            let contact = post['contact'];
            let content = post['content'];
            let date = post['date'];
            let tempHtml = `<p><span style="font-size: xx-large; font-weight: bold;">${title}</span></p>
                                        <br>
                                        <span style="float: left;">
                                            <figure class="image is-32x32">
                                                <img src="../static/logo.jpeg">
                                            </figure>
                                        </span>
                                        <span style="float: left; margin-left: 8px;">${nickname}</span>
                                        <div style="float: right">
                                            <small>${date}</small>
                                        </div>
                                        <nav class="level is-mobile" style="float: right">
                                            <div class="level-left" style="margin-right: 10px;">
                                                <a  id="update_bookmark" class="level-item" aria-label="bookmark">
                                                    <span class="icon is-small"><i style="color: #F2CB61;" class="fa-regular fa-bookmark"
                                                            aria-hidden="true"></i></span>
                                                </a>
                                            </div>
                                            <div class="level-left">
                                                <a id="update_like" class="level-item" aria-label="heart">
                                                    <span class="icon is-small"><i style="color: #FF7171" class="fa-regular fa-heart"
                                                            aria-hidden="true"></i></span>&nbsp;
                                                    // <span class="like-num" style="font-size: small; color: black">4</span>
                                                </a>
                                            </div>
                                        </nav>
                                        <hr style="margin-top: 40px; margin-bottom: 10px;">
                                        <div class="post-page">
                                            <ul class="area">
                                                <li>
                                                    <span class="component">기술 스택</span>
                                                    <span>${techStacks}</span>
                                                </li>
                                                <li>
                                                    <span class="component">모집 분야</span>
                                                    <span>${recruitment}</span>
                                                </li>
                                                <li>
                                                    <span class="component">지역</span>
                                                    <span>${region}</span>
                                                </li>
                                                <li>
                                                    <span class="component">예상 기간</span>
                                                    <span>${period}</span>
                                                </li>
                                                <li>
                                                    <span class="component" style="margin-bottom: 20px;">문의 방법</span>
                                                    <span>${contact}</span>
                                                </li>
                                            </ul>
                                            <hr style="margin-top: 2px;">
                                            <ul class="area">
                                                <li>
                                                    <span style="font-size: larger; font-weight: bold">프로젝트 내용</span>
                                                </li>
                                                <span>${content}</span>
                                            </ul>
                                        </div>`;
            $('#post-box').append(tempHtml);
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function getComment() {
    $('#comment').empty();
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
                $(document).on('click', `#deleteComment${i}`, {'id_comment': commentId}, deleteComment);
            }
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

function deleteComment(e) {
    $.ajax({
        type: 'DELETE',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/comment/' + e.data.id_comment,
        xhrFields: {
            withCredentials: true
        },
        data: {},
        success: function (response) {
            alert('댓글삭제성공!');
            getComment();
        },
        error: function (response) {
            console.log(response);
        }
    });
}