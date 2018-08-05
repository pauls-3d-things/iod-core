import * as React from "react";
import {
    Modal,
    ModalBackground,
    ModalContent,
    ModalCardHeader,
    ModalCardTitle,
    ModalCardBody,
    ModalCardFooter,
    Button, Field,
    Label, Control,
    Columns, Input, Column, Icon, Help
} from "bloomer";
import { NodeConfig } from "../../entity/NodeConfig";
import { available, toggle, renderListable, Features, Sensors, renderCustomListable } from "./Listable";
import { printSleepString } from "./Common";

export const DEFAULT_NUMBER_OF_SAMPLES = 1;

export interface ConfigEditProps {
    nodeConfig: NodeConfig;
    saveCallback: (config: Partial<NodeConfig>) => void;
    cancelCallback: () => void;
}
export interface ConfigEditState {
    nodeConfig: Partial<NodeConfig>;
    showHelp: boolean;
    customSensor: string;
    customFeature: string;
}

export class ConfigEdit extends React.Component<ConfigEditProps, ConfigEditState> {
    constructor(props: ConfigEditProps) {
        super(props);
        this.state = {
            // important: spreadding is not deep
            nodeConfig: { ...this.props.nodeConfig, activeSensors: [...this.props.nodeConfig.activeSensors] },
            showHelp: false,
            customSensor: "",
            customFeature: ""
        };
    }

