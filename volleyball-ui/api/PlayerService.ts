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

        let bulgarians = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 1
                }
            }
        });

        let polish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 2
                }
            }
        });

        let slovenian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 3
                }
            }
        });

        let french = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 4
                }
            }
        });


        let brazilian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 5
                }
            }
        });


        let dutch = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 6
                }
            }
        });

        let canadian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 7
                }
            }
        });

        let cuban = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 8
                }
            }
        });

        let american = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 9
                }
            }
        });

        let chineese = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 10
                }
            }
        });

        let turkish = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 11
                }
            }
        });

        let serbian = this.playerDao.findAll({
            $filter: {
                equals: {
                    Team: 12
                }
            }
        });

        return {
            "Serbia": serbian,
            "Turkey": turkish,
            "USA": american,
            "Brazil": brazilian,
            "Canada": canadian,
            "China": chineese,
            "France": french,
            "Bulgaria": bulgarians,
            "Slovenia": slovenian,
            "Netherlands": dutch,
            "Poland": polish,
            "Cuba": cuban
        };

    }


}