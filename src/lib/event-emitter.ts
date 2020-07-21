import { callbackType } from './types'; // eslint-disable-line

type broadCastEventsType = {
    [eventName: string] : Array<callbackType>
}

export class EventEmitter {
    
    private broadCastEvents: broadCastEventsType = {
        '$state-initial': [() => {
            // an empty callback to avoid warning of no listener
        }]
    }

    public addEventListener(event: string, callback: callbackType) {
        this.broadCastEvents[event] = this.broadCastEvents[event] || [];
        this.broadCastEvents[event].push(callback);
    }

    public removeEventListener(event: string, callback: callbackType) {
        const registedcallbacks = this.broadCastEvents[event];
        if (registedcallbacks) {
            let targetIndex = -1;
            for(let i = 0; i < registedcallbacks.length; i++) {
                if (registedcallbacks[i] === callback) {
                    targetIndex = i;
                    break;
                }
            }
            if(targetIndex !== -1) {
                registedcallbacks.splice(targetIndex, 1);
            } else {
                const msg = `[obvious] you are trying to remove a listener of ${event} event, but the listener hasn't been registed`;
                throw new Error(msg);
            }
        } else {
            const msg = `[obvious] you are trying to remove a listener of ${event} event, but ${event} hasn't been registed as a event`;
            throw new Error(msg);
        }
    }

    public emit(event: string, ...args: any[]) {
        const registedcallbacks = this.broadCastEvents[event];
        if(registedcallbacks && registedcallbacks.length !== 0) {
            registedcallbacks.forEach((cb) => {
                try {
                    cb(...args);
                } catch (error) {
                    console.error(`[obvious] one of the callbacks of ${event} event throws an uncaught error`);
                }
            });
        } else {
            console.warn(`[obvious] you have emitted ${event} event, but there is no listener of this event`);
        }
    }
}
