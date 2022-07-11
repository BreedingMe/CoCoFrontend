import $ from 'jquery';

// 게시글 상세 읽기
window.initializePost = () => {
    getPost();
    window.getCommentList();
    //다른 js에서(코멘트) 불러오는 거라 넣어줌!
};

// 게시글 상세 읽기
function getPost() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/' + params['id'],

        xhrFields: {
            withCredentials: true },
        data: {},
        contentType: 'application/json',

        success: function (response) {
            let post = response;
            localStorage.setItem('post', JSON.stringify(post));

            let nickname = post['writer'];
            let title = post['title'];
            let content = post['content'];
            let meetingType = post['meetingType'];
            let contact = post['contact'];
            let period = post['period'];
            let recruitmentState = post['recruitmentState'] ? '모집마감' : '모집중';
            let date = post['postDate'];
            let enableUpdate = post['enableUpdate'];
            let enableDelete = post['enableDelete'];
            const day = new Date(date + '+0900').toISOString().split('T')[0];
            const time = new Date(date + '+0900').toTimeString().split(' ')[0];
            const datestr = day + ' ' + time;

            let htmlTemp = `<div class="post-boundary">
            <button id="deletebtn" class="button has-text-centered is-rounded deletebtn" onclick="deletePost()">삭제</button>
            <button id="updatebtn" class="button has-text-centered is-rounded updatebtn" onclick="showPostUpdatePage()">수정</button>
            <p><div style="font-size: xx-large; font-weight: bold;" id="title_openPost">${title}</div></p>
                    <br>
                        <span style="float: left; margin-left: 8px;" id="nickname_openPost">${nickname}</span>
                        <div style="float: right">
                            <small id="datestr_openPost">${datestr}</small>
                        </div>
                        <hr style="margin-top: 40px; margin-bottom: 10px;">
                        <div class="post-page">
                            <ul class="area">
                                <l>
                                    <span class="component">모집 여부</span>
                                    <span id="recruitmentState_openPost">${recruitmentState}</span>
                                </li>
                                <li>
                                    <span class="component">모임 방법</span>
                                    <span id="meetingType_openPost">${meetingType}</span>
                                </li>
                                <li>
                                    <span class="component">문의 방법</span>
                                    <span id="contact_openPost">${contact}</span>
                                </li>
                                <li>
                                    <span class="component">예상 기간</span>
                                    <span id="period_openPost">${period}</span>
                                </li>
                            </ul>
                            <hr style="margin-top: 2px;">
                            <ul class="area">
                                <li>
                                    <span style="font-size: larger; font-weight: bold">프로젝트 내용</span>
                                </li>
                            </ul>
                            <div id="content_openPost" style="white-space:pre">${content}</div>
                        </div>
                    </div>`;

            $('#postingbox').append(htmlTemp);
            // $('#nickname_openPost').html(nickname);
            // $('#title_openPost').html(title);
            // $('#content_openPost').html(content);
            // $('#meetingType_openPost').html(meetingType);
            // $('#contact_openPost').html(contact);
            // $('#period_openPost').html(period);
            // $('#recruitmentState_openPost').html(recruitmentState);
            // $('#datestr_openPost').html(datestr);

            if (enableUpdate == false) {
                $('#updatebtn').attr('class', 'button none');
            }

            if (enableDelete == false) {
                $('#deletebtn').attr('class', 'button none');
            }
        }
    });
}

// 게시글 수정 페이지로 이동
window.showPostUpdatePage = () => {
    window.location.href = '/postupdate';
};

// 게시글 삭제
window.deletePost = () => {
    let post = JSON.parse(localStorage.getItem('post'));
    let memberRole = post.memberRole;
    let isAdmin = false;

    if (memberRole == 'ADMIN') {
        isAdmin = true;
    }

    $.ajax({
        type: 'DELETE',
        url: isAdmin ? process.env.BACKEND_HOST + '/admin/post/' + post.id : process.env.BACKEND_HOST + '/post/' + post.id,

        xhrFields: {
            withCredentials: true },
        data: {},

        success: function () {
            alert('글 삭제가 완료되었습니다.');
            window.location.href = '/home';
        },
        error: function (response) {
            console.log(response);
            alert('글 삭제에 실패하였습니다!');
        }
    });
};