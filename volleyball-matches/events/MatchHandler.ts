import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";
import { LeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/League/LeagueRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();
    const LeagueDao = new LeagueRepository();

    const matchId = event.key.value;
    const match = MatchDao.findById(matchId);

    let hostTeam = TeamDao.findById(match.Host);
    let guestTeam = TeamDao.findById(match.Guest);

    const league = LeagueDao.findById(match.League);

    const operation = event.operation;

    if (operation === "create") {

        //add points to leagues
        if (league.Name === "VNL") {

            hostTeam.VNLpoints += match.PointsHost;
            guestTeam.VNLpoints += match.PointsGuest;

        } else if (league.Name === "Olympic Games") {

            hostTeam.OlympicGamesPoints += match.PointsHost;
            guestTeam.OlympicGamesPoints += match.PointsGuest;

        } else if (league.Name === "European Championship") {

            hostTeam.EuropeanChampPoints += match.PointsHost;
            guestTeam.EuropeanChampPoints += match.PointsGuest;

        } else if (league.Name === "World Championship") {

            hostTeam.WorldChampPoints += match.PointsHost;
            guestTeam.WorldChampPoints += match.PointsGuest;

        }

        TeamDao.update(hostTeam);
        TeamDao.update(guestTeam);

    } else if (event.operation === "update") {
    } else if (event.operation === "delete") {
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }

}