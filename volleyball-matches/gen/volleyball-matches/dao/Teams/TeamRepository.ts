import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface TeamEntity {
    readonly Id: number;
    Name?: string;
    League?: number;
    Points?: number;
}

export interface TeamCreateEntity {
    readonly Name?: string;
    readonly League?: number;
    readonly Points?: number;
}

export interface TeamUpdateEntity extends TeamCreateEntity {
    readonly Id: number;
}

export interface TeamEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            League?: number | number[];
            Points?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            League?: number | number[];
            Points?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            League?: number;
            Points?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            League?: number;
            Points?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            League?: number;
            Points?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            League?: number;
            Points?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            League?: number;
            Points?: number;
        };
    },
    $select?: (keyof TeamEntity)[],
    $sort?: string | (keyof TeamEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface TeamEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<TeamEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface TeamUpdateEntityEvent extends TeamEntityEvent {
    readonly previousEntity: TeamEntity;
}

export class TeamRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_TEAM",
        properties: [
            {
                name: "Id",
                column: "TEAM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "TEAM_NAME",
                type: "VARCHAR",
            },
            {
                name: "League",
                column: "TEAM_LEAGUE",
                type: "INTEGER",
            },
            {
                name: "Points",
                column: "TEAM_POINTS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(TeamRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: TeamEntityOptions): TeamEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): TeamEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: TeamCreateEntity): number {
        if (entity.Points === undefined || entity.Points === null) {
            (entity as TeamEntity).Points = 0;
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_TEAM",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: TeamUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_TEAM",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "TEAM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: TeamCreateEntity | TeamUpdateEntity): number {
        const id = (entity as TeamUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as TeamUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_TEAM",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAM_ID",
                value: id
            }
        });
    }

    public count(options?: TeamEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_TEAM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: TeamEntityEvent | TeamUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-Teams-Team", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-Teams-Team").send(JSON.stringify(data));
    }
}
