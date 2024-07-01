const viewData = {
    id: 'match-generate',
    label: 'Generate Match',
    link: '/services/web/volleyball-matches-ext/generate/Match/match-generate.html',
    perspective: 'Matches',
    view: 'match',
    type: 'entity',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}