    handleNameInput = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ nodeConfig: { ...this.state.nodeConfig, name: event.currentTarget.value } });
    }

    handleCustomSensorInput = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ customSensor: event.currentTarget.value });
    }

    handleCustomFeatureInput = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ customFeature: event.currentTarget.value });
    }

    handleNumberOfSamplesInput = (event: React.FormEvent<HTMLInputElement>) => {
        const samples: number = this.getIntOrDefault(event, DEFAULT_NUMBER_OF_SAMPLES);
        this.setState({ nodeConfig: { ...this.state.nodeConfig, numberOfSamples: samples } });
    }

    handleSleepTimeInput = (event: React.FormEvent<HTMLInputElement>) => {
        const samples: number = this.getIntOrDefault(event, DEFAULT_NUMBER_OF_SAMPLES);
        this.setState({ nodeConfig: { ...this.state.nodeConfig, sleepTimeMillis: samples } });
    }

    handleIP4Address = (event: React.FormEvent<HTMLInputElement>) => {
        const ipv4address = event.currentTarget.value;
        this.setState({ nodeConfig: { ...this.state.nodeConfig, ipv4address } });
    }

    toggleHelp = () => {
        this.setState({ showHelp: !this.state.showHelp });
    }

    getIntOrDefault = (event: React.FormEvent<HTMLInputElement>, defaultValue: number) => {
        let samples;
        try {
            samples = Number.parseInt(event.currentTarget.value, 10);
        } catch (error) {
            samples = defaultValue;
        }

        samples = Number.isNaN(samples) ? defaultValue : samples;
        return samples;
    }

    render() {
        return (
            <Modal isActive={true}>
                <ModalBackground />
                <ModalContent style={{ width: "80%" }}>
                    <ModalCardHeader>
                        <ModalCardTitle>Edit Node</ModalCardTitle>
                        <Icon icon="question-circle" onClick={this.toggleHelp} />
                        <Icon icon="close" onClick={this.props.cancelCallback} />
                    </ModalCardHeader>
                    <ModalCardBody>
                        {this.renderConfig(this.state.nodeConfig)}
                    </ModalCardBody>
                    <ModalCardFooter >
                        <Button isColor="success" onClick={() => this.props.saveCallback(this.state.nodeConfig)} >Save</Button>
                        <Button isColor="warning" onClick={this.props.cancelCallback} >Cancel</Button>
                    </ModalCardFooter>
                </ModalContent>
            </Modal>
        );
    }

    renderConfig = (config: Partial<NodeConfig>) => {
        return (
            <div>
                <Columns>
                    <Column isSize="1/3">
                        <Field>
                            <Label isSize="small">Name:</Label>
                            <Control>
                                <Input isSize="small" type="text" value={config.name} onChange={this.handleNameInput} />
                            </Control>
                            {this.state.showHelp && <Help isColor="info">The name of the node.</Help>}
                        </Field>
                        <Field>
                            <Label isSize="small">IP Address:</Label>
                            <Control>
                                <Input isSize="small" type="text" value={config.ipv4address} onChange={this.handleIP4Address} />
                            </Control>
                            {this.state.showHelp && <Help isColor="info">The IPv4 Address of the node, default: AUTO.</Help>}
                        </Field>
                        <Field>
                            <Label isSize="small">Measurements:</Label>
                            <Control>
                                <Input isSize="small" type="text" value={config.numberOfSamples} onChange={this.handleNumberOfSamplesInput} />
                            </Control>
                            {this.state.showHelp && <Help isColor="info">Number of measurements to collect before sending</Help>}
                        </Field>
                        <Field>
                            <Label isSize="small">Intervall:</Label>
                            <Control>
                                <Input isSize="small" type="text" value={config.sleepTimeMillis} onChange={this.handleSleepTimeInput} />
                            </Control>
                            <Help>= {printSleepString(this.state.nodeConfig.sleepTimeMillis)}</Help>
                            {this.state.showHelp && <Help isColor="info">Timeout between measurements in milliseconds.</Help>}
                        </Field>
                        <Field>
                            <Label isSize="small">Internal ID</Label>
                            <Control>
                                <Input isSize="small" type="text" placeholder="Name of the node" value={config.id} disabled={true} />
                                {this.state.showHelp && <Help isColor="info">This is not changeable and only used internally.</Help>}
                            </Control>
                        </Field>
                    </Column>
                    <Column isSize="1/3">
                        <Field>
                            <Label isSize="small">Sensors:</Label>
                            {this.state.showHelp && <Help isColor="info">Select the which sensors the node can access.</Help>}
                            <Control>
                                {renderListable(available(Sensors), this.toggleSensor, this.isSensorSelected)}
                                {renderCustomListable(this.state.nodeConfig.activeSensors, Sensors, this.toggleSensor)}
                            </Control>
                        </Field>
                        <Field>
                            <Label isSize="small">Custom Sensors:</Label>
                            <Control>
                                <Input
                                    type="text"
                                    value={this.state.customSensor}
                                    onChange={this.handleCustomSensorInput}
                                    isSize="small"
                                    style={{ width: "90%" }}
                                />
                                <Icon
                                    icon="plus"
                                    onClick={() => {
                                        this.toggleSensor(this.state.customSensor);
                                        this.setState({ customSensor: "" });
                                    }} />
                            </Control>
                            {this.state.showHelp && <Help isColor="info">Add custom sensor IDs here.</Help>}
                        </Field>
                    </Column>
                    <Column isSize="1/3">
                        <Field>
                            <Label isSize="small">Features:</Label>
                            {this.state.showHelp && <Help isColor="info">Select the which features the node has.</Help>}
                            <Control>
                                {renderListable(available(Features), this.toggleFeature, this.isFeatureSelected)}
                                {renderCustomListable(this.state.nodeConfig.activeFeatures, Features, this.toggleFeature)}
                            </Control>
                        </Field>
                        <Field>
                            <Label isSize="small">Custom Features:</Label>
                            <Control>
                                <Input
                                    type="text"
                                    value={this.state.customFeature}
                                    onChange={this.handleCustomFeatureInput}
                                    isSize="small"
                                    style={{ width: "90%" }}
                                />
                                <Icon
                                    icon="plus"
                                    onClick={() => {
                                        this.toggleFeature(this.state.customFeature);
                                        this.setState({ customFeature: "" });
                                    }} />
                            </Control>
                            {this.state.showHelp && <Help isColor="info">Add custom feature IDs here.</Help>}
                        </Field>
                    </Column>
                </Columns>
            </div>
        );
    }

    toggleSensor = (sensor: string) => {
        this.setState({
            nodeConfig: {
                ...this.state.nodeConfig, activeSensors: toggle([...(this.state.nodeConfig.activeSensors || [])], sensor)
            }
        });
    }

    isSensorSelected = (sensor: string) => {
        return this.state.nodeConfig.activeSensors !== undefined && this.state.nodeConfig.activeSensors.indexOf(sensor) >= 0;
    }

    toggleFeature = (feature: string) => {
        this.setState({
            nodeConfig: {
                ...this.state.nodeConfig, activeFeatures: toggle([...(this.state.nodeConfig.activeFeatures || [])], feature)
            }
        });
    }

    isFeatureSelected = (feature: string) => {
        return this.state.nodeConfig.activeFeatures !== undefined && this.state.nodeConfig.activeFeatures.indexOf(feature) >= 0;
    }
}
