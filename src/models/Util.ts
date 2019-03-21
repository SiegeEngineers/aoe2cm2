import Civilisation from "./Civilisation";
import Action from "./Action";
import {DraftEvent} from "./DraftEvent";
import PlayerEvent from "./PlayerEvent";

export const Util = {
    notUndefined(...args: any[]): boolean {
        for (const arg of args) {
            if (arg === undefined) {
                return false;
            }
        }
        return true;
    },

    getIdFromUrl(): string {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/draft\/([A-Za-z]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get draft ID from url');
        return '';
    },

    sortCivsByName(a: Civilisation, b: Civilisation): number {
        if (a.name > b.name) {
            return 1;
        } else if (b.name > a.name) {
            return -1;
        } else {
            return 0;
        }
    },

    isPick(action: Action): boolean {
        return (action === Action.PICK
            || action === Action.GLOBAL_PICK
            || action === Action.EXCLUSIVE_PICK
            || action === Action.HIDDEN_PICK
            || action === Action.HIDDEN_EXCLUSIVE_PICK);
    },

    isSnipe(action: Action): boolean {
        return (action === Action.SNIPE || action === Action.HIDDEN_SNIPE);
    },

    isPlayerEvent(event: DraftEvent): event is PlayerEvent {
        return (<PlayerEvent>event).civilisation !== undefined;
    }

};
