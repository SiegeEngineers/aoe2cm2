import path from "path";
import * as fs from "fs";

export class DraftsArchive {
    private drafts: Map<string, Set<string>>

    constructor(dataDirectory: string) {
        const elements = fs.readdirSync(dataDirectory)
        this.drafts = new Map<string, Set<string>>();
        for (let element of elements) {
            if (DraftsArchive.isArchiveDirectory(dataDirectory, element)) {
                const draftIdsForFolder = new Set<string>();
                const files = fs.readdirSync(path.join(dataDirectory, element))
                for (let file of files) {
                    if (DraftsArchive.isStoredDraft(dataDirectory, element, file)) {
                        const draftId = DraftsArchive.getDraftId(file);
                        draftIdsForFolder.add(draftId);
                    }
                }
                this.drafts.set(element, draftIdsForFolder);
            }
        }
    }

    public hasDraftId(draftId: string) {
        for (let folderName of Array.from(this.drafts.keys())) {
            const draftIdsInFolder = this.drafts.get(folderName) as Set<string>;
            if (draftIdsInFolder.has(draftId)) {
                return true;
            }
        }
        return false;
    }

    public getFolderForDraftId(draftId: string): string {
        for (let folderName of Array.from(this.drafts.keys())) {
            const draftIdsInFolder = this.drafts.get(folderName) as Set<string>;
            if (draftIdsInFolder.has(draftId)) {
                return folderName;
            }
        }
        return '';
    }

    private static getDraftId(filename: string) {
        return filename.substring(0, filename.length - 5);
    }

    private static isStoredDraft(dataDirectory: string, element: string, file: string) {
        return fs.lstatSync(path.join(dataDirectory, element, file)).isFile() && file.endsWith('.json');
    }

    private static isArchiveDirectory(dataDirectory: string, element: string) {
        return fs.lstatSync(path.join(dataDirectory, element)).isDirectory() && !(element === 'current');
    }
}