import $ from 'jquery';
import Cookies from 'js-cookie';

window.getCommentUserProfile = () => {
    getCommentUserProfile();
};

window.getCommentUserMessage = () => {
    getCommentUserMessage();
};

window.initializeComment = () => {
    $('input[id=receiver_createMessage]').empty();
    getCommentUserMessage();
};

// 댓글 작성
window.writeComment = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let comment = $('#comment').val();

    if (comment == '') {
        alert('댓글을 작성해주세요!');
        $('#comment').focus();
        return;
    }

    let data = {
        //에러 났던 이유가 내가 서버에서 comment가 아니라 content로 해놨었음!
        'content': comment
    };

    let token = Cookies.get('token');

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/' + params.id + '/comment/',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: JSON.stringify(data),
        success: function () {
            alert('댓글이 작성되었습니다');
            window.location.reload();
        },
        error: function (response) {
            console.log(response);
            if (response.status == 400) {
                alert('댓글은 255자 이내로 작성해주세요.');
            }
            else {
                alert('댓글 작성에 실패하였습니다.');
            }
        }
    });
};

// 댓글 리스트 불러오기
window.getCommentList = () => {
    // $('#comment-box').empty();
    // 왜 엠프티는 안되고 val('')을 써야 되는걸까?
    $('#comment').val('');
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let token = Cookies.get('token');
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/' + params.id + '/comment/list',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        date: {},
        success: function (response) {
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                let id = response[i]['id'];
                let comment = response[i]['comments'];
                //서버에서 서비스에서 comments로 리턴해주도록 해놨음!
                let timeComment = new Date(response[i]['createDate'] + '+0000');
                let timeEditComment = new Date(response[i]['modifyDate'] + '+0000');
                let profileImage = response[i]['profileImageUrl'];
                let nickname = response[i]['nickname'];
                let timeBefore = time2str(timeComment);
                let timeEditBefore = time2str(timeEditComment);
                let enableDelete = response[i]['enableDelete'];
                let memberRole = response[i]['memberRole'];
                let isAdmin = false;

                if (memberRole == 'ADMIN') {
                    isAdmin = true;
                }

                let tempHtml = `<article class="media" id="${id}">
                                    <figure class="media-left">
                                        <p class="image is-32x32">
                                            <img style="border-radius: 50%" src="${profileImage}" onclick="getCommentUserProfile(${id})">
                                        </p>
                                    </figure>
                                    <div class="media-content">
                                        <div class="content">
                                            <span style="font-weight: bold" onclick="getCommentUserMessage('${nickname}')">@${nickname}</span>
                                            <small id="${id}-time">· ${timeBefore}</small>
                                            <small id="${id}-timeEdit">· ${timeEditBefore} (편집됨)</small>
                                            <br>
                                            <div class="contents style="word-wrap:break-word word-break:break-all">
                                                <div id="${id}-comment" class="text">${comment}</div>
                                                <div id="${id}-editarea" class="edit" style="display:none">
                                                    <textarea id="${id}-textarea" class="te-edit" rows="5" maxlength="255"></textarea>
                                                </div>
                                            </div>
                                            <a id="delete${id}" class=" ${enableDelete == true ? '' : 'none'}  button has-text-centered is-rounded is-small" style="float:right;" onclick="deleteComment(${id}, ${isAdmin})">삭제</a>
                                            <a id="edit${id}" class=" ${enableDelete == true ? '' : 'none'}  button has-text-centered is-rounded is-small" style="float:right;" onclick="editComment(${id})">수정</a>
                                            <a id="submit${id}" class=" button has-text-centered is-rounded is-small" style="display:none" onclick="updateComment(${id})">수정완료</a>
                                            <a id="cancel${id}" class=" button has-text-centered is-rounded is-small" style="display:none" onclick="hideEdits(${id})">취소</a>
                                        </div>
                                    </div>
                                </article>
                                `;
                $('#comment-box').append(tempHtml);

                if (timeBefore == timeEditBefore) {
                    $(`#${id}-time`).show();
                    $(`#${id}-timeEdit`).hide();
                }
                else {
                    $(`#${id}-time`).hide();
                    $(`#${id}-timeEdit`).show();
                }
            }
            window.resizePostContainer();
        },
        error: function (response) {
            console.log(response);
        }
    });
};

