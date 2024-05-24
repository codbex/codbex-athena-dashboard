const viewData = {
    id: "codbex-athena-categories",
    label: "Categories",
    lazyLoad: true,
    link: "/services/web/codbex-products/gen/ui/Categories/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}