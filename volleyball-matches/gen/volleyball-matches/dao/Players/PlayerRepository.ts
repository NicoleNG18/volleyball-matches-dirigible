import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PlayerEntity {
    readonly Id: number;
    Name?: string;
    Age?: number;
    Team?: number;
    Season?: number;
}

export interface PlayerCreateEntity {
    readonly Name?: string;
    readonly Age?: number;
    readonly Team?: number;
    readonly Season?: number;
}

export interface PlayerUpdateEntity extends PlayerCreateEntity {
    readonly Id: number;
}

export interface PlayerEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Age?: number | number[];
            Team?: number | number[];
            Season?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Age?: number | number[];
            Team?: number | number[];
            Season?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Age?: number;
            Team?: number;
            Season?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Age?: number;
            Team?: number;
            Season?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Age?: number;
            Team?: number;
            Season?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Age?: number;
            Team?: number;
            Season?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Age?: number;
            Team?: number;
            Season?: number;
        };
    },
    $select?: (keyof PlayerEntity)[],
    $sort?: string | (keyof PlayerEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PlayerEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PlayerEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface PlayerUpdateEntityEvent extends PlayerEntityEvent {
    readonly previousEntity: PlayerEntity;
}

export class PlayerRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_PLAYER",
        properties: [
            {
                name: "Id",
                column: "PLAYER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PLAYER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Age",
                column: "PLAYER_AGE",
                type: "INTEGER",
            },
            {
                name: "Team",
                column: "PLAYER_TEAM",
                type: "INTEGER",
            },
            {
                name: "Season",
                column: "PLAYER_SEASON",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PlayerRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PlayerEntityOptions): PlayerEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PlayerEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PlayerCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_PLAYER",
            entity: entity,
            key: {
                name: "Id",
                column: "PLAYER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PlayerUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_PLAYER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PLAYER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PlayerCreateEntity | PlayerUpdateEntity): number {
        const id = (entity as PlayerUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PlayerUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_PLAYER",
            entity: entity,
            key: {
                name: "Id",
                column: "PLAYER_ID",
                value: id
            }
        });
    }

    public count(options?: PlayerEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_PLAYER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PlayerEntityEvent | PlayerUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-Players-Player", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-Players-Player").send(JSON.stringify(data));
    }
}
