import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate, AfterUpdate, AfterInsert, AfterLoad, Index } from "typeorm";

@Entity()
export class NodeConfig {

    @PrimaryColumn({ type: "uuid" })
    id: string;

    @Column({ type: "integer" })
    @Index()
    dataId: number;

    @Column()
    name: string;

    @Column({ type: "bigint" })
    lastSeen: number | string;

    @Column({ type: "bigint" })
    firstSeen: number | string;

    @Column({ type: "integer", default: 1 })
    numberOfSamples: number;

    @Column({ type: "bigint", default: 3 * 60 * 1000 /* 3 mins */ })
    sleepTimeMillis: number | string;

    @Column({ type: String, isArray: true })
    activeSensors: string[];

    @Column({ type: String, isArray: true })
    activeFeatures: string[];

    @Column({ default: "AUTO" })
    ipv4address: string;

    @BeforeInsert()
    @BeforeUpdate()
    typeToString() {
        // map number (js) to string (postgres)
        this.lastSeen = this.lastSeen.toString();
        this.firstSeen = this.firstSeen.toString();
        this.sleepTimeMillis = this.sleepTimeMillis.toString();
    }

    @AfterInsert()
    @AfterUpdate()
    @AfterLoad()
    typeFromString() {
        // map string (postgres) to number (js)
        this.lastSeen = Number.parseInt(this.lastSeen as any);
        this.firstSeen = Number.parseInt(this.firstSeen as any);
        this.sleepTimeMillis = Number.parseInt(this.sleepTimeMillis as any);
    }
}
