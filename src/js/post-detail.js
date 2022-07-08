import $ from 'jquery';

// 게시글 상세 읽기
window.initializePost = () => {
    getPost();
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
            const day = new Date(date + '+0900').toISOString().split("T")[0];
            const time = new Date(date + '+0900').toTimeString().split(" ")[0];
            const datestr = day + ' ' + time;

            $('#nickname_openPost').html(nickname);
            $('#title_openPost').html(title);
            $('#content_openPost').html(content);
            $('#meetingType_openPost').html(meetingType);
            $('#contact_openPost').html(contact);
            $('#period_openPost').html(period);
            $('#recruitmentState_openPost').html(recruitmentState);
            $('#datestr_openPost').html(datestr);

            // 게시글을 작성한 회원이 아니면 수정/삭제 버튼을 볼 수 없다
            if (enableUpdate == false && enableDelete == false) {
                $('#deletebtn').attr('class', 'button none');
                $('#updatebtn').attr('class', 'button none');
            }
        }
    });
}

// 게시글 수정 페이지로 이동
window.showPostUpdatePage = () => {
    window.location.href = '/postupdate';
};