import { MatchRepository as MatchDao } from "services/ts/volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository as TeamDao } from "services/ts/volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

export const trigger = (event) => {

    if (event.operation === "create") {
        const match = MatchDao.findById(event.entity.Match);

        let host = match.Host;
        let guest = match.Guest;

        host.Points += match.PointsHost;
        guest.Points += match.PoinstGuest;

        TeamDao.update(host);
        TeamDao.update(guest);

    } else if (event.operation === "update") {
        // TODO find by Item Id and update
    } else if (event.operation === "delete") {
        // TODO find by Item Id and mark as deleted
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }
}