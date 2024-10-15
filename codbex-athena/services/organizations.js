const viewData = {
    id: "codbex-athena-organizations",
    label: "Organizations",
    lazyLoad: true,
    link: "/services/web/codbex-organizations/gen/codbex-organizations/ui/Organizations/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}