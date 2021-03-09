import * as React from "react";
import CivGrid from "./CivGrid";
import Messages from "../../containers/Messages";
import DraftState from "./DraftState";
import TurnRow from "./TurnRow";
import Player from "../../constants/Player";
import Preset from "../../models/Preset";
import "../../types/DraftEvent";
import {DraftEvent} from "../../types/DraftEvent";
import {IDraftConfig} from "../../types/IDraftConfig";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import KeyboardBackspaceIcon from "mdi-react/KeyboardBackspaceIcon";
import Modal from "../../containers/Modal";
import NameGenerator from "../../util/NameGenerator";
import {Link, withRouter} from "react-router-dom";
import RoleModal from "../../containers/RoleModal";
import DraftIdInfo from "../../containers/DraftIdInfo";
import {ICountdownValues} from "../../types";
import {default as ModelAction} from "../../constants/Action";
import ReplayControls from "../../containers/ReplayControls";
import {RouteComponentProps} from "react-router";
import HowItWorks from "../menu/HowItWorks";
import ColorSchemeHelpers from "../../util/ColorSchemeHelpers";

interface IProps extends WithTranslation, RouteComponentProps<any> {
    nameHost: string;
    nameGuest: string;
    hostConnected: boolean;
    guestConnected: boolean;
    whoAmI?: Player;
    ownName: string | null;
    preset: Preset;
    nextAction: number;
    replayEvents: DraftEvent[];

    onActionCompleted?: (message: DraftEvent) => void;
    onDraftConfig?: (message: IDraftConfig) => void;
    onNextAction?: () => void;
    onSetNameHostAction?: (name: string) => void;
    onSetNameGuestAction?: (name: string) => void;
    triggerConnect: () => void;
    triggerSetRole: (name: string, role: Player) => void;
    triggerDisconnect?: () => void;
    showRoleModal: () => void;
    showNameModal: () => void;
    setOwnRole: (role: Player) => void;
    setCountdownValue: (values: ICountdownValues) => void;
    setEvents: (value: { player: Player, action: ModelAction, events: DraftEvent[] }) => void;
    act: (value: DraftEvent) => void;
}

interface IState {
    joined: boolean;
    flipped: boolean;
    smooch: boolean;
    simplifiedUI: boolean;
}

