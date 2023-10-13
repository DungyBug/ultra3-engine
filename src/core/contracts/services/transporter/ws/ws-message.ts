interface WSMessage {
    id: number;
    type: "answer" | "request" | "broadcast";
    data: any;
}

export default WSMessage;