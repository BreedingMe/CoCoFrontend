import $ from 'jquery';
import Cookies from 'js-cookie';

/* JS */
function resizeBookmarkContainer() {
    let body = $('body');
    let bookmark = $('#bookmark');
    let bookmarkContainer = $('#bookmark .container');

    if (bookmark.innerHeight() <= body.innerHeight()) {
        body.css('height', '100%');
        bookmark.css('height', '100%');
        bookmarkContainer.css('height', '100%');
    }

    if (bookmarkContainer.prop('scrollHeight') > body.innerHeight()) {
        body.css('height', '');
        bookmark.css('height', '');
        bookmarkContainer.css('height', '');
    }
}

window.initializeBookmark = () => {
    getBookmarkList();
};

window.registerBookmark = (id) => {
    registerBookmark(id);
};

window.deleteBookmark = (id) => {
    deleteBookmark(id);
};

window.getBookmarkList = () => {
    getBookmarkList();
};

window.myBookmark = () => {
    getBookmarkList();
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    console.log(bookmarks);
    for (let index = 0; index < bookmarks.length; index++) {
        let bookmarkId = bookmarks[index]['postId'];
        let bookmarkState = bookmarks[index]['bookmarkState'];
        if (bookmarkState == true) {
            $(`#bookmarkColor-${bookmarkId}`).css('color', 'coral');
        }
    }
};

// 북마크 저장하기
function registerBookmark(id) {
    let token = Cookies.get('token');

    let data = { 'id': id };

    $.ajax({
        type: 'POST',
        url: process.env.BACKEND_HOST + '/' + id + '/bookmark',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },

        data: JSON.stringify(data),
        success: function () {
            alert('북마크 저장이 완료되었습니다!');
            getBookmarkList();
            $(`#bookmarkColor-${id}`).css('color', 'coral');
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
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

            for (let index = 0; index < bookmarks.length; index++) {
                let id = bookmarks[index]['id'];
                let postId = bookmarks[index]['postId'];
                let title = bookmarks[index]['title'];
                let meetingType = bookmarks[index]['meetingType'];
                let period = bookmarks[index]['period'];
                let hits = bookmarks[index]['hits'];
                let bookmarkState = bookmarks[index]['bookmarkState'];
                let recruitmentState = bookmarks[index]['recruitmentState'] ? '모집 완료' : '모집 중';

                let recruitmentStateColor = bookmarks[index]['recruitmentState'] ? 'is-default' : 'is-pink';
                let recruitmentStateColorBack = bookmarks[index]['recruitmentState'] ? 'a' : 'is-gray';

                let tempHTML = `<div id=${id} class="card ${recruitmentStateColorBack}">
                                    <div class="card-header">
                                        <p class="card-header-title" onclick="openPost(${postId})">${title}</p>
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
            resizeBookmarkContainer();
        },
        error: function (response) {
            console.log(response);
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