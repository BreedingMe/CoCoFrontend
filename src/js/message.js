import $ from 'jquery';
import Cookies from 'js-cookie';

/* JS */
function resizeMessageContainer() {
    let body = $('body');
    let message = $('#message');
    let messageContainer = $('#message .container');

    if (message.innerHeight() <= body.innerHeight()) {
        body.css('height', '100%');
        message.css('height', '100%');
        messageContainer.css('height', '100%');
    }

    if (messageContainer.prop('scrollHeight') > body.innerHeight()) {
        body.css('height', '');
        message.css('height', '');
        messageContainer.css('height', '');
    }
}

// 쪽지 리스트 호출
window.initializeMessage = () => {
    getMessageList();
};

// 쪽지 리스트 불러오기
window.getMessageList = () => {
    getMessageList();
};

window.getCreateMessageList = () => {
    getCreateMessageList();
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
    window.location.reload();
};

// 쪽지 상세보기 모달
window.openReadDetailMessageModal = () => {
    $('#message-read-detail-modal').css('display', 'flex');
};

window.openSendDetailMessageModal = () => {
    $('#message-send-detail-modal').css('display', 'flex');
};

// 쪽지 상세보기 받은 쪽지 닫기
window.closeReadDetailMessageModal = () => {
    $('#message-read-detail-modal').css('display', 'none');
    window.location.reload();
};

// 쪽지 상세보기 보낸 쪽지 닫기
window.closeSendDetailMessageModal = () => {
    $('#message-send-detail-modal').css('display', 'none');
};

// 쪽지 보내기 버튼
window.createMessageButton = () => {
    createMessage();
};

window.createReplyMessage = () => {
    $('#message-read-detail-modal').css('display', 'none');
    $('#message-create-modal').css('display', 'flex');
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

    let token = Cookies.get('token');

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
            if (response.responseJSON.status == 'Unknown receiver') {
                alert('존재하지 않는 회원입니다.');
            }
            if (response.responseJSON.status == 'Not allowed receiver') {
                alert('본인에게 쪽지를 보낼 수 없습니다.');
            }
            if (response.responseJSON.status == 'Bad request') {
                alert('쪽지 내용은 255자 이내로 작성해주세요.');
            }
        }
    });
}

// 받은 쪽지 리스트 불러오기
function getMessageList() {
    $('#getMessageList').attr('class', 'is-active');
    $('#getCreateMessageList').attr('class', '');
    $('#message-list').empty();

    let token = Cookies.get('token');

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
                let date = messages[index]['createDate'] + '+0000';
                const day = new Date(date).toISOString().split('T')[0];
                const time = new Date(date).toTimeString().split(' ')[0];
                const datestr = day + ' ' + time;

                let read = messages[index]['readState'] ? '읽음' : '읽지않음';

                let messagesHTML = `<div class="card" id=${messageId} >
                                        <div class="card-header">
                                            <p class="card-header-title" onclick="getMessage(${messageId})">${title}</p>
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
            resizeMessageContainer();
        },
        error: function (response) {
            if (response.status == 403) {
                window.openLoginModal();
            }
        }
    });
}

// 보낸 쪽지 리스트 불러오기
function getCreateMessageList() {
    $('#message-list').empty();
    $('#getCreateMessageList').attr('class', 'is-active');
    $('#getMessageList').attr('class', '');

    let token = Cookies.get('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/message/list/send',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let messages = response;

            for (let index = 0; index < messages.length; index++) {
                let messageId = messages[index]['id'];
                let receiverNickname = messages[index]['receiver'];
                let title = messages[index]['title'];
                let date = messages[index]['createDate'] + '+0000';
                const day = new Date(date).toISOString().split('T')[0];
                const time = new Date(date).toTimeString().split(' ')[0];
                const datestr = day + ' ' + time;

                let read = messages[index]['readState'] ? '확인' : '미확인';

                let messagesHTML = `<div class="card" id=${messageId} >
                                        <div class="card-header">
                                            <p class="card-header-title" onclick="getMessage(${messageId})">${title}</p>
                                            <button class="button is-light read">${read}</button>
                                            <div onclick="deleteMessage(${messageId})">
                                            <button class="delete"></button>
                                            </div>
                                        </div>
                                        <div class="card-content" onclick="getMessage(${messageId})">
                                            <div class="card-content-box">
                                                <div class="content">
                                                    <div class="tag">받는 사람</div>
                                                    <div class="getMessage">${receiverNickname}</div>
                                                </div>
                                                <div class="content">
                                                    <div class="tag">보낸 시간</div>
                                                    <div class="getMessage">${datestr}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                $('#message-list').append(messagesHTML);
            }
            resizeMessageContainer();
        },
        error: function (response) {
            if (response.status == 403) {
                window.openLoginModal();
            }
        }
    });
}

// 쪽지 상세 읽기
function getMessage(messageId) {
    let token = Cookies.get('token');

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

            let member = message['member'];
            let sender = message['sender'];
            let title = message['title'];
            let content = message['content'];

            if (member == sender) {
                window.openSendDetailMessageModal();
                $('#title-send').html(title);
                $('#content-send').html(content);
            }
            else {
                window.openReadDetailMessageModal();
                $('#title-read').html(title);
                $('#content-read').html(content);
                $('input[id=receiver_createMessage]').val(sender);
            }
        }
    });
}

// 쪽지 삭제
function deleteMessage(messageId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        let token = Cookies.get('token');
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
}
