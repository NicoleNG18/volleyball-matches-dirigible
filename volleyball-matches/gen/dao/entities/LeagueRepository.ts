import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeagueEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeagueCreateEntity {
    readonly Name?: string;
}

export interface LeagueUpdateEntity extends LeagueCreateEntity {
    readonly Id: number;
}

export interface LeagueEntityOptions {
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
    $select?: (keyof LeagueEntity)[],
    $sort?: string | (keyof LeagueEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeagueEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeagueEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeagueUpdateEntityEvent extends LeagueEntityEvent {
    readonly previousEntity: LeagueEntity;
}

export class LeagueRepository {

    private static readonly DEFINITION = {
        table: "VOLEYBALL_MATCHES_LEAGUE",
        properties: [
            {
                name: "Id",
                column: "LEAGUE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEAGUE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeagueRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeagueEntityOptions): LeagueEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeagueEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeagueCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLEYBALL_MATCHES_LEAGUE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAGUE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeagueUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLEYBALL_MATCHES_LEAGUE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAGUE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeagueCreateEntity | LeagueUpdateEntity): number {
        const id = (entity as LeagueUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeagueUpdateEntity);
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
            table: "VOLEYBALL_MATCHES_LEAGUE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAGUE_ID",
                value: id
            }
        });
    }

    public count(options?: LeagueEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLEYBALL_MATCHES_LEAGUE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeagueEntityEvent | LeagueUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-entities-League", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-entities-League").send(JSON.stringify(data));
    }
}
