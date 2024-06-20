import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CoachEntity {
    readonly Id: number;
    Name?: string;
    Team?: number;
}

export interface CoachCreateEntity {
    readonly Name?: string;
    readonly Team?: number;
}

export interface CoachUpdateEntity extends CoachCreateEntity {
    readonly Id: number;
}

export interface CoachEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Team?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Team?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Team?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Team?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Team?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Team?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Team?: number;
        };
    },
    $select?: (keyof CoachEntity)[],
    $sort?: string | (keyof CoachEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CoachEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CoachEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CoachUpdateEntityEvent extends CoachEntityEvent {
    readonly previousEntity: CoachEntity;
}

export class CoachRepository {

    private static readonly DEFINITION = {
        table: "VOLEYBALL_MATCHES_COACH",
        properties: [
            {
                name: "Id",
                column: "COACH_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "COACH_NAME",
                type: "VARCHAR",
            },
            {
                name: "Team",
                column: "COACH_TEAM",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CoachRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CoachEntityOptions): CoachEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CoachEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CoachCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "VOLEYBALL_MATCHES_COACH",
            entity: entity,
            key: {
                name: "Id",
                column: "COACH_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CoachUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "VOLEYBALL_MATCHES_COACH",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "COACH_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CoachCreateEntity | CoachUpdateEntity): number {
        const id = (entity as CoachUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CoachUpdateEntity);
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
            table: "VOLEYBALL_MATCHES_COACH",
            entity: entity,
            key: {
                name: "Id",
                column: "COACH_ID",
                value: id
            }
        });
    }

    public count(options?: CoachEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "VOLEYBALL_MATCHES_COACH"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CoachEntityEvent | CoachUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("volleyball-matches-entities-Coach", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("volleyball-matches-entities-Coach").send(JSON.stringify(data));
    }
}
