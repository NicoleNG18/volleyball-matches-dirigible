const dashboard = angular.module('dashboard', ['ideUI', 'ideView']);

dashboard.controller('DashboardController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    $scope.openPerspective = function (perspective) {
        if (perspective === 'Teams') {
            messageHub.postMessage('launchpad.switch.perspective', { perspectiveId: 'Teams' }, true);
        };
    }
    async function getPlayerData() {
        try {
            const response = await $http.get("/services/ts/volleyball-ui/api/PlayerService.ts/playerData");
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }


    async function getTeamData() {
        try {
            const response = await $http.get("/services/ts/volleyball-ui/api/TeamService.ts/teamData");
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    angular.element($document[0]).ready(async function () {
        const teamData = await getTeamData();
        const playerData = await getPlayerData();
        $scope.$apply(function () {
            $scope.vnlTeams = teamData.VnlTeams;
            $scope.olympicTeams = teamData.OlympicTeams;
            $scope.europeanTeams = teamData.EuropeanTeams;
            $scope.worldChampTeams = teamData.WorldChampTeams;
            $scope.serbia = playerData.Serbia;
            $scope.france = playerData.France;
            $scope.brazil = playerData.Brazil;
            $scope.bulgaria = playerData.Bulgaria;
            $scope.slovenia = playerData.Slovenia;
            $scope.cuba = playerData.Cuba;
            $scope.canada = playerData.Canada;
            $scope.turkey = playerData.Turkey;
            $scope.usa = playerData.USA;
            $scope.poland = playerData.Poland;
            $scope.china = playerData.China;
            $scope.netherlands = playerData.Netherlands;
        });
    });

    $http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/League/LeagueService.ts").then(function (response) {
        $scope.optionsLeague = response.data.map(e => {
            return {
                value: e.Id,
                text: e.Name
            }
        });
    });

    $scope.optionsLeagueValue = function (optionKey) {
        for (let i = 0; i < $scope.optionsLeague.length; i++) {
            if ($scope.optionsLeague[i].value === optionKey) {
                return $scope.optionsLeague[i].text;
            }
        }
        return null;
    };

    $http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/Teams/TeamService.ts").then(function (response) {
        $scope.optionsTeam = response.data.map(e => {
            return {
                value: e.Id,
                text: e.Name
            }
        });
    });

    $scope.optionsTeamValue = function (optionKey) {
        for (let i = 0; i < $scope.optionsTeam.length; i++) {
            if ($scope.optionsTeam[i].value === optionKey) {
                return $scope.optionsTeam[i].text;
            }
        }
        return null;
    };


}]);