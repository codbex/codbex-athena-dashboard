const viewData = {
    id: "codbex-athena-dimensions",
    label: "Dimensions",
    lazyLoad: true,
    link: "/services/web/codbex-uoms/gen/codbex-uoms/ui/Dimensions/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}