function toggleSidebar() {
    var sidebarWidth = $('#sidebar').width();

    // 사이드바와 콘텐츠의 'active' 클래스 토글
    $('#sidebar, #content').toggleClass('active');

    // 사이드바의 너비에 따라 콘텐츠와 버튼의 위치 조절
    if ($('#sidebar').hasClass('active')) {
        $('#content').css('margin-left', sidebarWidth + 'px');
        $('#sidebarCollapse').css('left', sidebarWidth + 37 + 'px');
        $('#toggleIcon').removeClass('fa-arrow-right').addClass('fa-arrow-left');
    } else {
        $('#content').css('margin-left', '0');
        $('#sidebarCollapse').css('left', '0');
        $('#toggleIcon').removeClass('fa-arrow-left').addClass('fa-arrow-right');
    }
}

function setupFileInputChangeEvent() {
    document.getElementById('fileInput').addEventListener('change', function (event) {
        Array.from(event.target.files).forEach(function (file) {
            // 파일 타입 검사: 텍스트 파일인지 확인
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    // 파일의 내용을 읽은 후, 해당 내용을 줄 단위로 lines 배열에 저장합니다.
                    const lines = e.target.result.split(/\r\n|\n/); // 파일 내용을 줄 단위로 분리하여 배열로 저장

                    const fileDataToStore  = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        lines: lines // 줄 단위로 처리된 파일 내용
                    };

                    // IndexedDB에 파일 메타데이터와 내용을 저장하고, 생성된 ID를 가져옵니다.
                    const fileId = await db.files.add(fileDataToStore);

                    // 생성된 fileId를 사용하여 UI에 파일 버튼 생성 및 추가
                    var fileButton = createFileButton(fileId); // fileId를 인자로 전달
                    document.getElementById('fileButtons').appendChild(fileButton);
                };
                reader.readAsText(file); // 파일을 읽습니다.
            } else {
                console.error('The file is not a text/plain type.');
            }
        });
    });
}

function checkFileContentsContainer() {
    var container = $("#fileContentsContainer");
    if (container.children().length === 0) {
        // 기존 메시지와 저작권 정보 제거
        $('#emptyContainerMessage').remove();
        $('#copyrightContainer').remove();

        // 새로운 메시지 컨테이너 생성
        var emptyMessageContainer = $('<div/>', { id: 'emptyContainerMessage' });
        var emptyMessageText = $('<div/>', {
            text: '누가 누가 안 했나 for Web'
        });

        // 저작권 정보 컨테이너 추가
        var copyrightContainer = $('<div/>', {
            id: 'copyrightContainer', // 저작권 정보를 담을 별도의 컨테이너
            class: 'copyright-info', // 스타일링을 위한 클래스 추가
            html: '&copy; 2023-2024<a href="https://revoirb612.notion.site/com-b57409d4fba84c17b29b13c2a90293d2?pvs=4" target="_blank"> 홍승일</a> All Rights Reserved.'
        });

        // 메시지 컨테이너에 텍스트 추가
        emptyMessageContainer.append(emptyMessageText);
        container.append(emptyMessageContainer);

        // 컨테이너에 저작권 정보 컨테이너 추가
        container.append(copyrightContainer);
    } else {
        $('#emptyContainerMessage').remove(); // 컨테이너에 내용이 있으면 메시지 제거
        $('#copyrightContainer').remove(); // 컨테이너에 내용이 있으면 저작권 정보 컨테이너 제거
    }
}



function loadAndCreateFileButtons() {
    db.files.toArray().then(files => {
        files.forEach(file => {
            var button = createFileButton(file.id);
            document.getElementById('fileButtons').appendChild(button);
        });
    }).catch(error => {
        console.error("Error loading files: ", error);
    });
}

async function loadAndDisplayFileInstances() {
    try {
        const instances = await db.fileInstances.toArray();
        for (const instance of instances) {
            await displayFileContent(instance.id);
        }
    } catch (error) {
        console.error("Error displaying file instances: ", error);
    }
}
