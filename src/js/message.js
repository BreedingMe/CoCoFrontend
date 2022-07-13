import $ from 'jquery';

/* JS */
// 쪽지 리스트 호출
window.initializeMessage = () => {
    getMessageList();
};

// 쪽지 보내는 모달
window.openCreateMessageModal = () => {
    $('#message-create-modal').css('display', 'flex');
};

window.closeCreateMessageModal = () => {
    $('#receiver_createMessage').val('');
    $('#title_createMessage').val('');
    $('#content_createMessage').val('');
    $('#message-create-modal').css('display', 'none');
    window.initializeMessage();
};

// 쪽지 상세보기 모달
window.openDetailMessageModal = () => {
    $('#message-detail-modal').css('display', 'flex');
};

window.closeDetailMessageModal = () => {
    $('#message-detail-modal').css('display', 'none');
    window.initializeMessage();
};

// 쪽지 보내기 버튼
window.createMessageButton = () => {
    createMessage();
};

// 글 상세페이지에서 쪽지 보내기 버튼
window.openMessageModal = () => {
    $('#message-create-modal').css('display', 'flex');
};

// 쪽지 상세 읽기
window.getMessage = (messageId) => {
    getMessage(messageId);
};

// 쪽지 삭제하기
window.deleteMessage = (messageId) => {
    deleteMessage(messageId);
};

/* Ajax */
// 쪽지 보내기
function createMessage() {

    let receiver = $('#receiver_createMessage').val();
    let title = $('#title_createMessage').val();
    let content = $('#content_createMessage').val();

    if (receiver == '') {
        alert('받는 사람 닉네임을 입력해주세요!');
        return;
    }

    if (title == '') {
        alert('제목을 입력해주세요!');
        return;
    }

    if (content == '') {
        alert('내용을 입력해주세요!');
        return;
    }

    let data = { 'receiver': receiver, 'title': title, 'content': content };

    let token = localStorage.getItem('token');

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/message',

        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: JSON.stringify(data),

        success: function () {
            alert('쪽지 보내기 완료!');
            window.closeCreateMessageModal();
        },
        error: function (response) {
            console.log(response);
            alert('쪽지 보내기에 실패하였습니다!');
        }
    });
}


// 쪽지 리스트 불러오기
function getMessageList() {
    $('#message-list').empty();

    let token = localStorage.getItem('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/message/list',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let messages = response;

            for (let index = 0; index < messages.length; index++) {
                let messageId = messages[index]['id'];
                let senderNickname = messages[index]['sender'];
                let title = messages[index]['title'];
                let date = messages[index]['createDate'];
                const day = new Date(date + '+0900').toISOString().split('T')[0];
                const time = new Date(date + '+0900').toTimeString().split(' ')[0];
                const datestr = day + ' ' + time;

                let read = messages[index]['readState'] ? '읽음' : '읽지않음';

                let messagesHTML = `<div class="card" id=${messageId} >
                                        <div class="card-header">
                                            <p class="card-header-title">${title}</p>
                                            <button class="button is-light read">${read}</button>
                                            <div onclick="deleteMessage(${messageId})">
                                            <button class="delete"></button>
                                            </div>
                                        </div>
                                        <div class="card-content" onclick="getMessage(${messageId})">
                                            <div class="card-content-box">
                                                <div class="content">
                                                    <div class="tag">보낸 사람</div>
                                                    <div class="getMessage">${senderNickname}</div>
                                                </div>
                                                <div class="content">
                                                    <div class="tag">받은 시간</div>
                                                    <div class="getMessage">${datestr}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                $('#message-list').append(messagesHTML);
            }
        }
    });
}


// 쪽지 상세 읽기
function getMessage(messageId) {
    let token = localStorage.getItem('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/message/' + messageId,

        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},

        success: function (response) {
            let message = response;

            let title = message['title'];
            let content = message['content'];

            $('#title').html(title);
            $('#content').html(content);

            window.openDetailMessageModal();
        }
    });
}


// 쪽지 삭제
function deleteMessage(messageId) {
    let token = localStorage.getItem('token');
    $.ajax({
        type: 'DELETE',
        url: process.env.BACKEND_HOST + '/message/' + messageId,

        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },

        success: function (response) {
            console.log(response);
            alert('쪽지를 삭제했습니다.');
            window.initializeMessage();
        },
        error: function (response) {
            console.log(response);
        }
    });
}


