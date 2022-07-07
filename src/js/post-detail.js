import $ from 'jquery';

// 게시글 상세 읽기
window.initializePost = () => {
    getPost();
};

// 게시글 상세 읽기
function getPost() {

    console.log();

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

            let nickname = post['writer'];
            let title = post['title'];
            let content = post['content'];
            let meetingType = post['meetingType'];
            let contact = post['contact'];
            let period = post['period'];
            let recruitmentState = post['state'] ? '모집마감' : '모집중';
            let date = post['createDate'];
            const day = new Date(date + '+0900').toISOString().split("T")[0];
            const time = new Date(date + '+0900').toTimeString().split(" ")[0];
            const datestr = day + ' ' + time;

            console.log(response);


            $('#nickname_openPost').html(nickname);
            $('#title_openPost').html(title);
            $('#content_openPost').html(content);
            $('#meetingType_openPost').html(meetingType);
            $('#contact_openPost').html(contact);
            $('#period_openPost').html(period);
            $('#recruitmentState_openPost').html(recruitmentState);
            $('#datestr_openPost').html(datestr);

            // window.openPost();

        }
    });
}
