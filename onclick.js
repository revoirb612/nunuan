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

async function cloneToFilesStore(instanceId) {
    try {
        const instance = await db.fileInstances.get(instanceId);
        if (!instance) {
            console.error('Instance not found');
            return;
        }
        // 현재 인스턴스의 내용을 files 스토어에 추가
        const newFileId = await db.files.add({
            name: instance.customFileName,
            type: 'text/plain',
            size: 0,
            lines: instance.contentLines,
        });
        console.log("File cloned to files store with new ID:", newFileId);

        // 새로운 fileButton 생성 및 화면에 추가 로직
        var newFileButton = createFileButton(newFileId);
        document.getElementById('fileButtons').appendChild(newFileButton);
        console.log("New file button added to the UI.");
    } catch (error) {
        console.error("Error cloning to files store and adding new file button:", error);
    }
}


async function exportToFile(instanceId) {
    try {
        const instance = await db.fileInstances.get(instanceId);
        if (!instance) {
            console.error('Instance not found');
            return;
        }

        // 파일 이름 설정
        var customFileName = instance.customFileName || 'Untitled';

        // 파일 이름에 확장자가 없으면 '.txt'를 추가
        if (!customFileName.endsWith('.txt')) {
            customFileName += '.txt';
        }

        // 인스턴스의 contentLines 배열에서 텍스트 추출
        var contentText = instance.contentLines.join('\n');
        var blob = new Blob([contentText], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);

        // 사용자가 파일을 다운로드할 수 있게 링크 생성
        var a = document.createElement('a');
        a.href = url;
        a.download = customFileName;
        document.body.appendChild(a); // Firefox에서는 a 요소가 문서에 포함되어 있어야 함
        a.click();
        document.body.removeChild(a); // 사용 후 a 요소 제거
        URL.revokeObjectURL(url); // 생성된 URL 해제
    } catch (error) {
        console.error('Error exporting to file:', error);
    }
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
