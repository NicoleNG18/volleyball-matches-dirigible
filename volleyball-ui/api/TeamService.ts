import { TeamRepository as TeamDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";
import { TeamPointsRepository as TeamPointsDao } from "volleyball-matches/gen/volleyball-matches/dao/entities/TeamPointsRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

@Controller
class TeamService {

    private readonly teamDao;
    private readonly teamPointsDao;

    constructor() {
        this.teamDao = new TeamDao();
        this.teamPointsDao = new TeamPointsDao();
    }

    @Get("/teamData")
    public teamData() {

        let vnlTeams = this.teamPointsDao.findAll({
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

        const sqlUnits = "SELECT t.TEAM_NAME as NAME, t.TEAM_LEAGUE AS LEAGUE, tp.TEAMPOINTS_SUMPOINTS as SUMPOINTS FROM VOLLEYBALL_MATCHES_TEAM t JOIN VOLLEYBALL_MATCHES_TEAMPOINTS tp ON t.TEAM_ID=tp.TEAMPOINTS_TEAM ORDER BY tp.TEAMPOINTS_SUMPOINTS DESC LIMIT 5";
        let resultset = query.execute(sqlUnits);

        const topFiveTeams = resultset.map(row => ({
            Name: row.NAME,
            League: row.LEAGUE,
            Points: row.SUMPOINTS
        }));

        console.log(topFiveTeams);

        return {
            "VnlTeams": vnlTeams,
            "OlympicTeams": olympicTeams,
            "EuropeanChampTeams": europeanChampTeams,
            "WorldChampTeams": worldChampTeams,
            "TopFiveTeams": topFiveTeams
        };
    }
}