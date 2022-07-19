import $ from 'jquery';
import Cookies from 'js-cookie';

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
            // localStorage.setItem('comments', JSON.stringify(response));
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                let id = response[i]['id'];
                let comment = response[i]['comments'];
                //서버에서 서비스에서 comments로 리턴해주도록 해놨음!
                let timeComment = new Date(response[i]['createDate'] + '+0000');
                let profileImage = response[i]['profileImageUrl'];
                let nickname = response[i]['nickname'];
                let timeBefore = time2str(timeComment);
                let enableDelete = response[i]['enableDelete'];
                let memberRole = response[i]['memberRole'];
                let isAdmin = false;

                if (memberRole == 'ADMIN') {
                    isAdmin = true;
                }
                let tempHtml = `<article class="media" id="${id}">
                                    <figure class="media-left">
                                        <p class="image is-32x32">
                                            <img style="border-radius: 50%" src="${profileImage}">
                                        </p>
                                    </figure>
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                <span style="font-weight: normal">@${nickname}</span>
                                                <small>· ${timeBefore}</small>
                                                <br>
                                                ${comment}
                                                <a id="deleteComment${i}" class=" ${enableDelete == true ? '' : 'none'}  button has-text-centered is-rounded is-small")" onclick="deleteComment(${id}, ${isAdmin})">삭제</a>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                                `;
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