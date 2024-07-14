import { TeamLeagueRepository as TeamLeagueDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamLeagueRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

@Controller
class TeamService {

    private readonly teamLeagueDao;

    constructor() {
        this.teamLeagueDao = new TeamLeagueDao();
    }

    @Get("/teamData")
    public teamData() {

        let vnlTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 1
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let olympicTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 2
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let europeanChampTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 3
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let worldChampTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 4
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        const sqlUnits = "SELECT t.TEAM_NAME as NAME, t.TEAM_SUMPOINTS AS POINTS FROM VOLLEYBALL_MATCHES_TEAM t ORDER BY t.TEAM_SUMPOINTS DESC LIMIT 5";
        let resultset = query.execute(sqlUnits);

        const topFiveTeams = resultset.map(row => ({
            Name: row.NAME,
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