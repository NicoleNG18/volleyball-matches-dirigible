angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'volleyball-matches.entities.Match';
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
			if (entity.Set_1) {
				filter.$filter.contains.Set_1 = entity.Set_1;
			}
			if (entity.Set2) {
				filter.$filter.contains.Set2 = entity.Set2;
			}
			if (entity.Set_3) {
				filter.$filter.contains.Set_3 = entity.Set_3;
			}
			if (entity.Set_4) {
				filter.$filter.contains.Set_4 = entity.Set_4;
			}
			if (entity.Set_5) {
				filter.$filter.contains.Set_5 = entity.Set_5;
			}
			if (entity.League !== undefined) {
				filter.$filter.equals.League = entity.League;
			}
			if (entity.Winner_team !== undefined) {
				filter.$filter.equals.Winner_team = entity.Winner_team;
			}
			if (entity.Lost_team !== undefined) {
				filter.$filter.equals.Lost_team = entity.Lost_team;
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