const viewData = {
    id: "codbex-athena-accounts",
    label: "Accounts",
    lazyLoad: true,
    link: "/services/web/codbex-accounts/gen/ui/Accounts/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}