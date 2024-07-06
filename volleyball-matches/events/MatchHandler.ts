import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();

    const matchId = event.key.value;
    const match = MatchDao.findById(matchId);

    let hostTeam = TeamDao.findById(match.Host);
    let guestTeam = TeamDao.findById(match.Guest);

    const operation = event.operation;

    if (operation === "create") {

        hostTeam.Points += match.PointsHost;
        guestTeam.Points += match.PointsGuest;

        TeamDao.update(hostTeam);
        TeamDao.update(guestTeam);

    } else if (event.operation === "update") {
    } else if (event.operation === "delete") {
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }
}