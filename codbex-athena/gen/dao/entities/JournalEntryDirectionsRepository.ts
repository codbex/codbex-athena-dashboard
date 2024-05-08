import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface JournalEntryDirectionsEntity {
    readonly Id: number;
    Name: string;
}

export interface JournalEntryDirectionsCreateEntity {
    readonly Name: string;
}

export interface JournalEntryDirectionsUpdateEntity extends JournalEntryDirectionsCreateEntity {
    readonly Id: number;
}

export interface JournalEntryDirectionsEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof JournalEntryDirectionsEntity)[],
    $sort?: string | (keyof JournalEntryDirectionsEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface JournalEntryDirectionsEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<JournalEntryDirectionsEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class JournalEntryDirectionsRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ATHENA_JOURNALENTRYDIRECTIONS",
        properties: [
            {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "JOURNALENTRYDIRECTIONS_NAME",
                type: "VARCHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(JournalEntryDirectionsRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: JournalEntryDirectionsEntityOptions): JournalEntryDirectionsEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): JournalEntryDirectionsEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: JournalEntryDirectionsCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ATHENA_JOURNALENTRYDIRECTIONS",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: JournalEntryDirectionsUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ATHENA_JOURNALENTRYDIRECTIONS",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: JournalEntryDirectionsCreateEntity | JournalEntryDirectionsUpdateEntity): number {
        const id = (entity as JournalEntryDirectionsUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as JournalEntryDirectionsUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_ATHENA_JOURNALENTRYDIRECTIONS",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: id
            }
        });
    }

    public count(options?: JournalEntryDirectionsEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ATHENA_JOURNALENTRYDIRECTIONS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: JournalEntryDirectionsEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-athena-entities-JournalEntryDirections", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-athena-entities-JournalEntryDirections").send(JSON.stringify(data));
    }
}
