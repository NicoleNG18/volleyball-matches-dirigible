import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface MatchEntity {
    readonly Id: number;
    League?: number;
    Guest?: number;
    Host?: number;
    Result?: string;
    PointsGuest?: number;
    PointsHost?: number;
    Season?: number;
}

export interface MatchCreateEntity {
    readonly League?: number;
    readonly Guest?: number;
    readonly Host?: number;
    readonly Result?: string;
    readonly PointsGuest?: number;
    readonly PointsHost?: number;
    readonly Season?: number;
}

export interface MatchUpdateEntity extends MatchCreateEntity {
    readonly Id: number;
}

export interface MatchEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            League?: number | number[];
            Guest?: number | number[];
            Host?: number | number[];
            Result?: string | string[];
            PointsGuest?: number | number[];
            PointsHost?: number | number[];
            Season?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            League?: number | number[];
            Guest?: number | number[];
            Host?: number | number[];
            Result?: string | string[];
            PointsGuest?: number | number[];
            PointsHost?: number | number[];
            Season?: number | number[];
        };
        contains?: {
            Id?: number;
            League?: number;
            Guest?: number;
            Host?: number;
            Result?: string;
            PointsGuest?: number;
            PointsHost?: number;
            Season?: number;
        };
        greaterThan?: {
            Id?: number;
            League?: number;
            Guest?: number;
            Host?: number;
            Result?: string;
            PointsGuest?: number;
            PointsHost?: number;
            Season?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            League?: number;
            Guest?: number;
            Host?: number;
            Result?: string;
            PointsGuest?: number;
            PointsHost?: number;
            Season?: number;
        };
        lessThan?: {
            Id?: number;
            League?: number;
            Guest?: number;
            Host?: number;
            Result?: string;
            PointsGuest?: number;
            PointsHost?: number;
            Season?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            League?: number;
            Guest?: number;
            Host?: number;
            Result?: string;
            PointsGuest?: number;
            PointsHost?: number;
            Season?: number;
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
                name: "Guest",
                column: "MATCH_WINNER_TEAM",
                type: "INTEGER",
            },
            {
                name: "Host",
                column: "MATCH_LOST_TEAM",
                type: "INTEGER",
            },
            {
                name: "Result",
                column: "MATCH_RESULT",
                type: "VARCHAR",
            },
            {
                name: "PointsGuest",
                column: "MATCH_POINTSGUEST",
                type: "INTEGER",
            },
            {
                name: "PointsHost",
                column: "MATCH_POINTSHOST",
                type: "INTEGER",
            },
            {
                name: "Season",
                column: "MATCH_SEASON",
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
