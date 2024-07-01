import { TeamRepository } from "../../gen/volleyball-matches/dao/Teams/TeamRepository";
import { MatchRepository } from "../../gen/volleyball-matches/dao/Matches/MatchRepository";

export const trigger = (event) => {
    const TeamDao = new TeamRepository();
    const MatchDao = new MatchRepository();

    const item = event.entity;

    const matches = MatchDao.findAll({
        $filter: {
            equals: {
                Id: item.MATCH_ID
            }
        }
    });

    if (matches[0] !== undefined) {
        const winner = TeamDao.findById(matches[0].Winnerteam);

        if (winner !== undefined) {
            winner.Points = winner.Points + 3;

            TeamDao.update(winner);
        }
    }
};