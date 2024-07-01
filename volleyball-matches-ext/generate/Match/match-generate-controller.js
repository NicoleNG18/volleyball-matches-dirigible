const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    $scope.generateGoodsIssue = function () {
        const goodsIssueUrl = "/services/ts/volleyball-matches/gen/volleyball-matches/api/Matches/MatchService.ts/";

        $http.post(goodsIssueUrl, $scope.Match)
            .then(function (response) {
                console.log("Match created successfully:", response.data);
                $scope.closeDialog();
            })
            .catch(function (error) {
                console.error("Error creating Match:", error);

                $scope.closeDialog();
            });
    };

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("match-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);