import { PlayerRepository as PlayerDao } from "volleyball-matches/gen/volleyball-matches/dao/Players/PlayerRepository";

import { Controller, Get } from "sdk/http";

@Controller
class PlayerService {

    private readonly playerDao;

    constructor() {
        this.playerDao = new PlayerDao();
    }

    @Get("/playerData")
    public playerData() {

        let bulgarian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 1
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);


        let polish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 2
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let slovenian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 3
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let french = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 4
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let brazilian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 5
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let dutch = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 6
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let canadian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 7
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let cuban = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 8
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let american = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 9
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let chineese = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 10
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let turkish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 11
                }
            }
        }).sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

        let serbian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 12
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