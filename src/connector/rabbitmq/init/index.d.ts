declare class RABBIT {
    channel: any;
    queues: any;
    constructor();
    initChannel(): Promise<unknown>;
    getChannel(): any;
    initQueue(queueName: any, durable: Boolean): any;
    sendDataToRabbit(queueName: any, data: any): Promise<any>;
    /**
     *
     * @param queueName
     * @param callback
     * @param options
     * @param options.noAck, if need to make sure the message proceed let set noAck = false
     */
    consumeData(queueName: any, callback: any, options?: any): void;
}
declare const _default: RABBIT;
export default _default;
