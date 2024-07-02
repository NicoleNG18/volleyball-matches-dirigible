const viewData = {
    id: "volleyball-ui-matches",
    label: "Matches",
    lazyLoad: true,
    link: "/services/web/volleyball-matches/gen/volleyball-matches/ui/Matches/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}