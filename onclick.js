async function addContent(instanceId) {
    var newContent = prompt('추가할 내용을 입력하세요:');
    if (newContent) {
        try {
            // 데이터베이스에서 인스턴스 가져오기
            const instance = await db.fileInstances.get(instanceId);
            if (!instance) {
                console.error('Instance not found');
                return;
            }

            // 새로운 내용을 contentLines에 추가
            instance.contentLines.push(newContent);

            // 데이터베이스 업데이트
            await db.fileInstances.update(instanceId, { contentLines: instance.contentLines });

            // 화면에 새로운 내용 추가
            var contentButtons = document.querySelector('.file-content[data-instance-id="' + instanceId + '"] .content-buttons');
            if (contentButtons) {
                var itemButton = createContentButton(newContent, instanceId);
                contentButtons.appendChild(itemButton);
                // contentButtons 정렬 가능하게 설정할 필요가 있다면, 여기에 로직 추가
            }
        } catch (error) {
            console.error('Error adding new content:', error);
        }
    }
}

async function undoRemove(instanceId) {
    try {
        // 데이터베이스에서 인스턴스 가져오기
        const instance = await db.fileInstances.get(instanceId);
        if (!instance || instance.removedLines.length === 0) {
            console.error('No removed content to undo or instance not found');
            return;
        }

        // 마지막으로 삭제된 항목 복원
        var lastRemoved = instance.removedLines.pop();
        instance.contentLines.push(lastRemoved);

        // 데이터베이스 업데이트
        await db.fileInstances.update(instanceId, {
            contentLines: instance.contentLines,
            removedLines: instance.removedLines
        });

        // 화면에 복원된 내용 추가
        var contentButtons = document.querySelector('.file-content[data-instance-id="' + instanceId + '"] .content-buttons');
        if (contentButtons) {
            var itemButton = createContentButton(lastRemoved, instanceId);
            contentButtons.appendChild(itemButton);
            // 필요한 경우 contentButtons 정렬 가능하게 설정
        }
    } catch (error) {
        console.error('Error undoing remove:', error);
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
