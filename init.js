function toggleSidebar() {
    var sidebarWidth = $('#sidebar').width();

    // 사이드바와 콘텐츠의 'active' 클래스 토글
    $('#sidebar, #content').toggleClass('active');

    // 사이드바의 너비에 따라 콘텐츠와 버튼의 위치 조절
    if ($('#sidebar').hasClass('active')) {
        $('#content').css('margin-left', sidebarWidth + 'px');
        $('#sidebarCollapse').css('left', sidebarWidth + 37 + 'px');
        $('#toggleIcon').removeClass('fa-arrow-right').addClass('fa-arrow-left');
    } else {
        $('#content').css('margin-left', '0');
        $('#sidebarCollapse').css('left', '0');
        $('#toggleIcon').removeClass('fa-arrow-left').addClass('fa-arrow-right');
    }
}

function loadAndCreateFileButtons() {
    db.files.toArray().then(files => {
        files.forEach(file => {
            var button = createFileButton(file.id);
            document.getElementById('fileButtons').appendChild(button);
        });
    }).catch(error => {
        console.error("Error loading files: ", error);
    });
}

async function loadAndDisplayFileInstances() {
    try {
        const instances = await db.fileInstances.toArray();
        for (const instance of instances) {
            await displayFileContent(instance.id);
        }
    } catch (error) {
        console.error("Error displaying file instances: ", error);
    }
}
