import $ from 'jquery';

// 댓글 작성 버튼
// window.writeComment = () => {
//     writeComment();
// };

// window.deleteComment = (commentId) => {
//     deleteComment(commentId);
//     console.log(commentId);
// };

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

// 댓글 작성
window.writeComment = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let comment = $('#comment').val();
    // let today = new Date().toISOString();

    if (comment == '') {
        alert('댓글을 작성해주세요!');
        $('#comment').focus();
        return;
    }

    let data = {
        //에러 났던 이유가 내가 서버에서 comment가 아니라 content로 해놨었음!
        'content': comment
        // 'date_give': today
    };

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/comment/' + params.id,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            alert('댓글이 작성되었습니다');
            // window.getCommentList();
            window.location.reload();
        },
        error: function (response) {
            console.log(response);
            alert('댓글 작성에 실패하였습니다.');
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

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/comment/list/' + params.id,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        date: {},
        success: function (response) {
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                let id = response[i]['id'];
                let comment = response[i]['comments'];
                //서버에서 서비스에서 comments로 리턴해주도록 해놨음!
                let timeComment = new Date(response[i]['createDate'] + '+0900');
                let nickname = response[i]['nickname'];
                let timeBefore = time2str(timeComment);
                let enableDelete = response[i]['enableDelete'];
                // console.log(response[i]['date']);
                let tempHtml = `<article class="media" id="${id}">
                                    <figure class="media-left">
                                        <p class="image is-24x24">
                                            <img style="border-radius: 50%" src="./static/profile/basicProfile3.png">
                                        </p>
                                    </figure>
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                <span style="font-weight: normal">@${nickname}</span>
                                                <small>· ${timeBefore}</small>
                                                <br>
                                                ${comment}
                                                <a id="deleteComment${i}" class=" ${enableDelete == true ? '' : 'none'}  button has-text-centered is-rounded is-small")" onclick="deleteComment(${id})">삭제</a>
                                            </p>
                                        </div>
                                    </div>
                                </article>`;
                $('#comment-box').append(tempHtml);
                // $(document).on('click', `#deleteComment${i}`, { 'id_comment': commentId }, deleteComment);
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
};

// 댓글 수정 보류
// window.updateComment = (id) => {
//     let comment = $('#comment').val();

//     if (comment == '') {
//         alert('댓글을 작성해주세요!');
//         $('#comment').focus();
//         return;
//     }

//     let data = {
//         'content': comment
//     };

//     $.ajax({
//         type: 'PUT',
//         url: process.env.BACKEND_HOST + '/comment/' + id,
//         xhrFields: {
//             withCredentials: true
//         },
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         success: function () {
//             alert('댓글이 수정되었습니다');
//             window.getCommentList();
//         },
//         error: function (response) {
//             console.log(response);
//             alert('댓글 수정에 실패하였습니다.');
//         }
//     });
// };

// 댓글 삭제
window.deleteComment = (id) => {
    $.ajax({
        type: 'DELETE',
        url: process.env.BACKEND_HOST + '/comment/' + id,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: {},
        success: function (response) {
            console.log(response);
            alert('댓글이 삭제되었습니다.');
            // window.getCommentList();
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

// function changeScreen(currentScreen) {
//     for (let screen in SCREEN) {
//         $(`#${SCREEN[screen]}`).hide();
//     } $(`#${currentScreen}`).show();
// }