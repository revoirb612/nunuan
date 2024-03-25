function downloadFile(filename, content) {
    var blob = new Blob([content], {type: "text/plain"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function createFileButton(fileId) {
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'file-button-container'; // 스타일 클래스 적용
    
    var button = document.createElement('button');
    button.className = 'file-list-button'; // 스타일 클래스 적용

    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-file-button'; // 스타일 클래스 적용

    // IndexedDB에서 fileId를 사용하여 파일 정보 검색
    db.files.get(fileId).then(file => {
        var fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        
        var icon = document.createElement('i');
        icon.className = 'fas fa-file-alt';
        var textSpan = document.createElement('span');
        textSpan.textContent = ' ' + fileNameWithoutExtension; // 아이콘과 텍스트 사이 간격 조정

        button.appendChild(icon);
        button.appendChild(textSpan);

        // 파일 내용 표시 버튼 클릭 이벤트
        button.onclick = async function () {
            try {
                var instanceId = await createOrUpdateFileInstance(null, fileId, file.name, file.lines, []);
                await displayFileContent(instanceId);
                console.log("File content displayed successfully");
            } catch (error) {
                console.error("Error displaying file content: ", error);
            }
        };

        // 삭제 버튼에 아이콘 적용
        var deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);

        // 파일 삭제 이벤트
        deleteButton.onclick = async function() {
            try {
                await db.files.delete(fileId);
                buttonContainer.remove(); // 화면에서 파일 버튼 컨테이너 삭제
                console.log("File deleted successfully");
            } catch (error) {
                console.error("Error deleting file: ", error);
            }
        };

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(deleteButton); // 삭제 버튼을 컨테이너에 추가
    });

    return buttonContainer; // buttonContainer 반환
}

document.getElementById('example-file-button').onclick = async function () {
    try {
        // 가상의 데이터 생성
        var fileId = 2024;
        var fileName = "이곳을 클릭하여 제목을 변경할 수 있습니다";
        var fileLines = ["이 버튼을 클릭하면 버튼이 사라집니다",
                         "사라진 버튼의 내용은 클립보드에 저장됩니다",
                         "더하기 버튼을 눌러서 버튼을 추가해보세요", 
                         "되돌리기 버튼으로 삭제된 버튼을 복구시켜 보세요",
                         "북마크 버튼은 복사본의 현재 상태를 템플릿 버튼으로 저장시킬 수 있어요",
                         "다운로드 버튼은 남아있는 버튼을 텍스트 파일로 저장시켜요",
                         "삭제 버튼은.. 역시 삭제 버튼입니다",
                         "드래그 앤 드롭으로 버튼의 순서를 변경할 수 있어요(복사본도..!)",
                         "누누안의 모든 데이터는 브라우저 내부에 저장되며 서버로 전송되지 않습니다",
                         "사용해주셔서 감사합니다",
                         "by 홍쌤",
                        ];

        // 가상의 instanceId 생성 또는 업데이트 - 실제 구현에서는 이 부분을 적절히 조정해야 합니다.
        var instanceId = await createOrUpdateFileInstance(null, fileId, fileName, fileLines, []);
        
        // 파일 내용 표시
        await displayFileContent(instanceId);
        console.log("File content displayed successfully");
    } catch (error) {
        console.error("Error displaying file content: ", error);
    }
};
