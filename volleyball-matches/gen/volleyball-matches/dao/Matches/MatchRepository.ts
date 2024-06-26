import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface MatchEntity {
    readonly Id: number;
    League?: number;
    Winnerteam?: number;
    Lostteam?: number;
    Set1?: string;
    Set2?: string;
    Set3?: string;
    Set4?: string;
    Set5?: string;
}

export interface MatchCreateEntity {
    readonly League?: number;
    readonly Winnerteam?: number;
    readonly Lostteam?: number;
    readonly Set1?: string;
    readonly Set2?: string;
    readonly Set3?: string;
    readonly Set4?: string;
    readonly Set5?: string;
}

export interface MatchUpdateEntity extends MatchCreateEntity {
    readonly Id: number;
}

export interface MatchEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            League?: number | number[];
            Winnerteam?: number | number[];
            Lostteam?: number | number[];
            Set1?: string | string[];
            Set2?: string | string[];
            Set3?: string | string[];
            Set4?: string | string[];
            Set5?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            League?: number | number[];
            Winnerteam?: number | number[];
            Lostteam?: number | number[];
            Set1?: string | string[];
            Set2?: string | string[];
            Set3?: string | string[];
            Set4?: string | string[];
            Set5?: string | string[];
        };
        contains?: {
            Id?: number;
            League?: number;
            Winnerteam?: number;
            Lostteam?: number;
            Set1?: string;
            Set2?: string;
            Set3?: string;
            Set4?: string;
            Set5?: string;
        };
        greaterThan?: {
            Id?: number;
            League?: number;
            Winnerteam?: number;
            Lostteam?: number;
            Set1?: string;
            Set2?: string;
            Set3?: string;
            Set4?: string;
            Set5?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            League?: number;
            Winnerteam?: number;
            Lostteam?: number;
            Set1?: string;
            Set2?: string;
            Set3?: string;
            Set4?: string;
            Set5?: string;
        };
        lessThan?: {
            Id?: number;
            League?: number;
            Winnerteam?: number;
            Lostteam?: number;
            Set1?: string;
            Set2?: string;
            Set3?: string;
            Set4?: string;
            Set5?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            League?: number;
            Winnerteam?: number;
            Lostteam?: number;
            Set1?: string;
            Set2?: string;
            Set3?: string;
            Set4?: string;
            Set5?: string;
        };
    },
    $select?: (keyof MatchEntity)[],
    $sort?: string | (keyof MatchEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface MatchEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<MatchEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface MatchUpdateEntityEvent extends MatchEntityEvent {
    readonly previousEntity: MatchEntity;
}

export class MatchRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_MATCH",
        properties: [
            {
                name: "Id",
                column: "MATCH_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "League",
                column: "MATCH_LEAGUE",
                type: "INTEGER",
            },
            {
                name: "Winnerteam",
                column: "MATCH_WINNER_TEAM",
                type: "INTEGER",
            },
            {
                name: "Lostteam",
                column: "MATCH_LOST_TEAM",
                type: "INTEGER",
            },
            {
                name: "Set1",
                column: "MATCH_SET_1",
                type: "VARCHAR",
            },
            {
                name: "Set2",
                column: "MATCH_SET2",
                type: "VARCHAR",
            },
            {
                name: "Set3",
                column: "MATCH_SET_3",
                type: "VARCHAR",
            },
            {
                name: "Set4",
                column: "MATCH_SET_4",
                type: "VARCHAR",
            },
            {
                name: "Set5",
                column: "MATCH_SET_5",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(MatchRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: MatchEntityOptions): MatchEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): MatchEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: MatchCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_MATCH",
            entity: entity,
            key: {
                name: "Id",
                column: "MATCH_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: MatchUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_MATCH",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "MATCH_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: MatchCreateEntity | MatchUpdateEntity): number {
        const id = (entity as MatchUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as MatchUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_MATCH",
            entity: entity,
            key: {
                name: "Id",
                column: "MATCH_ID",
                value: id
            }
        });
    }

    public count(options?: MatchEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_MATCH"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: MatchEntityEvent | MatchUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-Matches-Match", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-Matches-Match").send(JSON.stringify(data));
    }
}
