const viewData = {
    id: "codbex-athena-customer-payments",
    label: "Customer Payments",
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/ui/CustomerPayment/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}