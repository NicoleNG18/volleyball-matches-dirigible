const viewData = {
    id: "volleyball-ui-dashboard",
    label: "Dashboard",
    lazyLoad: true,
    link: "/services/web/volleyball-ui/subviews/dashboard.html"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}