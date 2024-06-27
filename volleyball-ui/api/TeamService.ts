import { TeamRepository as TeamDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

import { Controller, Get } from "sdk/http";

@Controller
class TeamService {

    private readonly teamDao;

    constructor() {
        this.teamDao = new TeamDao();
    }

    @Get("/teamData")
    public teamData() {

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

        let europeanTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 3
                }
            }
        });

        let worldChampTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 4
                }
            }
        });

        return {
            "VnlTeams": vnlTeams,
            "OlympicTeams": olympicTeams,
            "EuropeanTeams": europeanTeams,
            "WorldChampTeams": worldChampTeams
        };

    }


}