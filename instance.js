function createOrUpdateFileInstance(instanceId, originalFileId, customFileName, contentLines, removedLines) {
    const instanceData = {
        originalFileId: originalFileId,
        customFileName: customFileName,
        contentLines: contentLines,
        removedLines: removedLines
    };

    if (instanceId) {
        // 기존 인스턴스 업데이트
        db.fileInstances.update(instanceId, instanceData).then(() => {
            console.log("Instance updated.");
        }).catch((err) => {
            console.error("Failed to update instance:", err);
        });
    } else {
        // 새 인스턴스 생성
        db.fileInstances.add(instanceData).then((id) => {
            console.log("New instance created with id:", id);
        }).catch((err) => {
            console.error("Failed to create a new instance:", err);
        });
    }
}

function recreateUIComponentsFromInstance(instanceId) {
    db.fileInstances.get(instanceId).then(instance => {
        if (!instance) {
            console.error('Instance not found');
            return;
        }

        // 여기에서 인스턴스 상태를 바탕으로 UI 컴포넌트 재생성 로직 구현
        // 예: 인스턴스에 저장된 customFileName, contentLines 등을 사용
    });
}
