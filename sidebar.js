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
