async function createOrUpdateFileInstance(instanceId, originalFileId, customFileName, contentLines, removedLines) {
    const instanceData = {
        originalFileId: originalFileId,
        customFileName: customFileName,
        contentLines: contentLines,
        removedLines: removedLines
    };

    try {
        if (instanceId) {
            // 기존 인스턴스 업데이트
            await db.fileInstances.update(instanceId, instanceData);
            console.log("Instance updated.");
            return instanceId; // 기존 인스턴스 업데이트 경우, 업데이트된 instanceId 반환
        } else {
            // 새 인스턴스 생성
            const id = await db.fileInstances.add(instanceData);
            console.log("New instance created with id:", id);
            return id; // 새로 생성된 인스턴스의 ID 반환
        }
    } catch (err) {
        console.error("Failed to create or update instance:", err);
        throw err; // 에러 발생 시, 이를 호출한 곳으로 전파
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
