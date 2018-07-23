import * as React from "react";

import { Checkbox, Icon } from "bloomer";

export interface Listable {
    id: string;
    icon: string;
    descr: string;
}

export interface ListableMap {
    [index: string]: Listable;
}

export const available = (listableMap: ListableMap) => {
    return Object.keys(listableMap).map(s => listableMap[s]);
};

export const avilableIds = (listableMap: ListableMap) => {
    return Object.keys(listableMap).map((l: string) => listableMap[l].id);
};

export const getListable = (listableMap: ListableMap, listable: string) => {
    return listableMap[listable];
};

export const toggle = (listOfIds: string[], listableId: string) => {
    if (listOfIds.indexOf(listableId) >= 0) {
        // element existed, remove it
        listOfIds.splice(listOfIds.indexOf(listableId), 1);
    } else {
        // element was missing, add it
        listOfIds.push(listableId);
    }
    return listOfIds;
};

export const renderListable = (
    listables: Listable[],
    onClickItem: (id: string) => void,
    isSelected: (id: string) => boolean
) => {
    return listables.map((l: Listable) => [
        <Checkbox key={"cb" + l.id} checked={isSelected(l.id)} onClick={() => onClickItem(l.id)} >
            <Icon icon={l.icon} /><span style={{ "font-size": "0.75rem" }}> {l.descr}</span>
        </Checkbox>,
        <br key={"br" + l.id} />
    ]);
};

export const renderCustomListable = (
    listableIds: string[] | undefined,
    listableMap: ListableMap,
    toggleListable: (id: string) => void
) => {
    if (!listableIds) {
        return undefined;
    }

    const customListables = listableIds.filter(s => !listableMap[s]); // keep all nonexisting

    return customListables.map((l: string) => [
        <Checkbox key={"cb" + l} checked={true} onClick={() => toggleListable(l)} >
            <Icon icon="cog" /><span style={{ "font-size": "0.75rem", "font-style": "italic" }}> {l}</span>
        </Checkbox>,
        <br key={"br" + l} />
    ]);
};

export const Features: ListableMap = {
    INACTIVE: {
        id: "INACTIVE", icon: "pause",
        descr: "Inactive, no actions/measurements"
    },
    STATUS_LIGHT: {
        id: "STATUS_LIGHT", icon: "lightbulb-o",
        descr: "Enable status light as indicator"
    },
    I2C_DEVICE_ON_D3: {
        id: "I2C_DEVICE_ON_D3", icon: "plug",
        descr: "I2C device(s) powered with 3V3 via D3"
    }
};

export const Sensors: ListableMap = {
    BME280_TEMP: { id: "BME280_TEMP", icon: "thermometer-half", descr: "Thermometer" },
    BME280_HYGRO: { id: "BME280_HYGRO", icon: "tint", descr: "Hygrometer" },
    BME280_BARO: { id: "BME280_BARO", icon: "cloud", descr: "Barometer" },
    BME280_ALTI: { id: "BME280_ALTI", icon: "arrows-v", descr: "Altimeter" },
    BME280_DEW: { id: "BME280_DEW", icon: "filter", descr: "Dewpoint" },
    MAX17043: { id: "MAX17043", icon: "battery-half", descr: "LiPo Fuel Gauge" },
    APDS9660COLOR: { id: "APDS9660COLOR", icon: "eye", descr: "Color, Brightness" },
    APDS9660GESTURE: { id: "APDS9660GESTURE", icon: "hand-paper-o", descr: "Gesture" },
    APDS9660DISTANCE: { id: "APDS9660DISTANCE", icon: "arrows-h", descr: "Distance" },
    HEARTBEAT: { id: "HEARTBEAT", icon: "heartbeat", descr: "Heartrate" },
    DECIBEL: { id: "DECIBEL", icon: "microphone", descr: "Decibels" }
    // NEO6MV2: {id: "NEO6MV2", icon: "location-arrow", descr: "GPS Module" },
};
