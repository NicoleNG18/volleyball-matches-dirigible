angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'volleyball-matches.Teams.Team';
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
			if (entity.Name) {
				filter.$filter.contains.Name = entity.Name;
			}
			if (entity.League !== undefined) {
				filter.$filter.equals.League = entity.League;
			}
			if (entity.VNLpoints !== undefined) {
				filter.$filter.equals.VNLpoints = entity.VNLpoints;
			}
			if (entity.EuropeanChampPoints !== undefined) {
				filter.$filter.equals.EuropeanChampPoints = entity.EuropeanChampPoints;
			}
			if (entity.OlympicGamesPoints !== undefined) {
				filter.$filter.equals.OlympicGamesPoints = entity.OlympicGamesPoints;
			}
			if (entity.WorldChampPoints !== undefined) {
				filter.$filter.equals.WorldChampPoints = entity.WorldChampPoints;
			}
			if (entity.SumPoints !== undefined) {
				filter.$filter.equals.SumPoints = entity.SumPoints;
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
			messageHub.closeDialogWindow("Team-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);