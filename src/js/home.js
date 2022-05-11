import $ from 'jquery';

import BACKEND_CONFIG from './authority/backend.js';

$(document).ready(() => {
    resizeHomeHeight();
    resizeHomeContainerHeight();

    getPosts();
});

function resizeHomeHeight() {
    let home = $('#home');

    if (home.height() < $('body').height()) {
        home.css('height', '100%');
    }
    else {
        home.css('height', '');
    }
}

function resizeHomeContainerHeight() {
    let homeContainer = $('#home .container');

    if (homeContainer.height() < $('body').height()) {
        homeContainer.css('height', '100%');
    }
    else {
        homeContainer.css('height', '');
    }
}

function getPosts() {
    $('#card-section').empty();

    $.ajax({
        type: 'GET',
        url: BACKEND_CONFIG['HOST'] + ':' + BACKEND_CONFIG['PORT'] + '/post/list',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            let posts = response['posts'];

            for (let index = 0; index < posts.length; index++) {
                let title = posts[index]['title'];
                let recruitmentFields = posts[index]['recruitment_fields'];
                let region = posts[index]['region'];
                let hits = posts[index]['hits'];

                let tempHTML = `<div class="card">
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
                                                <span>모집 분야</span>
                                                <span class="bubble-item">${recruitmentFields}</span>
                                            </div>

                                            <div class="content">
                                                <span>지역</span>
                                                <span class="bubble-item">${region}</span>
                                            </div>
                                        </div>

                                        <div class="card-content-box">
                                            <div>
                                                <div class="content">
                                                    <i class="fa-regular fa-eye"></i>
                                                    <span>${hits}</span>
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

                $('#card-section').append(tempHTML);

                resizeHomeHeight();
                resizeHomeContainerHeight();
            }
        }
    });
}