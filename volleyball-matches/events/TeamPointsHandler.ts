import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();
    const item = event.entity;
    const operation = event.operation;
    const match = MatchDao.findById(item.Match);

    console.log("Item " + item);
    console.log("Operation " + operation);
    console.log("Match " + match);

    if (operation === "create") {

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