async function displayFileContent(instanceId) {
    const fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';
    fileContentDiv.setAttribute('data-instance-id', instanceId); // 인스턴스 ID를 속성으로 추가

    // 헤더 만들기
    var fileHeader = await createFileHeader(instanceId);
    if (fileHeader) {
        fileContentDiv.appendChild(fileHeader);
    }

    // 명렬 버튼 만들기
    var contentButtons = await createContentButtons(instanceId);
    if (contentButtons) {
        contentButtons.className = 'content-buttons';
        fileContentDiv.appendChild(contentButtons);

        // 명렬 버튼 이동 가능하게 만들기
        $(contentButtons).sortable({
            handle: '.drag-handle'
        });
    }

    // 아이콘 버튼 만들기
    var iconButtonContainer = createIconButtonContainer(instanceId);
    fileContentDiv.appendChild(iconButtonContainer);
    
    // 파일 내용을 표시
    document.getElementById('fileContentsContainer').appendChild(fileContentDiv);
    checkFileContentsContainer(); // Check and update message after adding content
}

async function createFileHeader(instanceId) {
    const instance = await db.fileInstances.get(instanceId);
    if (!instance) {
        console.error('File instance not found');
        return null;
    }

    var fileInputDiv = document.createElement('div');
    fileInputDiv.className = 'file-input';

    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = instance.customFileName;
    textInput.className = 'file-name-input';

    // 파일 이름 변경 로직
    textInput.addEventListener('change', async (event) => {
        const newFileName = event.target.value;
        if (newFileName && newFileName !== instance.customFileName) {
            try {
                // 데이터베이스에서 인스턴스의 파일 이름 업데이트
                await db.fileInstances.update(instanceId, { customFileName: newFileName });
                console.log("File name updated successfully:", newFileName);
            } catch (error) {
                console.error("Error updating file name:", error);
            }
        }
    });

    fileInputDiv.appendChild(textInput);
    return fileInputDiv;
}

async function createContentButtons(instanceId) {
    const instance = await db.fileInstances.get(instanceId);
    if (!instance) {
        console.error('File instance not found');
        return null;
    }

    var contentButtons = document.createElement('div');
    contentButtons.style.display = 'flex';
    contentButtons.style.flexDirection = 'row';
    contentButtons.style.flexWrap = 'wrap';

    instance.contentLines.forEach(function(content) {
        var contentButton = createContentButton(content, instanceId);
        contentButtons.appendChild(contentButton);
    });

    return contentButtons;
}

function createContentButton(content, instanceId) {
    var itemContainer = document.createElement('div');
    itemContainer.style.display = 'flex';

    var dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.className = 'drag-handle';

    var button = document.createElement('button');
    button.textContent = content;
    button.className = 'item-button';
    button.onclick = async function() {
        try {
            // 인스턴스 데이터를 가져옴
            const instance = await db.fileInstances.get(instanceId);
            if (!instance) {
                console.error('File instance not found');
                return;
            }

            // 삭제할 내용 라인을 contentLines에서 제거
            const updatedContentLines = instance.contentLines.filter(line => line !== content);

            // 파일 인스턴스 업데이트
            await createOrUpdateFileInstance(instanceId, instance.originalFileId, instance.customFileName, updatedContentLines, [...instance.removedLines, content]);

            // 페이지에서 아이템 컨테이너 삭제
            itemContainer.remove();
            console.log("Content line removed and instance updated.");
        } catch (err) {
            console.error("Failed to remove content line:", err);
        }
    };

    itemContainer.appendChild(dragHandle);
    itemContainer.appendChild(button);
    return itemContainer;
}


function createIconButtonContainer(instanceId) {
    var iconButtonContainer = document.createElement('div');
    iconButtonContainer.className = 'icon-button-container';

    // 버튼 정보 및 클릭 이벤트 핸들러를 배열로 정의
    var buttonsInfo = [
        {icon: 'fa-plus', label: '내용 추가', onClick: () => addContent(instanceId)},
        {icon: 'fa-undo-alt', label: '되돌리기', onClick: () => undoRemove(instanceId)},
        {icon: 'fa-clone', label: '복사하여 파일로 저장', onClick: () => cloneToFilesStore(instanceId)},
        {icon: 'fa-file-export', label: '내보내기', onClick: () => exportToFile(instanceId)}, 
        {icon: 'fa-trash', label: '이 복사본 삭제', onClick: () => deleteFileContent(instanceId)},
    ];

    // Create an icon button
    function createIconButton(iconClass, title) {
        var button = document.createElement('button');
        button.classList.add('icon-button');
        var icon = document.createElement('i');
        icon.className = 'fas ' + iconClass;
        button.appendChild(icon);
        button.title = title; // Tooltip
        return button;
    }
    
    // 버튼 정보 배열을 순회하며 각 버튼을 생성하고, 이벤트 핸들러를 바인딩
    buttonsInfo.forEach(function(buttonInfo) {
        var button = createIconButton(buttonInfo.icon, buttonInfo.label);
        button.onclick = buttonInfo.onClick;
        iconButtonContainer.appendChild(button);
    });

    return iconButtonContainer;
}
