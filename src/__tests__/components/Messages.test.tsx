import {render, shallow} from "enzyme";
import Messages from "../../components/draft/Messages";
import Player from "../../constants/Player";
import Turn from "../../models/Turn";
import Action from "../../constants/Action";
import Exclusivity from "../../constants/Exclusivity";
import Preset from "../../models/Preset";
import Civilisation from "../../models/Civilisation";
import PlayerEvent from "../../models/PlayerEvent";
import ActionType from "../../constants/ActionType";

describe('initialisation', () => {
    it.each`
    player          | hostReady | guestReady
    ${Player.NONE}  | ${false}  | ${false}
    ${Player.NONE}  | ${false}  | ${true}
    ${Player.NONE}  | ${true}   | ${false}
    ${Player.HOST}  | ${false}  | ${false}
    ${Player.HOST}  | ${false}  | ${true}
    ${Player.HOST}  | ${true}   | ${false}
    ${Player.GUEST} | ${false}  | ${false}
    ${Player.GUEST} | ${false}  | ${true}
    ${Player.GUEST} | ${true}   | ${false}
  `('$player waiting while hostReady=$hostReady and guestReady=$guestReady', ({player, hostReady, guestReady}) => {
        const preset = new Preset('Preset name', Civilisation.ALL, []);
        const component = render(<Messages whoAmI={player} hostReady={hostReady} guestReady={guestReady}
                                           nameHost={'nameHost'}
                                           nameGuest={'nameGuest'}
                                           preset={preset}
                                           events={[]}
                                           sendReady={() => {
                                           }}/>);
        expect(component).toMatchSnapshot();
    });
});

describe('picks, bans, and snipes:', () => {
    it.each`
    whoAmI          | turnPlayer      | action 
    ${Player.NONE}  | ${Player.HOST}  | ${Action.PICK}
    ${Player.HOST}  | ${Player.HOST}  | ${Action.PICK}
    ${Player.HOST}  | ${Player.GUEST} | ${Action.PICK}
    ${Player.GUEST} | ${Player.HOST}  | ${Action.PICK}
    ${Player.GUEST} | ${Player.GUEST} | ${Action.PICK}
    ${Player.NONE}  | ${Player.HOST}  | ${Action.BAN}
    ${Player.HOST}  | ${Player.HOST}  | ${Action.BAN}
    ${Player.HOST}  | ${Player.GUEST} | ${Action.BAN}
    ${Player.GUEST} | ${Player.HOST}  | ${Action.BAN}
    ${Player.GUEST} | ${Player.GUEST} | ${Action.BAN}
    ${Player.NONE}  | ${Player.HOST}  | ${Action.SNIPE}
    ${Player.HOST}  | ${Player.HOST}  | ${Action.SNIPE}
    ${Player.HOST}  | ${Player.GUEST} | ${Action.SNIPE}
    ${Player.GUEST} | ${Player.HOST}  | ${Action.SNIPE}
    ${Player.GUEST} | ${Player.GUEST} | ${Action.SNIPE}
  `('$whoAmI sees prompt for $turnPlayer turn ($action)', ({whoAmI, turnPlayer, action}) => {
        const nextTurn = new Turn(turnPlayer, action, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [nextTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    });
});


describe('parallel turn H-G: Step 1', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={Player.HOST} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    })
});

describe('parallel turn H-G: Step 2, Host picks before Guest', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    })
});

describe('parallel turn H-G: Step 2, Guest picks before Host', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id)]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    })
});

describe('parallel turn G-H: Step 1', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    })
});

describe('parallel turn G-H: Step 2, Host picks before Guest', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[new PlayerEvent(Player.HOST, ActionType.PICK, Civilisation.AZTECS.id)]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();
    })
});

describe('parallel turn G-H: Step 2, Guest picks before Host,', () => {
    it.each`
    whoAmI
    ${Player.NONE} 
    ${Player.HOST} 
    ${Player.GUEST}
  `('perspective: $whoAmI', ({whoAmI}) => {
        const firstTurn = new Turn(Player.GUEST, Action.PICK, Exclusivity.GLOBAL, false, true);
        const secondTurn = new Turn(Player.HOST, Action.PICK, Exclusivity.GLOBAL);
        const preset = new Preset('Preset name', Civilisation.ALL, [firstTurn, secondTurn]);
        const component = shallow(<Messages whoAmI={whoAmI} hostReady={true} guestReady={true}
                                            nameHost={'nameHost'}
                                            nameGuest={'nameGuest'}
                                            preset={preset}
                                            events={[new PlayerEvent(Player.GUEST, ActionType.PICK, Civilisation.AZTECS.id)]}
                                            sendReady={() => {
                                            }}/>);
        expect(component.dive()).toMatchSnapshot();

    })
});
