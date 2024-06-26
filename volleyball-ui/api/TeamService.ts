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
        console.log(allTeams);

        return {
            "AllTeams": allTeams
        };

    }


}