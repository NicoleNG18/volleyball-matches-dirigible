const viewData = {
    id: "volleyball-ui-coaches",
    label: "Coaches",
    lazyLoad: true,
    link: "	/volleyball-matches/gen/volleyball-matches/ui/Coaches/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}