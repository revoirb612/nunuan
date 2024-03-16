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

// Function to check if fileContentsContainer is empty and display a message
function checkFileContentsContainer() {
    var container = $("#fileContentsContainer");
    if (container.children().length === 0) {
        var emptyMessage = $('<div/>', {
            id: 'emptyContainerMessage',
            text: '누가 누가 안 했나 for Web'
        });

        container.append(emptyMessage);
    } else {
        $('#emptyContainerMessage').remove();
    }
}
