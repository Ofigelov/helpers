import { uuid4 } from 'fanx-ui-framework/general/helpers/uuid';

class DeviceId {
    public id = '';

    constructor() {
        if (process.browser) {
            const storageClientId = window.localStorage.getItem('deviceId');
            if (storageClientId) {
                this.id = storageClientId;
            } else {
                this.id = uuid4();
                window.localStorage.setItem('deviceId', this.id);
            }
        }
    }
}

export const deviceId = new DeviceId().id;
