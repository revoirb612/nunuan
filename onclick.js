async function addContent(instanceId, contentButtons) {
    var newContent = prompt('추가할 내용을 입력하세요:');
    if (newContent) {
        // 화면에 새로운 내용 추가
        var itemButton = createContentButton(newContent, instanceId); // 이 함수는 인스턴스 ID와 새로운 내용을 사용해야 합니다.
        contentButtons.appendChild(itemButton);

        try {
            // 데이터베이스에서 해당 인스턴스를 가져온다.
            const instance = await db.fileInstances.get(instanceId);
            if (instance) {
                // 새로운 내용을 contentLines 배열에 추가
                instance.contentLines.push(newContent);

                // 데이터베이스에 변경사항 업데이트
                await db.fileInstances.update(instanceId, { contentLines: instance.contentLines });
                console.log("Content added successfully to the instance:", instanceId);
            }
        } catch (error) {
            console.error("Error adding content to the instance:", error);
        }
    }
}


function undoRemove(fileIndex, contentButtons) {
    var lastRemoved = fileData[fileIndex].removedButtons.pop();
    if (lastRemoved) {
        var itemButton = lastRemoved.element;
        contentButtons.appendChild(itemButton);
    }
}

function exportToFile(contentButtons, defaultFileName, fileIndex) {
    var customFileName = fileData[fileIndex].customFileName || defaultFileName;

    // 파일 이름에 확장자가 없으면 '.txt'를 추가
    if (!customFileName.endsWith('.txt')) {
        customFileName += '.txt';
    }

    var items = [];
    for (var i = 0; i < contentButtons.children.length; i++) {
        var itemButton = contentButtons.children[i];
        items.push(itemButton.querySelector('button').textContent);
    }
    var blob = new Blob([items.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = customFileName;
    a.click();
    URL.revokeObjectURL(url);
}

async function deleteFileContent(instanceId) {
    try {
        // 데이터베이스에서 해당 인스턴스 데이터 삭제
        await db.fileInstances.delete(instanceId);
        console.log("Instance deleted successfully:", instanceId);

        // 화면에서 해당 file-content 클래스 요소 삭제
        var fileContentDiv = document.querySelector('.file-content[data-instance-id="' + instanceId + '"]');
        if (fileContentDiv) {
            fileContentDiv.remove();
        }

        // 컨텐츠 컨테이너가 비었는지 확인하고, 필요한 UI 업데이트
        checkFileContentsContainer();
    } catch (error) {
        console.error("Error deleting file content: ", error);
    }
}
