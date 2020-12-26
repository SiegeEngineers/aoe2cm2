import PlayerEvent from "../../models/PlayerEvent";

it('PlayerEvent can deserialize old state', () => {
    const source = JSON.parse('{"player": "HOST", "actionType": "PICK", "civilisation": {}, "offset": 123}') as PlayerEvent;
    expect(PlayerEvent.from(source)).toMatchSnapshot();
});

it('PlayerEvent can deserialize new state', () => {
    const source = JSON.parse('{"player": "HOST", "actionType": "PICK", "civilisation": {}, "offset": 123, "executingPlayer": "GUEST"}') as PlayerEvent;
    expect(PlayerEvent.from(source)).toMatchSnapshot();
});
