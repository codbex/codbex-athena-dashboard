const viewData = {
    id: "codbex-athena-countries",
    label: "Countries",
    lazyLoad: true,
    link: "/services/web/codbex-countries/gen/codbex-countries/ui/Countries/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}