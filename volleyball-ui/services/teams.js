const viewData = {
    id: "volleyball-ui-teams",
    label: "Teams",
    lazyLoad: true,
    link: "/services/web/volleyball-matches/gen/volleyball-matches/ui/Teams/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}