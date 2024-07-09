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

    $http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/Teams/TeamService.ts").then(function (response) {
        $scope.optionsTeam = response.data.map(e => {
            return {
                value: e.Id,
                text: e.Name
            }
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

    $scope.optionsTeamValue = function (optionKey) {
        for (let i = 0; i < $scope.optionsTeam.length; i++) {
            if ($scope.optionsTeam[i].value === optionKey) {
                return $scope.optionsTeam[i].text;
            }
        }
        return null;
    };

    angular.element($document[0]).ready(async function () {
        const teamData = await getTeamData();
        $scope.$apply(function () {
            $scope.vnlTeams = teamData.VnlTeams;
            $scope.olympicTeams = teamData.OlympicTeams;
            $scope.europeanChampTeams = teamData.EuropeanChampTeams;
            $scope.worldChampTeams = teamData.WorldChampTeams;
            $scope.topFiveTeams = teamData.TopFiveTeams;
        })
    });



    $scope.displayByName = function () {
        angular.element($document[0]).ready(async function () {
            const playerData = await getPlayerData();
            $scope.$apply(function () {
                $scope.serbian = playerData.Serbian;
                $scope.french = playerData.French;
                $scope.brazilian = playerData.Brazilian;
                $scope.bulgarian = playerData.Bulgarian;
                $scope.slovenian = playerData.Slovenian;
                $scope.cuban = playerData.Cuban;
                $scope.canadian = playerData.Canadian;
                $scope.turkish = playerData.Turkish;
                $scope.american = playerData.American;
                $scope.polish = playerData.Polish;
                $scope.chineese = playerData.Chineese;
                $scope.dutch = playerData.Dutch;
            });
        });
    };

    $scope.displayByAge = function () {
        angular.element($document[0]).ready(async function () {
            const playerData = await getPlayerData();
            $scope.$apply(function () {
                $scope.serbian = playerData.Serbian.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.french = playerData.French.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.brazilian = playerData.Brazilian.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.bulgarian = playerData.Bulgarian.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.slovenian = playerData.Slovenian.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.cuban = playerData.Cuban.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.canadian = playerData.Canadian.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.turkish = playerData.Turkish.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.american = playerData.American.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.polish = playerData.Polish.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.chineese = playerData.Chineese.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
                $scope.dutch = playerData.Dutch.sort((a, b) => a.Age < b.Age ? -1 : a.Age > b.Age ? 1 : 0);
            });
        });
    };
}]);