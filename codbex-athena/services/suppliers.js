const viewData = {
    id: "codbex-athena-suppliers",
    label: "Suppliers",
    lazyLoad: true,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Suppliers/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}