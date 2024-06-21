angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'volleyball-matches.League.Match';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsLeague = params.optionsLeague;
			$scope.optionsWinnerteam = params.optionsWinnerteam;
			$scope.optionsLostteam = params.optionsLostteam;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Set1) {
				filter.$filter.contains.Set1 = entity.Set1;
			}
			if (entity.Set2) {
				filter.$filter.contains.Set2 = entity.Set2;
			}
			if (entity.Set3) {
				filter.$filter.contains.Set3 = entity.Set3;
			}
			if (entity.Set4) {
				filter.$filter.contains.Set4 = entity.Set4;
			}
			if (entity.Set5) {
				filter.$filter.contains.Set5 = entity.Set5;
			}
			if (entity.League !== undefined) {
				filter.$filter.equals.League = entity.League;
			}
			if (entity.Winnerteam !== undefined) {
				filter.$filter.equals.Winnerteam = entity.Winnerteam;
			}
			if (entity.Lostteam !== undefined) {
				filter.$filter.equals.Lostteam = entity.Lostteam;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("Match-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);