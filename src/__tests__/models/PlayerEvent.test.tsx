import {expect, it} from 'vitest';
import LegacyPlayerEvent from "../../models/LegacyPlayerEvent";

it('LegacyPlayerEvent can deserialize old state', () => {
    const source = JSON.parse('{"player": "HOST", "actionType": "PICK", "civilisation": {}, "offset": 123}') as LegacyPlayerEvent;
    expect(LegacyPlayerEvent.from(source)).toMatchSnapshot();
});

it('LegacyPlayerEvent can deserialize new state', () => {
    const source = JSON.parse('{"player": "HOST", "actionType": "PICK", "civilisation": {}, "offset": 123, "executingPlayer": "GUEST"}') as LegacyPlayerEvent;
    expect(LegacyPlayerEvent.from(source)).toMatchSnapshot();
});
