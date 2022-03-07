interface WSMessage {
    id: number;
    type: "answer" | "request";
    data: any;
}

export default WSMessage;