interface WSQueue {
    [k: number]: (data: string) => void;
}

export default WSQueue;