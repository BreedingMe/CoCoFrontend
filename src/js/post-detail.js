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
    let token = localStorage.getItem('token');
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
    let token = localStorage.getItem('token');
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