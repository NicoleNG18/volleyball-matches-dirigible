import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SeasonEntity {
    readonly Id: number;
    Year: string;
}

export interface SeasonCreateEntity {
    readonly Year: string;
}

export interface SeasonUpdateEntity extends SeasonCreateEntity {
    readonly Id: number;
}

export interface SeasonEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Year?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Year?: string | string[];
        };
        contains?: {
            Id?: number;
            Year?: string;
        };
        greaterThan?: {
            Id?: number;
            Year?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Year?: string;
        };
        lessThan?: {
            Id?: number;
            Year?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Year?: string;
        };
    },
    $select?: (keyof SeasonEntity)[],
    $sort?: string | (keyof SeasonEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SeasonEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SeasonEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface SeasonUpdateEntityEvent extends SeasonEntityEvent {
    readonly previousEntity: SeasonEntity;
}

export class SeasonRepository {

    private static readonly DEFINITION = {
        table: "VOLLEYBALL_MATCHES_SEASON",
        properties: [
            {
                name: "Id",
                column: "SEASON_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Year",
                column: "SEASON_YEAR",
                type: "VARCHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SeasonRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SeasonEntityOptions): SeasonEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SeasonEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SeasonCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLLEYBALL_MATCHES_SEASON",
            entity: entity,
            key: {
                name: "Id",
                column: "SEASON_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SeasonUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLLEYBALL_MATCHES_SEASON",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SEASON_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SeasonCreateEntity | SeasonUpdateEntity): number {
        const id = (entity as SeasonUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SeasonUpdateEntity);
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
            table: "VOLLEYBALL_MATCHES_SEASON",
            entity: entity,
            key: {
                name: "Id",
                column: "SEASON_ID",
                value: id
            }
        });
    }

    public count(options?: SeasonEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLLEYBALL_MATCHES_SEASON"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SeasonEntityEvent | SeasonUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-Season-Season", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-Season-Season").send(JSON.stringify(data));
    }
}
