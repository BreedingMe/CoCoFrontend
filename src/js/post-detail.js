import $ from 'jquery';
import Cookies from 'js-cookie';

window.resizePostContainer = () => {
    let body = $('body');
    let post = $('#post-detail');
    let postContainer = $('#post-detail .container');

    if (post.innerHeight() <= body.innerHeight()) {
        body.css('height', '100%');
        post.css('height', '100%');
        postContainer.css('height', '100%');
    }

    if (postContainer.prop('scrollHeight') > body.innerHeight()) {
        body.css('height', '');
        post.css('height', '');
        postContainer.css('height', '');
    }
};

// 게시글 상세 읽기
window.initializePost = () => {
    getPost();
    window.getCommentList();
    //다른 js에서(코멘트) 불러오는 거라 넣어줌!
};

window.getPostingUserNickname = () => {
    getPostingUserNickname();
};

window.getPostingUserProfile = () => {
    getPostingUserProfile();
};

window.closePostingUserProfile = () => {
    $('#post-profile-modal').css('display', 'none');
};

// 게시글 상세 읽기
function getPost() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let token = Cookies.get('token');
    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/' + params['id'],
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
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
            let date = post['postDate'] + '+0000';
            let enableUpdate = post['enableUpdate'];
            let enableDelete = post['enableDelete'];
            const day = new Date(date).toISOString().split('T')[0];
            const time = new Date(date).toTimeString().split(' ')[0];
            const datestr = day + ' ' + time;

            $('#nickname_openPost').html(nickname);
            $('#title_openPost').html(title);
            $('#content_openPost').html(content);
            $('#meetingType_openPost').html(meetingType);
            $('#contact_openPost').html(contact);
            $('#period_openPost').html(period);
            $('#recruitmentState_openPost').html(recruitmentState);
            $('#datestr_openPost').html(datestr);

            if (enableUpdate == false) {
                $('#updatebtn').attr('class', 'button none');
            }

            if (enableDelete == false) {
                $('#deletebtn').attr('class', 'button none');
            }
            window.resizePostContainer();
        },
        error: function (response) {
            if (response.status == 403) {
                window.openLoginModal();
            }
            else if (response.status == 400) {
                alert('해당 게시글이 존재하지 않습니다.');
                window.location.href = '/home';
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
    let token = Cookies.get('token');
    $.ajax({
        type: 'DELETE',
        url: isAdmin ? process.env.BACKEND_HOST + '/admin/post/' + post.id : process.env.BACKEND_HOST + '/post/' + post.id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
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

// 게시글 상세 읽기에서 쪽지 보내기
function getPostingUserNickname() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let token = Cookies.get('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/' + params['id'],
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let post = response;

            let nickname = post['writer'];

            $('#message-create-modal').css('display', 'flex');
            $('input[id=receiver_createMessage]').attr('value', nickname);
        }
    });
}

// 게시글 상세 읽기에서 유저 프로필 보기
function getPostingUserProfile() {
    $('#aTag').empty();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let token = Cookies.get('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/' + params['id'],
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let user = response;
            console.log(response);
            let profileImage = user['profileImageUrl'];
            let nickname = user['writer'];
            let github = user['githubUrl'];
            let portfolio = user['portfolioUrl'];
            let introduction = user['introduction'];

            $('#my_image').attr('src', profileImage);
            $('#post-profile-modal').css('display', 'flex');
            let htmlTemp = `<span style="font-weight: bold; font-size: x-large"> @<span id="nickname_post" style="font-weight: bold; font-size: x-large">${nickname}</span></span><br>
                            <span style="font-weight: bold;">Github   </span><a id="github_post" href="${github}" target="_blank">${github}</a><br>
                            <span style="font-weight: bold;">Portfolio  </span><a id="portfolio_post" href="${portfolio}"  target="_blank">${portfolio}</a><br>
                            <span style="font-weight: bold;">Introduction  </span><br>
                            <span id="introduction_post" style="font-size: medium;">${introduction}</span>`;
            $('#aTag').append(htmlTemp);
        }
    });
}