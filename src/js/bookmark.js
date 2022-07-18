import $ from 'jquery';
import Cookies from 'js-cookie';

/* JS */
window.initializeBookmark = () => {
    getBookmarkList();
};

window.registerBookmark = (id) => {
    registerBookmark(id);
};

window.deleteBookmark = (id) => {
    deleteBookmark(id);
};

// 북마크 저장하기
function registerBookmark(id) {
    console.log(id);
    let token = Cookies.get('token');

    let data = { 'id': id };

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/bookmark/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },

        data: JSON.stringify(data),
        success: function () {
            alert('북마크 저장이 완료되었습니다!');
        },
        error: function (response) {
            console.log(response);
            alert('북마크에 저장되어있는 게시물입니다.');
        }
    });
}

// 북마크 리스트 불러오기
function getBookmarkList() {
    $('#bookmark-list').empty();

    let token = Cookies.get('token');

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/bookmark/list',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: {},
        success: function (response) {
            let bookmarks = response;

            for (let index = 0; index < bookmarks.length; index++) {
                let id = bookmarks[index]['id'];
                let postId = bookmarks[index]['postId'];
                let title = bookmarks[index]['title'];
                let meetingType = bookmarks[index]['meetingType'];
                let period = bookmarks[index]['period'];
                let hits = bookmarks[index]['hits'];
                let recruitmentState = bookmarks[index]['recruitmentState'] ? '모집 완료' : '모집 중';

                let recruitmentStateColor = bookmarks[index]['recruitmentState'] ? 'is-default' : 'is-pink';
                let recruitmentStateColorBack = bookmarks[index]['recruitmentState'] ? 'a' : 'is-gray';

                let tempHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                        <div onclick="deleteBookmark(${id})">
                                            <button class="delete"></button>
                                        </div>
                                    </div>

                                    <div class="card-content" onclick="openPost(${postId})">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span>기간</span>
                                                <span class="bubble-item bubble">${period}</span>
                                            </div>

                                            <div class="content">
                                                <span>모임 방식</span>
                                                <span class="bubble-item bubble">${meetingType}</span>
                                            </div>

                                            <div class="content">
                                            <span>모집 현황</span>
                                            <span id="recruitmentState" class="bubble-item ${recruitmentStateColor}">${recruitmentState}</span>
                                        </div>

                                        </div>
                                        <div class="card-content-box">
                                        <div>
                                            <div class="content">
                                                <i class="fa-regular fa-eye"></i>
                                                <span>${hits}</span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>`;
                $('#bookmark-list').append(tempHTML);
            }
        }
    });
}

// 북마크 삭제
function deleteBookmark(id) {
    let token = Cookies.get('token');
    $.ajax({
        type: 'DELETE',
        url: process.env.BACKEND_HOST + '/bookmark/' + id,

        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },

        success: function (response) {
            console.log(response);
            alert('북마크를 삭제했습니다.');
            window.initializeBookmark();
        },
        error: function (response) {
            console.log(response);
        }
    });
}