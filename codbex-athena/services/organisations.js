const viewData = {
    id: "codbex-athena-organisations",
    label: "Organisations",
    lazyLoad: true,
    link: "/services/web/codbex-employees/gen/ui/Organisations/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}