import { TeamLeagueRepository as TeamLeagueDao } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamLeagueRepository";
import { SeasonRepository as SeasonDao } from "volleyball-matches/gen/volleyball-matches/dao/Season/SeasonRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

@Controller
class TeamService {

    private readonly teamLeagueDao;
    private readonly seasonDao;

    constructor() {
        this.teamLeagueDao = new TeamLeagueDao();
        this.seasonDao = new SeasonDao();
    }

    @Get("/:season")
    public teamData(_: any, ctx: any) {

        const seasonParam = ctx.pathParameters.season;

        let season = this.seasonDao.findAll({
            $filter: {
                equals: {
                    Year: seasonParam
                }
            }
        });

        let vnlTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 1,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let olympicTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 2,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let europeanChampTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 3,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        let worldChampTeams = this.teamLeagueDao.findAll({
            $filter: {
                equals: {
                    League: 4,
                    Season: season[0].Id
                }
            }
        }).sort((a, b) => a.Points > b.Points ? -1 : a.Points < b.Points ? 1 : 0);

        const sqlUnits = "SELECT TEAM_NAME as NAME, TEAM_SUMPOINTS AS POINTS FROM VOLLEYBALL_MATCHES_TEAM ORDER BY TEAM_SUMPOINTS DESC LIMIT 5";
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