class Draft extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.disconnectAndGoBack = this.disconnectAndGoBack.bind(this);
        let query = new URLSearchParams(this.props.location.search);
        const flipped = query.get('flipped') === 'true' || false;
        const smooch = query.get('smooch') === 'true' || false;
        const simplifiedUI = query.get('simplified') === 'true' || false;
        this.state = {joined: false, flipped, smooch, simplifiedUI};
    }


    componentDidMount(): void {
        this.updateTitle();
        this.props.triggerConnect();
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.props.whoAmI === undefined) {
            if (!this.props.hostConnected || !this.props.guestConnected) {
                this.props.showRoleModal();
            } else {
                this.props.setOwnRole(Player.NONE);
                this.setState({joined: true});
            }
        } else if (this.props.whoAmI !== Player.NONE && !this.state.joined) {
            let username: string | null = NameGenerator.getNameFromLocalStorage(this.props.ownName);
            console.log("componentDidMount", this.props.triggerSetRole, username);
            if (username !== null) {
                this.props.triggerSetRole(username, this.props.whoAmI);
                this.setState({joined: true});
            } else {
                this.props.showNameModal();
            }
        }
        this.updateTitle();
    }

    private updateTitle() {
        const title = this.getTitle();
        if (document.title !== title) {
            document.title = title;
        }
    }

    private getTitle(): string {
        const host = this.props.nameHost;
        const guest = this.props.nameGuest;
        const preset = this.props.preset.name;
        return `${host} vs ${guest} – "${preset}" – AoE2 Captains Mode`;
    }

    private disconnectAndGoBack(): void {
        if (this.props.triggerDisconnect) {
            this.props.triggerDisconnect();
        }
        ColorSchemeHelpers.removeThemeClassName('has-simple-ui')
        if (this.props.history.length > 2 && document.referrer) {
            // go back if there is a possibility
            this.props.history.goBack();
        } else {
            // else go to spectate
            this.props.history.push('/spectate');
        }
    }

    private flip():void{
        const newFlippedValue = !this.state.flipped;
        let searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('flipped', newFlippedValue.toString());
        this.props.history.replace({
            search: searchParams.toString()
        });
        this.setState({...this.state, flipped: newFlippedValue});
    }

    private toggleSmooch():void{
        const newSmoochValue = !this.state.smooch;
        let searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('smooch', newSmoochValue.toString());
        this.props.history.replace({
            search: searchParams.toString()
        });
        this.setState({...this.state, smooch: newSmoochValue});
    }

    private toggleSimplifiedUI():void{
        console.log('Simplified UI Toggle')
        const newSimplifiedUIValue = !this.state.simplifiedUI;
        let searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('simplified', newSimplifiedUIValue.toString());
        this.props.history.replace({
            search: searchParams.toString()
        });
        this.setState({...this.state, simplifiedUI: newSimplifiedUIValue});
    }

    public render() {
        let presetName: JSX.Element = <>{this.props.preset.name}</>;
        if(this.props.preset.presetId){
            presetName = <Link to={'/preset/'+this.props.preset.presetId}>{presetName}</Link>;
        }
        const turns = this.props.preset.turns;

        let className = 'section';
        className += this.state.flipped ? ' flipped' : '';
        className += this.state.smooch ? ' smooch' : '';

        if(this.state.simplifiedUI) {
            ColorSchemeHelpers.addThemeClassName('has-simple-ui');
        } else {
            ColorSchemeHelpers.removeThemeClassName('has-simple-ui');
        }

        return (
            <>
            <section className={className}>
                <Modal inDraft={true}/>
                <RoleModal/>
                <div id="container" className="container is-fluid">
                    <div className="columns is-mobile">
                        <div className="column is-1 py-0">
                                <button onClick={this.disconnectAndGoBack} aria-label="Go back" className="button is-text back-icon header-navigation">
                                    <KeyboardBackspaceIcon size={48} />
                                </button>
                        </div>
                        <div className="column content my-0 pb-0">
                            <h2 id="draft-title" className="has-text-centered my-0">{presetName}</h2>
                        </div>
                        <div className="column is-1"/>
                    </div>

                    <TurnRow turns={turns}/>

                    <DraftState nameHost={this.props.nameHost}
                                nameGuest={this.props.nameGuest}
                                preset={this.props.preset}
                                flipped={this.state.flipped}
                                smooch={this.state.smooch}
                                simplifiedUI={this.state.simplifiedUI}/>

                    <div className="columns is-mobile">
                        <div id="action-text" className="column has-text-centered is-size-4">
                            <Messages/>
                        </div>
                    </div>

                    <ReplayControls/>

                    {!this.state.simplifiedUI && <DraftIdInfo/>}

                    {!this.state.simplifiedUI && <CivGrid civilisations={this.props.preset.civilisations}/>}
                </div>
            </section>

            <section className="section pt-0">
                <div className="container is-mobile has-text-centered">
                    <div className="field is-grouped is-grouped-centered">
                        <p className="control">
                            <input id="toggleFlip" type="checkbox" name="toggleSmooch"
                                   className="switch is-small is-rounded is-info" checked={this.state.flipped} onClick={() => {
                                this.flip()
                            }}/>
                            <label htmlFor="toggleFlip" style={{paddingTop:1}}><Trans i18nKey='flip'>Flip Host and Guest positions</Trans></label>
                        </p>
                        <p className="control">
                            <input id="toggleSmooch" type="checkbox" name="toggleSmooch"
                                   className="switch is-small is-rounded is-info" checked={this.state.smooch} onClick={() => {
                                this.toggleSmooch()
                            }}/>
                            <label htmlFor="toggleSmooch" style={{paddingTop:1}}><Trans i18nKey='smooch'>Smooch Mode</Trans></label>
                        </p>
                        <p className="control">
                            <input id="toggleSimplifiedUI" type="checkbox" name="toggleSimplifiedUI"
                                   className="switch is-small is-rounded is-info" checked={this.state.simplifiedUI} onClick={() => {
                                this.toggleSimplifiedUI()
                            }}/>
                            <label htmlFor="toggleSimplifiedUI" style={{paddingTop:1}}><Trans i18nKey='simplifiedUI'>Simplified UI</Trans></label>
                        </p>
                    </div>
                </div>
            </section>

            {!this.state.simplifiedUI && <section className="section pt-0">
                <div className="container is-desktop has-text-centered" style={{maxWidth: "808px"}}>
                    <details>
                        <summary className="has-cursor-pointer"><Trans i18nKey='menu.howItWorks'>How it works</Trans></summary>
                        <HowItWorks/>
                    </details>
                </div>
            </section>
            }

            </>
        );
    }
}

export default withTranslation()(withRouter(Draft));
