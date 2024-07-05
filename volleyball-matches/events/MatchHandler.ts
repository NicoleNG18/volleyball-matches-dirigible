import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const matchId = event.key.value;
    const operation = event.operation;

    if (operation === "create") {
        const match = MatchDao.findById(matchId);

        console.log(match);
    } else if (event.operation === "update") {
        // TODO find by Item Id and update
    } else if (event.operation === "delete") {
        // TODO find by Item Id and mark as deleted
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }
}