import * as React from 'react';
import {Redirect} from "react-router";
import Preset from "../../models/Preset";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {PresetCombiner} from "../../util/PresetCombiner";

interface IProps extends WithTranslation {
    preset: Preset,
    onSetEditorPreset: (preset: Preset) => void,
}

interface IState {
    otherPresetId: string,
    message: string | null,
    goToEdit: boolean,
}

class CombinePresetsButton extends React.Component<IProps, IState> {
    state = {otherPresetId: '', message: null, goToEdit: false};

    public render() {
        if (this.state.goToEdit) {
            return (<Redirect push to={'/preset/create'}/>);
        }

        return (
            <div>
                <p className="is-size-7 has-text-grey mb-1">
                    <Trans i18nKey="combinePresets.explanation">
                        Play this preset and another one as a single draft, each on its own option pool,
                        with a pause in between.
                    </Trans>
                </p>
                <div className="field has-addons">
                    <p className="control">
                        <input className="input is-small" value={this.state.otherPresetId}
                               placeholder={this.props.t('combinePresets.placeholder', 'Other preset code')}
                               aria-label={this.props.t('combinePresets.placeholder', 'Other preset code')}
                               onChange={event => this.setState({otherPresetId: event.target.value, message: null})}/>
                    </p>
                    <p className="control">
                        <button className="button is-small is-link is-light"
                                disabled={this.state.otherPresetId.trim().length === 0}
                                onClick={() => this.combine()}>
                            <Trans i18nKey="combinePresets.action">Combine into one draft</Trans>
                        </button>
                    </p>
                </div>
                {this.state.message !== null && <p className="is-size-7 has-text-danger">{this.state.message}</p>}
            </div>
        );
    }

    private combine() {
        const code = this.state.otherPresetId.trim();
        fetch(`/api/preset/${code}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('not found');
                }
                return response.json();
            })
            .then(pojo => {
                const other = Preset.fromPojo(pojo);
                if (other === undefined) {
                    throw new Error('not found');
                }
                if (this.props.preset.segments !== undefined || other.segments !== undefined) {
                    this.setState({
                        message: this.props.t('combinePresets.alreadySplit',
                            'A preset that is already split into option pools cannot be combined with another one.')
                    });
                    return;
                }
                const leaking = PresetCombiner.leakingCategories(this.props.preset, other);
                if (leaking.length > 0) {
                    this.setState({
                        message: this.props.t('combinePresets.sharedCategories', {
                            defaultValue: 'A category limit is spent over the whole draft, so {{categories}} would also limit the other preset. Remove the limit, or give one preset\'s options a category of their own.',
                            categories: leaking.join(', '),
                        })
                    });
                    return;
                }
                const shared = PresetCombiner.sharedOptionIds(this.props.preset, other);
                if (shared.length > 0) {
                    this.setState({
                        message: this.props.t('combinePresets.sharedOptions', {
                            defaultValue: 'Both presets use these draft options: {{options}}. Every option has to belong to a single pool.',
                            options: shared.slice(0, 5).join(', '),
                        })
                    });
                    return;
                }
                const name = `${this.props.preset.name} + ${other.name}`;
                this.props.onSetEditorPreset(PresetCombiner.combine(this.props.preset, other, name));
                this.setState({goToEdit: true});
            })
            .catch(() => {
                this.setState({
                    message: this.props.t('combinePresets.notFound', {
                        defaultValue: 'There is no preset with the code {{code}}.',
                        code,
                    })
                });
            });
    }
}

export default withTranslation()(CombinePresetsButton);
