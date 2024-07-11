import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";
import { TeamLeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamLeagueRepository";
import { LeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/League/LeagueRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();
    const TeamLeagueDao = new TeamLeagueRepository();
    const LeagueDao = new LeagueRepository();

    const matchId = event.key.value;
    const match = MatchDao.findById(matchId);

    let hostTeam = TeamDao.findById(match.Host);
    let guestTeam = TeamDao.findById(match.Guest);
    let league = LeagueDao.findById(match.League);

    const operation = event.operation;

    if (operation === "create") {

        let hostTeamLeague = TeamLeagueDao.findAll({
            $filter: {
                equals: {
                    Team: hostTeam.Id,
                    League: league.Id
                }
            }
        });

        let guestTeamLeague = TeamLeagueDao.findAll({
            $filter: {
                equals: {
                    Team: guestTeam.Id,
                    League: league.Id
                }
            }
        });

        hostTeamLeague[0].Points += match.PointsHost;
        guestTeamLeague[0].Points += match.PointsGuest;

        hostTeam.SumPoints += match.PointsHost;
        guestTeam.SumPoints += match.PointsGuest;

        TeamLeagueDao.update(hostTeamLeague[0]);
        TeamLeagueDao.update(guestTeamLeague[0]);

        TeamDao.update(guestTeam);
        TeamDao.update(hostTeam);

    }
    else if (event.operation === "update") {
    } else if (event.operation === "delete") {
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }
}