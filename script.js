// 파일 업로드 함수
function uploadFile() {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];
    let reader = new FileReader();
    
    reader.onload = function() {
        // 파일을 로컬 스토리지에 저장
        localStorage.setItem(file.name, reader.result);
        displayFiles();
    };
    reader.readAsDataURL(file);
}

// 저장된 파일 목록 표시
function displayFiles() {
    let fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);

        fileList.innerHTML += `<div>${key} <button onclick="deleteFile('${key}')">Delete</button></div>`;
    }
}

// 파일 삭제 함수
function deleteFile(key) {
    localStorage.removeItem(key);
    displayFiles();
}

// 페이지 로드 시 파일 목록 표시
window.onload = displayFiles;
