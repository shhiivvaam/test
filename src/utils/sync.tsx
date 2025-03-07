import { uploadTasks } from "../api/databse";

class Sync {
    tasks: Array<NodeJS.Timeout>;
    uploadTaskOnGoing: boolean;
    constructor() {
        this.tasks = [];
        this.uploadTaskOnGoing = false;
    };

    sync = (uid: string, tasks: string): void => {
        const timer: NodeJS.Timeout = setTimeout(() => this.uploadData(uid, tasks), 3000);
        if (this.tasks.length === 0 && !this.uploadTaskOnGoing) {
            this.tasks.push(timer);
        } else if (this.tasks.length > 0) {
            this.tasks.forEach((time: NodeJS.Timeout) => {
                clearTimeout(time);
            })
            this.clearArray().then(() => {
                this.tasks.push(timer);
            })
        }
    };

    clearArray = () => new Promise<void>((resolve) => {
        this.tasks = [];
        resolve();
    })

    uploadData = (uid: string, tasks: string) => {
        this.uploadTaskOnGoing = true;
        // uploadCloud(uid, tasks).then((result: UploadResult) => {
        //     this.uploadTaskOnGoing = false;
        //     this.clearArray();
        //     setTimeCreate(uid, result.metadata.timeCreated);
        // }).catch(err => console.error('firebase error', err));
        uploadTasks(uid, tasks).then(() => {
            this.uploadTaskOnGoing = false;
            this.clearArray();
        }).catch(err => {
            console.error('error', err);
        })
    }
}

export default new Sync();
