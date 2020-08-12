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
import {withRouter} from "react-router-dom";
import RoleModal from "../../containers/RoleModal";
import DraftIdInfo from "../../containers/DraftIdInfo";
import {ICountdownValues} from "../../types";
import {default as ModelAction} from "../../constants/Action";
import ReplayControls from "../../containers/ReplayControls";
import {RouteComponentProps} from "react-router";
import HowItWorks from "../menu/HowItWorks";

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
}

class Draft extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.disconnectAndGoBack = this.disconnectAndGoBack.bind(this);
    }

    state = {joined: false};

    componentDidMount(): void {
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
    }

    private disconnectAndGoBack(): void {
        if (this.props.triggerDisconnect) {
            this.props.triggerDisconnect();
        }
        if (this.props.history.length > 2 && document.referrer) {
            // go back if there is a possibility
            this.props.history.goBack();
        } else {
            // else go to spectate
            this.props.history.push('/spectate');
        }
    }

    public render() {
        const presetName: string = this.props.preset.name;
        const turns = this.props.preset.turns;


        return (
            <>
            <section className="section">
                <Modal inDraft={true}/>
                <RoleModal/>
                <div id="container" className="container is-fluid">
                    <div className="columns is-mobile">
                        <div className="column is-1 py-0">
                                <button onClick={this.disconnectAndGoBack} aria-label="Go back" className="button is-text back-icon header-navigation">
                                    <KeyboardBackspaceIcon size={48} />
                                </button>
                        </div>
                        <div className="column content my-0">
                            <h2 id="draft-title" className="has-text-centered my-0">{presetName}</h2>
                        </div>
                        <div className="column is-1"/>
                    </div>

                    <TurnRow turns={turns}/>

                    <DraftState nameHost={this.props.nameHost} nameGuest={this.props.nameGuest}
                                preset={this.props.preset}/>

                    <div className="columns is-mobile">
                        <div id="action-text" className="column has-text-centered is-size-4">
                            <Messages/>
                        </div>
                    </div>

                    <ReplayControls/>

                    <DraftIdInfo/>

                    <CivGrid civilisations={this.props.preset.civilisations}/>
                </div>
            </section>

            <section className="section pt-0">
                <div className="container is-desktop has-text-centered" style={{maxWidth: "808px"}}>
                    <details>
                        <summary className="has-cursor-pointer"><Trans i18nKey='menu.howItWorks'>How it works</Trans></summary>
                        <HowItWorks/>
                    </details>
                </div>
            </section>
        </>
        );
    }

}

export default withTranslation()(withRouter(Draft));
