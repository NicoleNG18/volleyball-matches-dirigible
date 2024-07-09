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
        }).sort((a, b) => a.VNLpoints > b.VNLpoints ? -1 : a.VNLpoints < b.VNLpoints ? 1 : 0);

        let olympicTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 2
                }
            }
        }).sort((a, b) => a.VNLpoints > b.VNLpoints ? -1 : a.VNLpoints < b.VNLpoints ? 1 : 0);

        let europeanChampTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 3
                }
            }
        }).sort((a, b) => a.VNLpoints > b.VNLpoints ? -1 : a.VNLpoints < b.VNLpoints ? 1 : 0);

        let worldChampTeams = this.teamDao.findAll({
            $filter: {
                equals: {
                    League: 4
                }
            }
        }).sort((a, b) => a.VNLpoints > b.VNLpoints ? -1 : a.VNLpoints < b.VNLpoints ? 1 : 0);

        const sqlUnits = "SELECT t.TEAM_NAME as NAME, t.TEAM_LEAGUE AS LEAGUE, t.TEAM_SUMPOINTS as SUMPOINTS FROM VOLLEYBALL_MATCHES_TEAM t ORDER BY t.TEAM_SUMPOINTS DESC LIMIT 5";
        let resultset = query.execute(sqlUnits);

        const topFiveTeams = resultset.map(row => ({
            Name: row.NAME,
            League: row.LEAGUE,
            Points: row.SUMPOINTS
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