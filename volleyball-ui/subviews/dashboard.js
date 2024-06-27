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
        $scope.$apply(function () {
            $scope.vnlTeams = teamData.VnlTeams;
            $scope.olympicTeams = teamData.OlympicTeams;
            $scope.europeanTeams = teamData.EuropeanTeams;
            $scope.worldChampTeams = teamData.WorldChampTeams;
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


}]);