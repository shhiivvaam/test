export const getTag = (task: string) => {
    if (task.includes("|")) {
        return task.split("|")[0].trim()
    }
    return null;
};

export const addTag = (tasks: any, payload: any) => {
    const tag = getTag(payload.task);
    if (tasks?.tags?.hasOwnProperty(tag) && tag !== null) {
        return { tag, ids: [...tasks.tags[tag].ids, payload.id] };
    } else {
        return { tag, ids: [payload.id] };
    }
}

export const editTag = (tasks: any, payload: any) => {
    const currentTag = getTag(payload.task);
    if (currentTag) {
        tasks.items[payload.id].tag = currentTag;
        tasks.items[payload.id].prevTag = payload.tag;
        if (currentTag !== payload.tag) {
            tasks.tags[currentTag] = addTag(tasks, payload);
            removeTag(tasks, payload, payload.tag);
        }
    } else {
        removeTag(tasks, payload, payload.tag);
    }
}

export const removeTag = (tasks: any, payload: any, tag: string | null) => {
    if (tag) {
        const index = tasks?.tags[tag]?.ids.indexOf(payload.id);
        tasks.tags[tag]?.ids?.splice(index, 1);
        if (tasks.tags[tag]?.ids?.length === 0) {
            delete tasks.tags[tag];
        }
    }
}
