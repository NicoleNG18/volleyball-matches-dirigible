const viewData = {
    id: "volleyball-ui-leagues",
    label: "League",
    lazyLoad: true,
    link: "/services/web/volleyball-matches/gen/volleyball-matches/ui/League/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}