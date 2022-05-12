import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';


$(document).ready(() => {
    resizeMessageHeight();
    resizeMessageContainerHeight();

    getMessageList();
    $('#createMessage').hide();
});

function resizeMessageHeight() {
    let message = $('#message');

    if (message.height() < $('body').height()) {
        message.css('height', '100%');
    }
    else {
        message.css('height', '');
    }
}

function resizeMessageContainerHeight() {
    let messageContainer = $('#message .container');

    if (messageContainer.height() < $('body').height()) {
        messageContainer.css('height', '100%');
    }
    else {
        messageContainer.css('height', '');
    }
}

function getMessageList() {
    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/message/list',
        xhrFields: {
            withCredentials: true },
        data: {},
        success: function (response) {
            let messages = response['messages'];

            for (let index = 0; index < messages.length; index++) {
                let messageid = messages[index]['_id']
                let senderuserid = messages[index]['sender_user_id'];
                let title = messages[index]['title'];
                let date = messages[index]['date'];
                const day = new Date(date+'+0900').toISOString().split("T")[0]
                const time = new Date(date+'+0900').toTimeString().split(" ")[0];
                const datestr = day + ' ' + time
                let read = messages[index]['read'] ? '읽음' : '읽지않음';

                let tempHTML = `<div class="card" id="getMessageModal">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                        <div class="buttons">
                                            <button class="button is-warning is-light read">${read}</button>
                                        </div>
                                        <a id="deleteMessage" class="delete has-text-right"></a>
                                    </div>
                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <div class="tag">보낸 사람</div>
                                                <div class="getmessage">${senderuserid}</div>
                                            </div>
                                            <div class="content">
                                                <div class="tag">받은 시간</div>
                                                <div class="getmessage">${datestr}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                $('#message-list').append(tempHTML);
                $(document).on('click','#getMessageModal',{index:messageid},openMessageModal);
            }
        }
    });
}

function openMessageModal(e) {
    $('#message-modal').addClass('is-active');

    getMessage(e.data.index);
}

function getMessage(messageid) {
    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/message/' + messageid,
        xhrFields: {
            withCredentials: true },
        data: {},
        success: function (response) {
            console.log(response);
        let message = response['message'];
        let title = message['title'];
        let content = message['content'];

        let tempHTML = `<div id="messageModal" class="modal is-active">
                            <div class="modal-background"></div>
                            <div class="modal-card">
                                <header class="modal-card-head">
                                    <p class="modal-card-title">${title}</p>
                                    <button id="closeMessage" class="delete"></button>
                                </header>
                            <section class="modal-card-body">${content}
                            </section>
                            </div>
                        </div>`;
            $('#message-modal').append(tempHTML);
            $(document).on('click','#closeMessage',closeMessageModal);
    }
});
}
function closeMessageModal() {
    $('#message-modal').empty();
    $('#messageModal').hide();
}

$('#createMessageButton').on('click', createMessageModal);
function createMessageModal() {
    $('#createMessage').show();
    $('#createMessage').addClass('is-active');
    $('#resisterMessageButton').on('click', resisterMessage);
}

function resisterMessage() {
    let title = $('#messagetitle-input').val();
    let receiverid = $('#messagereceiver-input').val();
    let content = $('#messagecontent-input').val();

    if (title == '') {
        alert('제목이 입력되지 않았습니다!');

        return;
    }

    if (content == '') {
        alert('내용이 입력되지 않았습니다!');

        return;
    }

    let formData = new FormData();

    formData.append('title', title);
    formData.append('receiver_id', receiverid);
    formData.append('content', content);

    $.ajax({
        type: 'POST',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/message',
        xhrFields: {
            withCredentials: true },
        data: {
            'title': title,
            'content': content,
            'receiver_id': receiverid
        },
        success: function () {
            alert('쪽지 보내기 완료!');
        },
        error: function (response) {
            console.log(response);
            alert('쪽지 보내기에 실패하였습니다!');
        }
    });
}

$('#closeCreateMessageButton').on('click', closeCreateMessageModal);
function closeCreateMessageModal() {
    $('#message-modal').empty();
    $('#createMessage').hide();
}