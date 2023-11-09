import IndexedDb from './IndexedDb'

class IncidentRepository {
    constructor() {
        this.dbName = "incidentdb";
        this.tableName = "userform";
        this.processedRecords = "userFormProcessed";
        this.db = new IndexedDb(this.dbName);
        this.channel = new BroadcastChannel('datasync');
        this.formPostUrl = "";
        this.db.createObjectStore([this.tableName, this.processedRecords]);
    }

    // async syncData() {
    //     await this.db.createObjectStore([this.tableName]);
    //     const records = await this.db.getAllValue(this.tableName);
    //     records.forEach((rec) => this.sendToServer(rec, this.db));
    // }

    async getPendingRecordsCount() {
        await this.db.createObjectStore([this.tableName]);
        const keys = await this.db.getAllKeys(this.tableName);
        return keys.length;
    }

    async getRecords() {
        await this.db.createObjectStore([this.tableName]);
        const keys = await this.db.getAllValue(this.tableName);
        return keys
    }

    async enqueueForSync(incidentRecord) {
        await this.db.createObjectStore([this.tableName]);
        this.db.putValue(this.tableName, incidentRecord);
    }
    

    async addProcessedRecord(incidentRecord) {
        await this.db.createObjectStore([this.processedRecords]);
        this.db.putValue(this.processedRecords, incidentRecord);
    }

    async getProcessedRecordsCount() {
        await this.db.createObjectStore([this.processedRecords]);
        const keys = await this.db.getAllKeys(this.processedRecords);
        return keys.length;
    }

    // async sendToServer(incidentRecord, db) {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     const raw = JSON.stringify(incidentRecord, ['name', 'email', 'phone', 'birthday']);
    //     return fetch(this.formPostUrl, {method: 'post', headers: myHeaders, body: raw, redirect: 'follow'})
    //       .then(response => response.text())
    //       .then(result => {
    //         console.log("POST success!");
    //         this.addProcessedRecord({userId: JSON.parse(result).id});
    //         db.deleteValue('userform', incidentRecord.id);
    //         this.channel.postMessage({synced: incidentRecord.id});
    //       })
    //       .catch(error => console.log('error', error));
    // }

    async deleteRecord(id) {
        await this.db.createObjectStore([this.tableName]);
        this.db.deleteValue(this.tableName, id);
    }
}

export default IncidentRepository;