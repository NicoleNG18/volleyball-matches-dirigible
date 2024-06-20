import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface MatchEntity {
    readonly Id: number;
    Set_1?: string;
    Set2?: string;
    Set_3?: string;
    Set_4?: string;
    Set_5?: string;
    League?: number;
    Winner_team?: number;
    Lost_team?: number;
}

export interface MatchCreateEntity {
    readonly Set_1?: string;
    readonly Set2?: string;
    readonly Set_3?: string;
    readonly Set_4?: string;
    readonly Set_5?: string;
    readonly League?: number;
    readonly Winner_team?: number;
    readonly Lost_team?: number;
}

export interface MatchUpdateEntity extends MatchCreateEntity {
    readonly Id: number;
}

export interface MatchEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Set_1?: string | string[];
            Set2?: string | string[];
            Set_3?: string | string[];
            Set_4?: string | string[];
            Set_5?: string | string[];
            League?: number | number[];
            Winner_team?: number | number[];
            Lost_team?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Set_1?: string | string[];
            Set2?: string | string[];
            Set_3?: string | string[];
            Set_4?: string | string[];
            Set_5?: string | string[];
            League?: number | number[];
            Winner_team?: number | number[];
            Lost_team?: number | number[];
        };
        contains?: {
            Id?: number;
            Set_1?: string;
            Set2?: string;
            Set_3?: string;
            Set_4?: string;
            Set_5?: string;
            League?: number;
            Winner_team?: number;
            Lost_team?: number;
        };
        greaterThan?: {
            Id?: number;
            Set_1?: string;
            Set2?: string;
            Set_3?: string;
            Set_4?: string;
            Set_5?: string;
            League?: number;
            Winner_team?: number;
            Lost_team?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Set_1?: string;
            Set2?: string;
            Set_3?: string;
            Set_4?: string;
            Set_5?: string;
            League?: number;
            Winner_team?: number;
            Lost_team?: number;
        };
        lessThan?: {
            Id?: number;
            Set_1?: string;
            Set2?: string;
            Set_3?: string;
            Set_4?: string;
            Set_5?: string;
            League?: number;
            Winner_team?: number;
            Lost_team?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Set_1?: string;
            Set2?: string;
            Set_3?: string;
            Set_4?: string;
            Set_5?: string;
            League?: number;
            Winner_team?: number;
            Lost_team?: number;
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
        table: "VOLEYBALL_MATCHES_MATCH",
        properties: [
            {
                name: "Id",
                column: "MATCH_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Set_1",
                column: "MATCH_SET_1",
                type: "VARCHAR",
            },
            {
                name: "Set2",
                column: "MATCH_SET2",
                type: "VARCHAR",
            },
            {
                name: "Set_3",
                column: "MATCH_SET_3",
                type: "VARCHAR",
            },
            {
                name: "Set_4",
                column: "MATCH_SET_4",
                type: "VARCHAR",
            },
            {
                name: "Set_5",
                column: "MATCH_SET_5",
                type: "VARCHAR",
            },
            {
                name: "League",
                column: "MATCH_LEAGUE",
                type: "INTEGER",
            },
            {
                name: "Winner_team",
                column: "MATCH_WINNER_TEAM",
                type: "INTEGER",
            },
            {
                name: "Lost_team",
                column: "MATCH_LOST_TEAM",
                type: "INTEGER",
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
            table: "VOLEYBALL_MATCHES_MATCH",
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
            table: "VOLEYBALL_MATCHES_MATCH",
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
            table: "VOLEYBALL_MATCHES_MATCH",
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
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLEYBALL_MATCHES_MATCH"');
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
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-entities-Match", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-entities-Match").send(JSON.stringify(data));
    }
}
