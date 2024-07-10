import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";
import { LeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/League/LeagueRepository";
import { TeamLeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamLeagueRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();
    const LeagueDao = new LeagueRepository();
    const TeamLeagueDao = new TeamLeagueRepository();

    const matchId = event.key.value;
    const match = MatchDao.findById(matchId);

    let hostTeam = TeamDao.findById(match.Host);
    let guestTeam = TeamDao.findById(match.Guest);

    const operation = event.operation;

    if (operation === "create") {

        let hostTeamLeague = TeamLeagueDao.findAll({
            $filter: {
                equals: {
                    Team: match.Host,
                    League: match.League
                }
            }
        });

        let guestTeamLeague = TeamLeagueDao.findAll({
            $filter: {
                equals: {
                    Team: match.Guest,
                    League: match.League
                }
            }
        });

        hostTeamLeague[0].Points += match.PointsHost;
        guestTeamLeague[0].Points += match.PointsGuest;

        hostTeam.SumPoints += match.PointsHost;
        guestTeam.SumPoints += match.PointsGuest;

        TeamLeagueDao.update(hostTeamLeague);
        TeamLeagueDao.update(guestTeamLeague);

        TeamDao.update(guestTeam);
        TeamDao.update(hostTeam);

    }
    else if (event.operation === "update") {
    } else if (event.operation === "delete") {
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }
}