export const WebPresetUtil = {
    getIdFromUrl(): string | undefined {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/preset\/([A-Za-z0-9_]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get preset ID from url');
        return undefined;
    },

};
