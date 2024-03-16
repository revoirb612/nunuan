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
                    // 파일의 내용을 읽은 후, 해당 내용을 content 필드에 저장합니다.
                    const content = e.target.result;
                    const fileDataToStore  = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        content: content, // 읽은 파일 내용
                        lines: [], // 선택적으로 파일 내용을 줄 단위로 처리하여 저장할 수 있습니다.
                        originalContent: [], // 추가 처리를 위한 원본 내용 저장소
                        removedButtons: [] // 제거된 버튼 정보
                    };

                    // IndexedDB에 파일 메타데이터와 내용을 저장하고, 생성된 ID를 가져옵니다.
                    const fileId = await db.files.add(fileDataToStore);

                    // 생성된 fileId를 사용하여 UI에 파일 버튼 생성 및 추가
                    var fileButton2 = createFileButton2(fileId); // fileId를 인자로 전달
                    document.getElementById('fileButtons').appendChild(fileButton2);
                };
                reader.readAsText(file); // 파일을 읽습니다.
            } else {
                console.error('The file is not a text/plain type.');
            }
        });
        
        Array.from(event.target.files).forEach(function (file) {
            fileData.push({ file: file, lines: [], originalContent: [], removedButtons: [] });
            var fileButton = createFileButton(file);
            document.getElementById('fileButtons').appendChild(fileButton);
        });
    });
}

function createFileButton(file) {
    var button = document.createElement('button');
    var fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    var icon = document.createElement('i');
    icon.className = 'fas fa-file-alt';

    var textSpan = document.createElement('span');
    textSpan.textContent = fileNameWithoutExtension;

    button.appendChild(icon);
    button.appendChild(textSpan);

    button.onclick = function () {
        displayFileContent(file);
    };

    button.classList.add('file-list-button');

    return button;
}

function createFileButton2(fileId) {
    var button = document.createElement('button');

    // IndexedDB에서 fileId를 사용하여 파일 정보 검색
    db.files.get(fileId).then(file => {
        var fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        var icon = document.createElement('i');
        icon.className = 'fas fa-file-alt';

        var textSpan = document.createElement('span');
        textSpan.textContent = fileNameWithoutExtension;

        button.appendChild(icon);
        button.appendChild(textSpan);

        // 버튼 클릭 이벤트: 클릭 시 IndexedDB에서 파일 내용을 검색하여 표시
        button.onclick = function () {
            displayFileContent2(fileId); // 수정된 부분: 파일 객체 대신 fileId 사용
        };

        button.classList.add('file-list-button');
    });

    return button;
}
