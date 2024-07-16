import { PlayerRepository as PlayerDao } from "volleyball-matches/gen/volleyball-matches/dao/Players/PlayerRepository";
import { SeasonRepository as SeasonDao } from "volleyball-matches/gen/volleyball-matches/dao/Season/SeasonRepository";

import { Controller, Get } from "sdk/http";

@Controller
class PlayerService {

    private readonly playerDao;
    private readonly seasonDao;

    constructor() {
        this.playerDao = new PlayerDao();
        this.seasonDao = new SeasonDao();
    }

    @Get("/:season")
    public playerData24(_: any, ctx: any) {

        const seasonParam = ctx.pathParameters.season;

        let season = this.seasonDao.findAll({
            $filter: {
                equals: {
                    Year: seasonParam
                }
            }
        });

        let bulgarian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 1,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);


        let polish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 2,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let slovenian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 3,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let french = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 4,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let brazilian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 5,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let dutch = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 6,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let canadian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 7,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let cuban = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 8,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let american = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 9,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let chineese = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 10,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let turkish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 11,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let serbian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 12,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        return {
            "Serbian": serbian,
            "Turkish": turkish,
            "American": american,
            "Brazilian": brazilian,
            "Canadian": canadian,
            "Chineese": chineese,
            "French": french,
            "Bulgarian": bulgarian,
            "Slovenian": slovenian,
            "Dutch": dutch,
            "Polish": polish,
            "Cuban": cuban
        };

    }

}