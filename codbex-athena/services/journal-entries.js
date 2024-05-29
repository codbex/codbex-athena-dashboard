const viewData = {
    id: "codbex-athena-journal-entries",
    label: "Journal Entry",
    lazyLoad: true,
    link: "/services/web/codbex-accounts/gen/ui/JournalEntry/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}