//댓글 수정 버튼
window.editComment = (id) => {
    showEdits(id);
    let comment = $(`#${id}-comment`).text();
    console.log(comment);
    $(`#${id}-textarea`).val(comment);
};

//댓글 수정창
window.showEdits = (id) => {
    $(`#${id}-editarea`).show();
    $(`#submit${id}`).show();
    $(`#cancel${id}`).show();

    $(`#${id}-comment`).hide();
    $(`#delete${id}`).hide();
    $(`#edit${id}`).hide();
};

//댓글 수정 취소 버튼
window.hideEdits = (id) => {
    $(`#${id}-editarea`).hide();
    $(`#submit${id}`).hide();
    $(`#cancel${id}`).hide();

    $(`#${id}-comment`).show();
    $(`#delete${id}`).show();
    $(`#edit${id}`).show();
};

// 댓글 수정완료 버튼 -> 댓글 수정
window.updateComment = (id) => {
    let comment = $(`#${id}-textarea`).val();

    if (comment == '') {
        alert('댓글을 작성해주세요!');
        $('#comment').focus();
        return;
    }

    let data = {
        //에러 났던 이유가 내가 서버에서 comment가 아니라 content로 해놨었음!
        'content': comment
    };

    let token = Cookies.get('token');

    $.ajax({
        type: 'PUT',
        url: process.env.BACKEND_HOST + '/comment/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: JSON.stringify(data),
        success: function () {
            alert('댓글이 수정되었습니다');
            window.location.reload();
        },
        error: function (response) {
            console.log(response);
            if (response.status == 400) {
                alert('댓글은 255자 이내로 작성해주세요.');
            }
            else {
                alert('댓글 작성에 실패하였습니다.');
            }
        }
    });
};

// 댓글 삭제
window.deleteComment = (id, isAdmin) => {
    let token = Cookies.get('token');

    $.ajax({
        type: 'DELETE',
        url: isAdmin ? process.env.BACKEND_HOST + '/admin/comment/' + id : process.env.BACKEND_HOST + '/comment/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            console.log(response);
            alert('댓글이 삭제되었습니다.');
            window.location.reload();
        },
        error: function (response) {
            console.log(response);
        }
    });
};

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60;
    console.log(today, date);
    if (time < 1) {
        return '방금전';
    }
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

// 댓글 유저한테 쪽지 보내기
window.getCommentUserMessage = (nickname) => {
    $('#message-create-modal').css('display', 'flex');
    $('input[id=receiver_createMessage]').val(nickname);
    // 더티 플래그(?) html 돔중에 html 요소가 바뀌는 더티 플래그(변경되었다라는 의미)가 생기게된다.
    // attr은 더티플래그를 더럽다고 생각해서 안받아오지만, .val은 더티플래그가 찍혀서 html 변경되는 값을 받아온다.
};

// 댓글 유저 프로필 보기
window.getCommentUserProfile = (id) => {
    let token = Cookies.get('token');

    $('#aTag').empty();
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/comment/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let user = response;
            let id = user['id'];
            //서버에서 서비스에서 comments로 리턴해주도록 해놨음!
            let profileImage = user['profileImageUrl'];
            let nickname = user['nickname'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            let introduction = user['introduction'];

            $('#my_image').attr('src', profileImage);
            $('#post-profile-modal').css('display', 'flex');
            let htmlTemp = `<div id="${id}">
                                <span style="font-weight: bold; font-size: x-large"> @<span id="nickname_post" style="font-weight: bold; font-size: x-large">${nickname}</span></span><br>
                                <span style="font-weight: bold;">Github   </span><a id="github_post" href="${github}" target="_blank">${github}</a><br>
                                <span style="font-weight: bold;">Portfolio  </span><a id="portfolio_post" href="${portfolio}"  target="_blank">${portfolio}</a><br>
                                <span style="font-weight: bold;">Introduction  </span><br>
                                <span id="introduction_post" style="font-size: medium;">${introduction}</span>
                            </div>`;
            $('#aTag').append(htmlTemp);
        }
    });
};