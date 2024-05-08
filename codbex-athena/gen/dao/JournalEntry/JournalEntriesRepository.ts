import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface JournalEntriesEntity {
    readonly Id: number;
    Date: Date;
    Account?: number;
    JournalEntryDirections?: number;
}

export interface JournalEntriesCreateEntity {
    readonly Account?: number;
    readonly JournalEntryDirections?: number;
}

export interface JournalEntriesUpdateEntity extends JournalEntriesCreateEntity {
    readonly Id: number;
}

export interface JournalEntriesEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Account?: number | number[];
            JournalEntryDirections?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Account?: number | number[];
            JournalEntryDirections?: number | number[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            JournalEntryDirections?: number;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            JournalEntryDirections?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            JournalEntryDirections?: number;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            JournalEntryDirections?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            JournalEntryDirections?: number;
        };
    },
    $select?: (keyof JournalEntriesEntity)[],
    $sort?: string | (keyof JournalEntriesEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface JournalEntriesEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<JournalEntriesEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class JournalEntriesRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ATHENA_JOURNALENTRIES",
        properties: [
            {
                name: "Id",
                column: "JOURNALENTRIES_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "JOURNALENTRIES_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Account",
                column: "JOURNALENTRIES_ACCOUNT",
                type: "INTEGER",
            },
            {
                name: "JournalEntryDirections",
                column: "JOURNALENTRIES_JOURNALENTRYDIRECTIONS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(JournalEntriesRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: JournalEntriesEntityOptions): JournalEntriesEntity[] {
        return this.dao.list(options).map((e: JournalEntriesEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): JournalEntriesEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: JournalEntriesCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ATHENA_JOURNALENTRIES",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRIES_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: JournalEntriesUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ATHENA_JOURNALENTRIES",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRIES_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: JournalEntriesCreateEntity | JournalEntriesUpdateEntity): number {
        const id = (entity as JournalEntriesUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as JournalEntriesUpdateEntity);
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
            table: "CODBEX_ATHENA_JOURNALENTRIES",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRIES_ID",
                value: id
            }
        });
    }

    public count(options?: JournalEntriesEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ATHENA_JOURNALENTRIES"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: JournalEntriesEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-athena-JournalEntry-JournalEntries", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-athena-JournalEntry-JournalEntries").send(JSON.stringify(data));
    }
}
