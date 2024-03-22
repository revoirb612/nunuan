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
    var button = document.createElement('button');
    var deleteButton = document.createElement('button');

    // IndexedDB에서 fileId를 사용하여 파일 정보 검색
    db.files.get(fileId).then(file => {
        var fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        var icon = document.createElement('i');
        icon.className = 'fas fa-file-alt';

        var textSpan = document.createElement('span');
        textSpan.textContent = fileNameWithoutExtension;

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

        // 파일 삭제 버튼 설정
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-file-button';
        deleteButton.onclick = async function() {
            try {
                await db.files.delete(fileId);
                buttonContainer.remove(); // 화면에서 파일 버튼 컨테이너 삭제
                console.log("File deleted successfully");
            } catch (error) {
                console.error("Error deleting file: ", error);
            }
        };

        button.classList.add('file-list-button');
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(deleteButton); // 삭제 버튼을 버튼 컨테이너에 추가
    });

    return buttonContainer; // buttonContainer 반환
}
