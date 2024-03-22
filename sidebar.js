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

function createFileButton(fileId) {
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
        button.onclick = async function () { // async 키워드 추가
            try {
                var instanceId = await createOrUpdateFileInstance(null, fileId, file.name, file.lines, []); // await 키워드 사용
                await displayFileContent(instanceId); // await 키워드 사용
                console.log("File content displayed successfully");
            } catch (error) {
                console.error("Error displaying file content: ", error);
            }
        };

        button.classList.add('file-list-button');
    });

    return button;
}
