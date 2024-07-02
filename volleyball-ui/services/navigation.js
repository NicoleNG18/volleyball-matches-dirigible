const perspectiveData = {
    id: "volleyball-ui-launchpad",
    name: "Volleybal matches",
    link: "../volleyball-ui/index.html",
    order: "0",
};

if (typeof exports !== 'undefined') {
    exports.getPerspective = function () {
        return perspectiveData;
    }
}