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

window.getPostingUserMessage = () => {
    $('#message-create-modal').css('display', 'flex');
};

window.getPostingUserProfile = () => {
    $('#post-profile-modal').css('display', 'flex');
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
            let profileImage = post['profileImageUrl'];
            let githubUrl = post['githubUrl'];
            let portfolioUrl = post['portfolioUrl'];
            let introduction = post['introduction'];
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
            $('#commentImage').attr('src', profileImage);

            if (enableUpdate == false) {
                $('#updatebtn').attr('class', 'button none');
            }

            if (enableDelete == false) {
                $('#deletebtn').attr('class', 'button none');
            }
            window.resizePostContainer();

            // 게시글 쪽지 모달에 데이터 넘겨주기
            $('input[id=receiver_createMessage]').val(nickname);
            // 게시글 프로필 모달에 데이터 넘겨주기
            $('#my_image').attr('src', profileImage);
            $('#nickname_post').text(nickname);
            $('#portfolio_post').text(portfolioUrl);
            $('#github_post').text(githubUrl);
            $('#portfolio_post').text(portfolioUrl);
            $('#github_post').attr('href', githubUrl);
            $('#portfolio_post').attr('href', portfolioUrl);
            $('#introduction_post').text(introduction);
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
    if (confirm('정말 삭제하시겠습니까?')) {
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
    }
};