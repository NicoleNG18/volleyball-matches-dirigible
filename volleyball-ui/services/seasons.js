const viewData = {
    id: "volleyball-ui-seasons",
    label: "Season",
    lazyLoad: true,
    link: "/services/web/volleyball-matches/gen/volleyball-matches/ui/Season/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}