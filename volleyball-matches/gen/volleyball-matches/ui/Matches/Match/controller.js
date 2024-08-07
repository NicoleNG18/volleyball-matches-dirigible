angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'volleyball-matches.Matches.Match';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/volleyball-matches/gen/volleyball-matches/api/Matches/MatchService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'volleyball-matches-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Matches" && e.view === "Match" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Matches" && e.view === "Match" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Match", `Unable to count Match: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Match", `Unable to list/filter Match: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Match-details", {
				action: "select",
				entity: entity,
				optionsLeague: $scope.optionsLeague,
				optionsGuest: $scope.optionsGuest,
				optionsHost: $scope.optionsHost,
				optionsSeason: $scope.optionsSeason,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Match-filter", {
				entity: $scope.filterEntity,
				optionsLeague: $scope.optionsLeague,
				optionsGuest: $scope.optionsGuest,
				optionsHost: $scope.optionsHost,
				optionsSeason: $scope.optionsSeason,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Match-details", {
				action: "create",
				entity: {},
				optionsLeague: $scope.optionsLeague,
				optionsGuest: $scope.optionsGuest,
				optionsHost: $scope.optionsHost,
				optionsSeason: $scope.optionsSeason,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Match-details", {
				action: "update",
				entity: entity,
				optionsLeague: $scope.optionsLeague,
				optionsGuest: $scope.optionsGuest,
				optionsHost: $scope.optionsHost,
				optionsSeason: $scope.optionsSeason,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Match?',
				`Are you sure you want to delete Match? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Match", `Unable to delete Match: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsLeague = [];
		$scope.optionsGuest = [];
		$scope.optionsHost = [];
		$scope.optionsSeason = [];


		$http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/League/LeagueService.ts").then(function (response) {
			$scope.optionsLeague = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/Teams/TeamService.ts").then(function (response) {
			$scope.optionsGuest = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/Teams/TeamService.ts").then(function (response) {
			$scope.optionsHost = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/volleyball-matches/gen/volleyball-matches/api/Season/SeasonService.ts").then(function (response) {
			$scope.optionsSeason = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Year
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
		$scope.optionsGuestValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsGuest.length; i++) {
				if ($scope.optionsGuest[i].value === optionKey) {
					return $scope.optionsGuest[i].text;
				}
			}
			return null;
		};
		$scope.optionsHostValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsHost.length; i++) {
				if ($scope.optionsHost[i].value === optionKey) {
					return $scope.optionsHost[i].text;
				}
			}
			return null;
		};
		$scope.optionsSeasonValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSeason.length; i++) {
				if ($scope.optionsSeason[i].value === optionKey) {
					return $scope.optionsSeason[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
