import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface TeamPointsEntity {
    readonly Id: number;
    Team?: number;
    VNL?: number;
    OlympicGames?: number;
    EuropeanChamp?: number;
    WorldChamp?: number;
    SumPoints?: number;
}

export interface TeamPointsCreateEntity {
    readonly Team?: number;
    readonly VNL?: number;
    readonly OlympicGames?: number;
    readonly EuropeanChamp?: number;
    readonly WorldChamp?: number;
}

export interface TeamPointsUpdateEntity extends TeamPointsCreateEntity {
    readonly Id: number;
}

export interface TeamPointsEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Team?: number | number[];
            VNL?: number | number[];
            OlympicGames?: number | number[];
            EuropeanChamp?: number | number[];
            WorldChamp?: number | number[];
            SumPoints?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Team?: number | number[];
            VNL?: number | number[];
            OlympicGames?: number | number[];
            EuropeanChamp?: number | number[];
            WorldChamp?: number | number[];
            SumPoints?: number | number[];
        };
        contains?: {
            Id?: number;
            Team?: number;
            VNL?: number;
            OlympicGames?: number;
            EuropeanChamp?: number;
            WorldChamp?: number;
            SumPoints?: number;
        };
        greaterThan?: {
            Id?: number;
            Team?: number;
            VNL?: number;
            OlympicGames?: number;
            EuropeanChamp?: number;
            WorldChamp?: number;
            SumPoints?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Team?: number;
            VNL?: number;
            OlympicGames?: number;
            EuropeanChamp?: number;
            WorldChamp?: number;
            SumPoints?: number;
        };
        lessThan?: {
            Id?: number;
            Team?: number;
            VNL?: number;
            OlympicGames?: number;
            EuropeanChamp?: number;
            WorldChamp?: number;
            SumPoints?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Team?: number;
            VNL?: number;
            OlympicGames?: number;
            EuropeanChamp?: number;
            WorldChamp?: number;
            SumPoints?: number;
        };
    },
    $select?: (keyof TeamPointsEntity)[],
    $sort?: string | (keyof TeamPointsEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface TeamPointsEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<TeamPointsEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface TeamPointsUpdateEntityEvent extends TeamPointsEntityEvent {
    readonly previousEntity: TeamPointsEntity;
}

export class TeamPointsRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_TEAMPOINTS",
        properties: [
            {
                name: "Id",
                column: "TEAMPOINTS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Team",
                column: "TEAMPOINTS_TEAM",
                type: "INTEGER",
            },
            {
                name: "VNL",
                column: "TEAMPOINTS_VNL",
                type: "INTEGER",
            },
            {
                name: "OlympicGames",
                column: "TEAMPOINTS_OLYMPICGAMES",
                type: "INTEGER",
            },
            {
                name: "EuropeanChamp",
                column: "TEAMPOINTS_EUROPEANCHAMP",
                type: "INTEGER",
            },
            {
                name: "WorldChamp",
                column: "TEAMPOINTS_WORLDCHAMP",
                type: "INTEGER",
            },
            {
                name: "SumPoints",
                column: "TEAMPOINTS_SUMPOINTS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(TeamPointsRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: TeamPointsEntityOptions): TeamPointsEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): TeamPointsEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: TeamPointsCreateEntity): number {
        // @ts-ignore
        (entity as TeamPointsEntity).SumPoints = entity['VNL']+entity['OlympicGames']+entity['EuropeanChamp']+entity['WorldChamp'];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_TEAMPOINTS",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAMPOINTS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: TeamPointsUpdateEntity): void {
        // @ts-ignore
        (entity as TeamPointsEntity).SumPoints = entity['VNL']+entity['OlympicGames']+entity['EuropeanChamp']+entity['WorldChamp'];
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_TEAMPOINTS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "TEAMPOINTS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: TeamPointsCreateEntity | TeamPointsUpdateEntity): number {
        const id = (entity as TeamPointsUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as TeamPointsUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_TEAMPOINTS",
            entity: entity,
            key: {
                name: "Id",
                column: "TEAMPOINTS_ID",
                value: id
            }
        });
    }

    public count(options?: TeamPointsEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_TEAMPOINTS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: TeamPointsEntityEvent | TeamPointsUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-entities-TeamPoints", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-entities-TeamPoints").send(JSON.stringify(data));
    }
}
