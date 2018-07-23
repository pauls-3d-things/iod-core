import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    Container, Section,
    Columns, Column
} from "bloomer";
import { NodeConfig } from "../entity/NodeConfig";
import { ConfigList } from "./components/ConfigList";
import { IoDNavbar } from "./components/Navbar";
import { ConfigEdit } from "./components/ConfigEdit";
import { fetchAllNodeConfigs, saveNodeConfig } from "./api";
const natSort = require("javascript-natural-sort");

interface IodAppState {
    configs: NodeConfig[];
    editNodeConfig: NodeConfig | null;
}

// this is the index
class IodApp extends React.Component<{}, IodAppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            configs: [],
            editNodeConfig: null
        };
    }

    componentDidMount() {
        this.refreshConfigs();
    }

    refreshConfigs() {
        fetchAllNodeConfigs()
            .then((configs: any) => {
                this.setState({ configs: configs.sort(this.nameSort) });
            }).catch((error: any) => {
                console.log(error);
            });
    }

    nameSort = (n1: NodeConfig, n2: NodeConfig) => {
        const list = [n1.name, n2.name].sort(natSort);
        return list[0] === n1.name ? -1 : 1;
    }

    renderConfigColumns = (colHeight: number) => {
        const columns = [];
        for (let i = 0; i < (this.state.configs.length / colHeight); i++) {
            const col = (
                <Column key={"column" + i}>
                    <ConfigList
                        configs={this.state.configs.slice(i * colHeight, (i + 1) * colHeight)}
                        editConfigCallback={this.openEditConfig}
                    />
                </Column>
            );
            columns.push(col);
        }
        return this.state.configs.length > 0 ? columns : "No Sensors";
    }

    render() {
        return (
            <div>
                <IoDNavbar />
                <Container>
                    <Section>
                        <Columns isCentered={true}>
                            {this.renderConfigColumns(10)}
                        </Columns>
                    </Section>
                </Container>
                {
                    this.state.editNodeConfig &&
                    <ConfigEdit
                        nodeConfig={this.state.editNodeConfig}
                        saveCallback={this.saveEditConfig}
                        cancelCallback={this.cancelEditConfig}
                    />
                }
            </div >
        );
    }

    openEditConfig = (config: NodeConfig) => {
        this.setState({
            editNodeConfig: config
        });
    }

    saveEditConfig = (config: Partial<NodeConfig>) => {
        console.log("Should save", config);
        // TODO: send config to server
        saveNodeConfig(config)
            .then(() => this.setState({ editNodeConfig: null }))
            .then(() => this.refreshConfigs())
            .catch(error => console.log(error));
    }

    cancelEditConfig = () => {
        this.setState({ editNodeConfig: null });
    }
}

ReactDOM.render(<IodApp />, document.getElementById("iod-core-app"));
