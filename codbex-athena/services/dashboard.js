const viewData = {
    id: "codbex-athena-dashboard",
    label: "Dashboard",
    lazyLoad: true,
    link: "/services/web/codbex-athena/subviews/dashboard.html"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}