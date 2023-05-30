interface WSQueueElement {
    id: number;
    res: (data: string) => void;
}

export default WSQueueElement;