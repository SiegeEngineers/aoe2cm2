import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import * as actions from "../../actions";
import {ISetEditorActivePool, ISetEditorPools} from "../../actions";
import {ApplicationState} from "../../types";
import Pool from "../../models/Pool";
import {EditorPools} from "../../util/EditorPools";

interface Props extends WithTranslation {
    pools: Pool[],
    activePool: number,
    onPoolsChange: (value: Pool[]) => ISetEditorPools,
    onActivePoolChange: (value: number) => ISetEditorActivePool,
}

export class PresetEditorPools extends React.Component<Props, object> {

    public render() {
        // One pool is the ordinary preset, and it is not worth a row of tabs until there are two.
        if (this.props.pools.length < 2) {
            return (
                <div className="mb-3">
                    <button className="button is-small" onClick={() => this.add()}>
                        <Trans i18nKey="presetEditor.addPool">+ Add pool</Trans>
                    </button>
                </div>
            );
        }

        const active = this.props.pools[this.props.activePool];

        return (
            <div className="mb-3">
                <div className="tabs is-toggle is-small pool-tabs">
                    <ul>
                        {this.props.pools.map((pool, index) =>
                            <li key={pool.id} className={pool.id === active.id ? "is-active" : ""}>
                                <a href={'#pool-' + pool.id} onClick={event => {
                                    event.preventDefault();
                                    this.props.onActivePoolChange(index);
                                }}>
                                    {pool.name} ({pool.options.length})
                                </a>
                            </li>)}
                        <li>
                            <a href="#add-pool" onClick={event => {
                                event.preventDefault();
                                this.add();
                            }}>
                                <Trans i18nKey="presetEditor.addPool">+ Add pool</Trans>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="field is-grouped">
                    <p className="control">
                        <input className="input is-small" value={active.name}
                               aria-label={this.props.t('presetEditor.poolName', 'Pool name')}
                               onChange={event => this.rename(active, event.target.value)}/>
                    </p>
                    <p className="control">
                        <button className="button is-small is-danger is-outlined"
                                onClick={() => this.remove(active)}>
                            <Trans i18nKey="presetEditor.removePool">Remove pool</Trans>
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    private add() {
        const pools = this.props.pools;
        // Named after the first number that is free as an id and as a name, which a count of the pools is not.
        const number = EditorPools.nextPoolNumber(pools, value => this.defaultName(value));
        this.props.onPoolsChange([...pools, new Pool(Pool.idFor(number), this.defaultName(number), [])]);
        this.props.onActivePoolChange(pools.length);
    }

    private defaultName(number: number): string {
        return this.props.t('presetEditor.poolDefaultName', {defaultValue: 'Pool {{number}}', number});
    }

    private rename(active: Pool, name: string) {
        this.props.onPoolsChange(this.props.pools.map(pool =>
            pool.id === active.id ? new Pool(pool.id, name, pool.options) : pool));
    }

    private remove(active: Pool) {
        this.props.onPoolsChange(this.props.pools.filter(pool => pool.id !== active.id));
    }
}

export function mapStateToProps(state: ApplicationState) {
    return {
        pools: EditorPools.pools(state.presetEditor),
        activePool: EditorPools.activeIndex(state.presetEditor),
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
    return {
        onPoolsChange: (value: Pool[]) => dispatch(actions.setEditorPools(value)),
        onActivePoolChange: (value: number) => dispatch(actions.setEditorActivePool(value)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PresetEditorPools));
