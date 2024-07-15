angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'volleyball-matches.Matches.Match';
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
			$scope.optionsGuest = params.optionsGuest;
			$scope.optionsHost = params.optionsHost;
			$scope.optionsSeason = params.optionsSeason;
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
			if (entity.League !== undefined) {
				filter.$filter.equals.League = entity.League;
			}
			if (entity.Guest !== undefined) {
				filter.$filter.equals.Guest = entity.Guest;
			}
			if (entity.Host !== undefined) {
				filter.$filter.equals.Host = entity.Host;
			}
			if (entity.Result) {
				filter.$filter.contains.Result = entity.Result;
			}
			if (entity.PointsGuest !== undefined) {
				filter.$filter.equals.PointsGuest = entity.PointsGuest;
			}
			if (entity.PointsHost !== undefined) {
				filter.$filter.equals.PointsHost = entity.PointsHost;
			}
			if (entity.Season !== undefined) {
				filter.$filter.equals.Season = entity.Season;
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