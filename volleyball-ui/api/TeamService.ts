import { TeamRepository as TeamDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

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

        let europeanChampTeams = this.teamDao.findAll({
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

        const sqlUnits = "SELECT t.TEAM_NAME as NAME, t.TEAM_LEAGUE AS LEAGUE, t.TEAM_POINTS AS POINTS FROM VOLLEYBALL_MATCHES_TEAM t ORDER BY POINTS DESC LIMIT 5";
        let resultset = query.execute(sqlUnits);

        const topFiveTeams = resultset.map(row => ({
            Name: row.NAME,
            League: row.LEAGUE,
            Points: row.POINTS
        }));

        return {
            "VnlTeams": vnlTeams,
            "OlympicTeams": olympicTeams,
            "EuropeanChampTeams": europeanChampTeams,
            "WorldChampTeams": worldChampTeams,
            "TopFiveTeams": topFiveTeams
        };
    }
}