import * as React from "react";
import {PresetUtil} from "../../util/PresetUtil";
import {default as ModelPreset} from "../../models/Preset"
import TurnRow from "../draft/TurnRow";
import NewDraftButton from "../NewDraftButton";
import CustomisePresetButton from "../../containers/CustomisePresetButton";
import CopyableInput from "../draft/CopyableInput";
import {PresetOptionCheckbox} from "../PresetEditor/PresetOptionCheckbox";
import Civilisation from "../../models/Civilisation";
import DraftOptionPanelType from "../../constants/DraftOptionPanelType";
import DraftOptionPanel from "../draft/DraftOptionPanel";
import DraftOption from "../../models/DraftOption";
import {ApplicationState, IDraftForPreset} from "../../types";
import {Dispatch} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import DraftForPresetRow from "./DraftForPresetRow";
import {Trans} from "react-i18next";

interface IState {
    preset?: ModelPreset;
    presetDrafts?: IDraftForPreset[];
    presetExists: boolean;
}

interface IProps {
    iconStyle: string;
}

class Preset extends React.Component<IProps, IState> {

    state: IState = {presetExists: true};

    componentDidMount() {
        const presetId = PresetUtil.getIdFromUrl();
        if (presetId !== undefined) {
            this.loadPreset(presetId);
            this.loadPresetDrafts(presetId);
        }
    }

    public render() {
        if (!this.state.presetExists) {
            return (
                <div className="content box">
                    <p>Could not find this preset, sorry :-(</p>
                </div>
            );
        }
        if (this.state.preset !== undefined) {

            const presetCivilisations = this.state.preset.options;
            let civs;
            let itemAlignment = '';
            if (this.state.preset.encodedCivilisations) {
                civs = Civilisation.ALL.map((value: Civilisation, index: number) =>
                    <PresetOptionCheckbox presetOptions={presetCivilisations} value={value}
                                          key={index}
                                          disabled={true}/>)
            } else {
                civs = presetCivilisations.map((value: DraftOption, index: number) =>
                    <DraftOptionPanel draftOption={value} active={false} highlighted={false}
                                      draftOptionPanelType={DraftOptionPanelType.CHOICE} nextAction={0}
                                      displayOnly={true} iconStyle={this.props.iconStyle}/>);
                itemAlignment = ' flex-justify-center';
            }
            let recentDrafts = null;
            if (this.state.presetDrafts) {
                recentDrafts = this.state.presetDrafts.reverse().map((value: IDraftForPreset) => <DraftForPresetRow
                    draftForPreset={value}/>)
            }

            return (<>
                    <div className='content box'>
                        <h3 className="has-text-centered">{this.state.preset.name}</h3>

                        <TurnRow turns={this.state.preset.turns}/>

                        <div className={"is-flex" + itemAlignment} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {civs}
                        </div>

                        <div className="columns is-mobile mt-4">
                            <div className="column is-7 buttons">
                                <div>
                                    <NewDraftButton preset={this.state.preset} private={false}/>
                                    <CustomisePresetButton preset={this.state.preset}/>
                                </div>
                                <div>
                                    <NewDraftButton preset={this.state.preset} private={true}/>
                                </div>
                            </div>
                            <div className="column is-5">
                                <CopyableInput content={window.location.href} before={'preset.shareThisPreset'}
                                               length={35}/>
                            </div>
                        </div>
                    </div>
                    <div className='content box'>
                        <h3 className="has-text-centered">
                            <Trans i18nKey="preset.recentDraftsTitle">Recent Drafts for this Preset</Trans>
                        </h3>

                        <table className="table is-narrow is-hoverable is-fullwidth">
                            <thead>
                            <tr className="table-header">
                                <th className="has-text-right"><Trans i18nKey="spectate.host">Host</Trans></th>
                                <th className="has-text-centered"/>
                                <th className="has-text-left"><Trans i18nKey="spectate.guest">Guest</Trans></th>
                                <th className="has-text-right"/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                !this.state.presetDrafts ?
                                    <tr><td colSpan={4}><span><Trans i18nKey="preset.noDraftsAvailable">No Drafts available.</Trans></span></td></tr>
                                    :
                                    recentDrafts
                            }
                            </tbody>
                        </table>
                    </div>
                </>
            );
        }
        return (
            <div className="content box">
                <p>Loading…</p>
            </div>
        );
    }


    private loadPreset = (presetId: string) => {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/preset/' + presetId, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const result = JSON.parse(request.responseText);
                const preset = ModelPreset.fromPojo(result);
                this.setState({preset});
                document.title = `Preset "${preset?.name}" – AoE Captains Mode`;
            } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                this.setState({presetExists: false});
                document.title = 'Preset not found – AoE Captains Mode';
            }
        };
        request.send();
    };
    private loadPresetDrafts = (presetId: string) => {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/preset/' + presetId + '/drafts', true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const presetDrafts = JSON.parse(request.responseText) as IDraftForPreset[];
                this.setState({presetDrafts});
            } else if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                this.setState({presetDrafts: undefined});
            }
        };
        request.send();
    };
}


function mapStateToProps(state: ApplicationState) {
    return {
        iconStyle: state.iconStyle.iconStyle,
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Preset);
