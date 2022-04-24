import Civilisation from "../models/Civilisation";

export const CivilisationEncoder = {
    encodeCivilisationArray(civilisations: Civilisation[]): string {
        let encoded: number = 0;
        for (let i = 0; i < Civilisation.ALL.length; i++) {
            if (civilisations.includes(Civilisation.ALL[i])) {
                encoded += Math.pow(2, i);
            }
        }
        return CivilisationEncoder.toHexString(encoded);
    },

    decodeCivilisationArray(encoded: string): Civilisation[] {
        if (encoded === '7ffffffefff') {
            const civilisations = [...Civilisation.ALL_ACTIVE];
            civilisations.sort((a, b) => a.name.localeCompare(b.name));
            return civilisations;
        }
        try {
            const encodedNumber = parseInt(encoded, 16);
            const binaryString: string = encodedNumber.toString(2);
            const bits: string[] = binaryString.split('');
            const civilisations = [];
            for (let i = 0; i < bits.length; i++) {
                if (bits[i] === '1') {
                    civilisations.push(Civilisation.ALL[bits.length - 1 - i]);
                }
            }
            civilisations.sort((a, b) => a.name.localeCompare(b.name));
            return civilisations;
        } catch (e) {
            console.log("Could not decode value as hex string: ", encoded);
            return [];
        }
    },

    toHexString(input: number): string {
        return input.toString(16);
    }
};
