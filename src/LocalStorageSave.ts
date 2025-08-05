class LocalStorageSave {
    private readonly data: string[] = undefined;

    constructor(key: string) {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            this.data = decodeURI(savedData).split("\t");
        }
    }

    public isLoaded(): boolean {
        return this.data !== undefined;
    }

    public getItem(): string {
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }

    static save(key: string, data: [any]) {
        localStorage.setItem(key, encodeURI(data.map(entry => String(entry).replace("\t", "   ")).join("\t")));
    }
}

export default LocalStorageSave;