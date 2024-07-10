import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface TeamLeagueEntity {
    readonly Id: number;
    Team?: number;
    League?: number;
    Points?: number;
}

export interface TeamLeagueCreateEntity {
    readonly Team?: number;
    readonly League?: number;
    readonly Points?: number;
}

export interface TeamLeagueUpdateEntity extends TeamLeagueCreateEntity {
    readonly Id: number;
}

export interface TeamLeagueEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Team?: number | number[];
            League?: number | number[];
            Points?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Team?: number | number[];
            League?: number | number[];
            Points?: number | number[];
        };
        contains?: {
            Id?: number;
            Team?: number;
            League?: number;
            Points?: number;
        };
        greaterThan?: {
            Id?: number;
            Team?: number;
            League?: number;
            Points?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Team?: number;
            League?: number;
            Points?: number;
        };
        lessThan?: {
            Id?: number;
            Team?: number;
            League?: number;
            Points?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Team?: number;
            League?: number;
            Points?: number;
        };
    },
    $select?: (keyof TeamLeagueEntity)[],
    $sort?: string | (keyof TeamLeagueEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface TeamLeagueEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<TeamLeagueEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface TeamLeagueUpdateEntityEvent extends TeamLeagueEntityEvent {
    readonly previousEntity: TeamLeagueEntity;
}

export class TeamLeagueRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_TEAMLEAGUE",
        properties: [
            {
                name: "Id",
                column: "TEAMLEAGUE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Team",
                column: "TEAMLEAGUE_TEAM",
                type: "INTEGER",
            },
            {
                name: "League",
                column: "TEAMLEAGUE_LEAGUE",
                type: "INTEGER",
            },
            {
                name: "Points",
                column: "TEAMLEAGUE_POINTS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(TeamLeagueRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: TeamLeagueEntityOptions): TeamLeagueEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): TeamLeagueEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: TeamLeagueCreateEntity): number {
        if (entity.Points === undefined || entity.Points === null) {
            (entity as TeamLeagueEntity).Points = 0;
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_TEAMLEAGUE",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAMLEAGUE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: TeamLeagueUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_TEAMLEAGUE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "TEAMLEAGUE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: TeamLeagueCreateEntity | TeamLeagueUpdateEntity): number {
        const id = (entity as TeamLeagueUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as TeamLeagueUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_TEAMLEAGUE",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAMLEAGUE_ID",
                value: id
            }
        });
    }

    public count(options?: TeamLeagueEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_TEAMLEAGUE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: TeamLeagueEntityEvent | TeamLeagueUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-Teams-TeamLeague", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-Teams-TeamLeague").send(JSON.stringify(data));
    }
}
