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
