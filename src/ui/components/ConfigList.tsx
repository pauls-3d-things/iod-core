import * as React from "react";
import { NodeConfig } from "../../entity/NodeConfig";
import { Table, Icon } from "bloomer";
import * as moment from "moment";
import { getListable, Sensors, Features } from "./Listable";
import { printSleepString } from "./Common";

export interface ConfigListProps {
    configs: NodeConfig[];
    editConfigCallback: (config: NodeConfig) => void;
}
export class ConfigList extends React.Component<ConfigListProps, {}> {
    constructor(props: ConfigListProps) {
        super(props);
    }

    render() {
        return this.props.configs ? this.renderList() : "No Data";
    }

    renderList() {
        const entries = this.props.configs.map((config: NodeConfig) => {
            return (
                <tr key={config.dataId}>
                    <td>{config.name}</td>
                    <td>{this.sensors(config.activeSensors)}</td>
                    <td>{this.features(config.activeFeatures)}</td>
                    <td>{moment(config.lastSeen).fromNow()}</td>
                    <td>
                        {config.ipv4address !== "AUTO" && [<Icon icon="globe" />, config.ipv4address, <br />]}
                        {config.numberOfSamples !== 1 && [<Icon icon="times" />, config.numberOfSamples, <br />]}
                        {config.sleepTimeMillis !== 1000 * 60 * 15 && [<Icon icon="clock-o" />, printSleepString(config.sleepTimeMillis)]}
                    </td>
                    <td>
                        <Icon icon="pencil" onClick={() => this.props.editConfigCallback(config)}></Icon>
                    </td>
                </tr>
            );
        });
        return (this.props.configs.length === 0 ? "No Data" :
            <Table style={{ width: "100%" }} isBordered={false} isStriped={true} isNarrow={false} >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Sensors</th>
                        <th>Features</th>
                        <th>Active</th>
                        <th>Config</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {...entries}
                </tbody>
            </Table>);
    }

    sensors = (entries: string[]) => {
        return entries.map((s: string, i: number) => {
            const sensor = getListable(Sensors, s);
            return <Icon key={"icon" + i} icon={sensor ? sensor.icon : "cog"} />;
        });
    }

    features = (entries: string[]) => {
        return entries.map((f: string, i: number) => {
            const feature = getListable(Features, f);
            return <Icon key={"icon" + i} icon={feature ? feature.icon : "cog"} />;
        });
    }

}
