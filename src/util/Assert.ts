import Player from "../constants/Player";
import Action from "../constants/Action";
import Exclusivity from "../constants/Exclusivity";

export const Assert = {
    isString(arg: any): void {
        if (typeof arg !== "string") {
            throw new Error("Expected argument to be string, but was " + typeof arg);
        }
    },
    isOptionalString(arg: any): void {
        if (!(typeof arg === "string" || typeof arg === "undefined")) {
            throw new Error("Expected argument to be string or undefined, but was " + typeof arg);
        }
    },
    isStringArray(arg: any): void {
        let failed = false;
        if (Array.isArray(arg)) {
            arg.forEach(function (item) {
                if (typeof item !== "string") {
                    failed = true;
                }
            })
        } else {
            failed = true;
        }
        if (failed) {
            throw new Error("Expected argument to be string[], but was " + arg);
        }
    },
    isOptionalStringArray(arg: any): void {
        if (arg === undefined) {
            return;
        }
        this.isStringArray(arg);
    },
    isPlayer(arg: any) {
        if (!Object.keys(Player).includes(arg)) {
            throw new Error("Expected argument to be a valid Player value, but was " + arg);
        }
    },
    isPlayerOrUndefined(arg: any) {
        if (arg === undefined) {
            return;
        }
        this.isPlayer(arg);
    },
    isImageUrls(arg: any) {
        const argKeys = Object.keys(arg);
        const expectedKeys = ['animated_left', 'animated_right', 'emblem', 'unit'];
        for (let expectedKey of expectedKeys) {
            if (!argKeys.includes(expectedKey)) {
                throw new Error("Expected argument to be a valid ImageUrls value, but was " + arg);
            }
        }
    },
    isImageUrlsOrUndefined(arg: any) {
        if (arg === undefined) {
            return;
        }
        this.isImageUrls(arg);
    },
    isCategoryLimits(arg: any) {
        const argKeys = Object.keys(arg);
        if (!argKeys.includes('pick') || !argKeys.includes('ban')){
                throw new Error("Expected argument to be a valid CategoryLimits value, but was " + JSON.stringify(arg));
        }
        for (let key of Object.keys(arg.pick)) {
            if (typeof arg.pick[key] !== "number") {
                throw new Error("Expected argument to be a valid CategoryLimits value, but was " + JSON.stringify(arg));
            }
        }
        for (let key of Object.keys(arg.ban)) {
            if (typeof arg.ban[key] !== "number") {
                throw new Error("Expected argument to be a valid CategoryLimits value, but was " + JSON.stringify(arg));
            }
        }
    },
    isCategoryLimitsOrUndefined(arg: any) {
        if (arg === undefined) {
            return;
        }
        this.isCategoryLimits(arg);
    },
    isAction(arg: any) {
        if (!Object.keys(Action).includes(arg)) {
            throw new Error("Expected argument to be a valid Action value, but was " + arg);
        }
    },
    isExclusivity(arg: any) {
        if (!Object.keys(Exclusivity).includes(arg)) {
            throw new Error("Expected argument to be a valid Exclusivity value, but was " + arg);
        }
    },
    isBoolean(arg: any) {
        if (![true, false].includes(arg)) {
            throw new Error("Expected argument to be a valid boolean value, but was " + arg);
        }
    }
};