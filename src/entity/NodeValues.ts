import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate, AfterUpdate, AfterInsert, AfterLoad, Index } from "typeorm";

@Entity()
export class NodeValues {

    @PrimaryColumn({ type: "integer" })
    @Index()
    dataId: number;

    @PrimaryColumn({ type: "bigint" })
    @Index()
    timestamp: number | string;

    @Column({ type: "jsonb", nullable: true })
    values: { [index: string]: string };

    @BeforeInsert()
    @BeforeUpdate()
    typeToString() {
        // map number (js) to string (postgres)
        this.timestamp = this.timestamp.toString();
    }

    @AfterInsert()
    @AfterUpdate()
    @AfterLoad()
    typeFromString() {
        // map string (postgres) to number (js)
        this.timestamp = Number.parseInt(this.timestamp as any, 10);
    }
}

export interface NodeValuesDTO {
    timestamp?: number | string;
    values: { [index: string]: string };
}
