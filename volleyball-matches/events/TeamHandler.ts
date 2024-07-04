import { TeamRepository } from "../../gen/volleyball-matches/dao/Teams/TeamRepository";
import { MatchRepository } from "../../gen/volleyball-matches/dao/Matches/MatchRepository";

export const trigger = (event) => {

    const TeamDao = new TeamRepository();
    const MatchDao = new MatchRepository();

    if (event.operation === "create") {
        console.log("under here");
        console.log(event.entity);
    }
}