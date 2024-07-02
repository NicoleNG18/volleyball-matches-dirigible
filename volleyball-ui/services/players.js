const viewData = {
    id: "volleyball-ui-players",
    label: "Players",
    lazyLoad: true,
    link: "/services/web/volleyball-matches/gen/volleyball-matches/ui/Players/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}