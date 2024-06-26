import { TeamRepository as TeamDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

import { Controller, Get } from "sdk/http";

@Controller
class InvoiceService {

    private readonly teamDao;

    constructor() {
        this.teamDao = new TeamDao();
    }

    @Get("/teamData")
    public teamData() {

        let allTeams = this.teamDao.findAll();

        let vnlTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 1
                }
            }
        });

        let olympicTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 2
                }
            }
        });

        return {
            "AllTeams": allTeams,
            "VnlTeams": vnlTeams,
            "OlympicTeams": olympicTeams
        };

    }


}