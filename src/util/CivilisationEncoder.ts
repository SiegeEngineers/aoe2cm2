import Civilisation from "../models/Civilisation";

export const CivilisationEncoder = {
    encodeCivilisationArray(civilisations: Civilisation[]): string {
        let value = '';
        const civilisationIds = civilisations.map(value => value.id);
        for (let i = 0; i < Civilisation.ALL.length; i += 4) {
            let encoded: number = 0;
            for (let j = 0; j < 4; j++) {
                const index = i + j;
                if (index < Civilisation.ALL.length && civilisationIds.includes(Civilisation.ALL[index].id)) {
                    encoded += Math.pow(2, j);
                }
            }
            value = CivilisationEncoder.toHexString(encoded) + value;
        }
        value = value.replace(/^0+/, '') || '0'
        return value;
    },

    decodeCivilisationArray(encoded: string): Civilisation[] {
        if (encoded === 'e3e3fffffffefff') {
            const civilisations = [...Civilisation.ALL_ACTIVE];
            civilisations.sort((a, b) => a.name.localeCompare(b.name));
            return civilisations;
        }
        try {
            const bits = CivilisationEncoder.toBits(encoded);
            const civilisations = [];
            for (let i = 0; i < bits.length; i++) {
                if (bits[i]) {
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
    },

    toBits(encoded: string): boolean[] {
        const bits: boolean[] = []
        const items = encoded.split('');
        for (const item of items) {
            const number = parseInt(item, 16);
            if(isNaN(number)){
                return []
            }
            let binaryString = number.toString(2);
            binaryString = binaryString.padStart(4, '0');
            const stringBits = binaryString.split('');
            for (let i = 0; i < stringBits.length; i++) {
                bits.push(stringBits[i] === '1');
            }
        }
        const first = bits.indexOf(true);
        return bits.slice(first);
    }
};
