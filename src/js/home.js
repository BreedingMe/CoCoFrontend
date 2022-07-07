/* Third Party JS */

import $ from 'jquery';

/* JS */

window.initializeHome = () => {
    getPosts();
};

// function resizeHomeContainer() {
//     let body = $('body');
//     let home = $('#home');
//     let homeContainer = $('#home .container');

//     if (home.innerHeight() <= body.innerHeight()) {
//         body.css('height', '100%');
//         home.css('height', '100%');
//         homeContainer.css('height', '100%');
//     }

//     if (homeContainer.prop('scrollHeight') > body.innerHeight()) {
//         body.css('height', '');
//         home.css('height', '');
//         homeContainer.css('height', '');
//     }
// }

/* AJAX */

function getPosts() {
    $('#home-section-post').empty();

    $.ajax({
        type: 'GET',
        url: process.env.BACKEND_HOST + '/post/list',
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: {},
        success: function (response) {
            let posts = response;

            for (let index = 0; index < posts.length; index++) {
                let id = posts[index]['id'];
                let title = posts[index]['title'];
                let meetingType = posts[index]['meetingType'];
                let contact = posts[index]['contact'];
                let period = posts[index]['period'];
                // let hits = posts[index]['hits'];  cardHTML 내에도 있는데 주석처리 안돼서 지워놨음
                // let likes = posts[index]['likes']; 위와 동일

                // let recruitmentFieldsHTML = '';

                // for (let recruitmentField in recruitmentFields) {
                //     recruitmentFieldsHTML += `<span class="bubble-item">${recruitmentField}</span>`;
                // }

                let cardHTML = `<div class="card" id=${id} onclick ="getPost(${id})">
                                    <div class="card-header">
                                        <p class="card-header-title">${title}</p>
                                        <p class="card-header-icon">
                                            <img src="./static/icon/React.svg" width="16" height="16" class="tech-stack-icon"/>
                                            <img src="./static/icon/Spring.svg" width="16" height="16" class="tech-stack-icon"/>
                                        </p>
                                    </div>
                                    <div class="card-content">
                                        <div class="card-content-box">
                                            <div class="content">
                                                <span></span></span>
                                                <span class="bubble-item">${meetingType}</span>

                                                <span>지역</span>
                                                <span class="bubble-item">${contact}</span>

                                                <span>기간</span>
                                            <span class="bubble-item">${period}</span>
                                        </div>
                                        </div>
                                        <div class="card-content-box">
                                            <div>
                                                <div class="content">
                                                    <i class="fa-regular fa-eye"></i>
                                                    <span></span>
                                                </div>
                                                <div class="content">
                                                    <i class="fa-regular fa-heart"></i>
                                                    <span>좋아요 수</span>
                                                </div>
                                            </div>
                                            <div class="content">
                                                <i class="fa-regular fa-bookmark"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                $('#home-section-post').append(cardHTML);
            }
        }
    });
}

/* Event Listener */

// window.getPost = () => {
//     if (Cookies.get('token') == undefined) {
//         window.openLoginModal();
//     }
// };
