import { MatchRepository as MatchDao } from "../../../../volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";

import { Controller, Get } from "sdk/http";

@Controller
class GenerateMatchService {

    private readonly matchDao;

    constructor() {
        this.matchDao = new MatchDao();
    }

    @Get("/matchData/:matchId")
    public salesOrderData(_: any, ctx: any) {
        const matchId = ctx.pathParameters.MATCH_ID;

        let match = this.matchDao.findById(matchId);

        return {
            "Winner": match.Winnerteam,
            "Match": match
        };
    }

}
