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
        var fileId = "20130613";
        var fileName = "예시 템플릿.txt";
        var fileLines = ["진", "슈가", "제이홉", "RM", "지민", "뷔", "정국"];

        // 가상의 instanceId 생성 또는 업데이트 - 실제 구현에서는 이 부분을 적절히 조정해야 합니다.
        var instanceId = await createOrUpdateFileInstance(null, fileId, fileName, fileLines, []);
        
        // 파일 내용 표시
        await displayFileContent(instanceId);
        console.log("File content displayed successfully");
    } catch (error) {
        console.error("Error displaying file content: ", error);
    }
};
