import { MatchRepository } from "volleyball-matches/gen/volleyball-matches/dao/Matches/MatchRepository";
import { TeamRepository } from "volleyball-matches/gen/volleyball-matches/dao/Teams/TeamRepository";
import { LeagueRepository } from "volleyball-matches/gen/volleyball-matches/dao/League/LeagueRepository";
import { TeamPointsRepository } from "volleyball-matches/gen/volleyball-matches/dao/entities/TeamPointsRepository";

export const trigger = (event) => {

    const MatchDao = new MatchRepository();
    const TeamDao = new TeamRepository();
    const LeagueDao = new LeagueRepository();
    const TeamPointsDao = new TeamPointsRepository();

    const matchId = event.key.value;
    const match = MatchDao.findById(matchId);

    let hostTeam = TeamDao.findById(match.Host);
    let hostTeamPoints = TeamPointsDao.findAll({
        $filter: {
            equals: {
                Team: hostTeam.Id
            }
        }
    });

    let guestTeam = TeamDao.findById(match.Guest);
    let guestTeamPoints = TeamPointsDao.findAll({
        $filter: {
            equals: {
                Team: guestTeam.Id
            }
        }
    });

    const league = LeagueDao.findById(match.League);

    const operation = event.operation;

    if (operation === "create") {

        hostTeam.Points += match.PointsHost;
        guestTeam.Points += match.PointsGuest;

        TeamDao.update(hostTeam);
        TeamDao.update(guestTeam);

        //add points to leagues
        if (league.Name === "VNL") {

            hostTeamPoints[0].VNL += match.PointsHost;
            guestTeamPoints[0].VNL += match.PointsGuest;

            console.log(hostTeamPoints[0].VNL);
            console.log("guest" + guestTeamPoints[0].VNL);

            TeamPointsDao.update(hostTeamPoints[0]);
            TeamPointsDao.update(guestTeamPoints[0]);

            console.log(hostTeamPoints[0].VNL);
            console.log("guest" + guestTeamPoints[0].VNL);

        } else if (league.Name === "Olympic Games") {

            hostTeamPoints[0].OlympicGames += match.PointsHost;
            guestTeamPoints[0].OlympicGames += match.PointsGuest;

            TeamPointsDao.update(hostTeamPoints[0]);
            TeamPointsDao.update(guestTeamPoints[0]);

        } else if (league.Name === "European Championship") {

            hostTeamPoints[0].EuropeanChamp += match.PointsHost;
            guestTeamPoints[0].EuropeanChamp += match.PointsGuest;

            TeamPointsDao.update(hostTeamPoints[0]);
            TeamPointsDao.update(guestTeamPoints[0]);

        } else if (league.Name === "World Championship") {

            hostTeamPoints[0].WorldChamp += match.PointsHost;
            guestTeamPoints[0].WorldChamp += match.PointsGuest;

            TeamPointsDao.update(hostTeamPoints[0]);
            TeamPointsDao.update(guestTeamPoints[0]);

        }



    } else if (event.operation === "update") {
    } else if (event.operation === "delete") {
    } else {
        throw new Error("Unknown operation: " + event.operation);
    }

}