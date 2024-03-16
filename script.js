async function displayFileContent(fileId) {
    const file = await db.files.get(fileId);
    if (!file) {
        console.error('File not found in the database');
        return;
    }

    var fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';

    // 파일 이름 만들기
    var fileDetails = createFileDetails(file);
    fileContentDiv.appendChild(fileDetails);

    // 명렬 버튼 만들기
    var contentButtons = await createContentButtons(file);
    contentButtons.className = 'content-buttons';
    fileContentDiv.appendChild(contentButtons);

    // 명렬 버튼 이동 가능하게 만들기
    $(contentButtons).sortable({
        handle: '.drag-handle'
    });
    
    // 파일 내용을 표시
    document.getElementById('fileContentsContainer').appendChild(fileContentDiv);
    checkFileContentsContainer(); // Check and update message after adding content
}

// 파일 이름 만들기2
function createFileDetails(file) {
    var fileInputDiv = document.createElement('div');
    fileInputDiv.className = 'file-input';

    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = file.name;
    textInput.className = 'file-name-input';

    // 파일 이름 변경 로직 필요시 여기에 추가

    fileInputDiv.appendChild(textInput);
    return fileInputDiv;
}

async function createContentButtons(file) {
    var contentButtons = document.createElement('div');
    contentButtons.style.display = 'flex';
    contentButtons.style.flexDirection = 'row';
    contentButtons.style.flexWrap = 'wrap';

    // 파일 내용을 줄 단위로 나누고 각 줄에 대한 버튼 생성
    var items = file.content.split('\n');
    items.forEach(function(item) {
        var itemButton = createItemButton(item);
        contentButtons.appendChild(itemButton);
    });
    return contentButtons;
}

function createItemButton(item) {
    var itemContainer = document.createElement('div');
    itemContainer.style.display = 'flex';

    var dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.className = 'drag-handle';

    var button = document.createElement('button');
    button.textContent = item;
    button.className = 'item-button';

    // 아이템 삭제 로직이 필요한 경우 여기에 추가

    itemContainer.appendChild(dragHandle);
    itemContainer.appendChild(button);
    return itemContainer;
}

function createIconButtonContainer(fileIndex, contentButtons) {
    var iconButtonContainer = document.createElement('div');
    iconButtonContainer.className = 'icon-button-container';

    // 버튼 정보 및 클릭 이벤트 핸들러를 배열로 정의
    var buttonsInfo = [
        {icon: 'fa-plus', label: '내용 추가', onClick: () => addContent(fileIndex, contentButtons)},
        {icon: 'fa-undo-alt', label: '되돌리기', onClick: () => undoRemove(fileIndex, contentButtons)},
        {icon: 'fa-file-export', label: '내보내기', onClick: () => exportToFile(contentButtons, fileData[fileIndex].file.name, fileIndex)},
        {icon: 'fa-trash', label: '이 복사본 삭제', onClick: deleteFileContent}
    ];

    // Create an icon button
    function createIconButton(iconClass, title) {
        var button = document.createElement('button');
        button.classList.add('icon-button'); // 여기에 클래스 추가
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
