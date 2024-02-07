export const findElement = (id, type, boxes, confirm = false) => {
    // Find Item
    if (type === 'item') {
        let result;

        // Find Box Through Item
        if (confirm) {
            return boxes.find(({ items }) => {
                return items.find((item) => item.id === id);
            });
        }

        for(let i = 0; i < boxes.length; i++) {
            const check = boxes[i].items.find((item) => {
                return item.id === id;
            });

            if (check) {
                result = check;
                break;
            }
        }

        return result;
    }

    // Find Box
    if (type === 'box') {
        return boxes.find((box) => box.id === id);
    }
}