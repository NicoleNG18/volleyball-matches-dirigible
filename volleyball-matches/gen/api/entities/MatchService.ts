import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { MatchRepository, MatchEntityOptions } from "../../dao/entities/MatchRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("volleyball-matches-entities-Match", ["validate"]);

@Controller
class MatchService {

    private readonly repository = new MatchRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: MatchEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/volleyball-matches/gen/api/entities/MatchService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("Match not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("Match not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Set_1 === null || entity.Set_1 === undefined) {
            throw new ValidationError(`The 'Set_1' property is required, provide a valid value`);
        }
        if (entity.Set_1?.length > 20) {
            throw new ValidationError(`The 'Set_1' exceeds the maximum length of [20] characters`);
        }
        if (entity.Set2 === null || entity.Set2 === undefined) {
            throw new ValidationError(`The 'Set2' property is required, provide a valid value`);
        }
        if (entity.Set2?.length > 20) {
            throw new ValidationError(`The 'Set2' exceeds the maximum length of [20] characters`);
        }
        if (entity.Set_3 === null || entity.Set_3 === undefined) {
            throw new ValidationError(`The 'Set_3' property is required, provide a valid value`);
        }
        if (entity.Set_3?.length > 20) {
            throw new ValidationError(`The 'Set_3' exceeds the maximum length of [20] characters`);
        }
        if (entity.Set_4?.length > 20) {
            throw new ValidationError(`The 'Set_4' exceeds the maximum length of [20] characters`);
        }
        if (entity.Set_5?.length > 20) {
            throw new ValidationError(`The 'Set_5' exceeds the maximum length of [20] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
