const dashboard = angular.module('dashboard', ['ideUI', 'ideView', "applicationTiles"]);

dashboard.controller('DashboardController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    angular.element($document[0]).ready(async function () {

        $scope.$apply(function () {
            $scope.state.isBusy = false;
        });
    });

    $scope.openPerspective = function (perspective) {
        messageHub.postMessage('launchpad.switch.perspective', { perspectiveId: 'sales-invoices' }, true);
    }

    $scope.today = new Date();

    const invoiceServiceUrl = "/services/ts/codbex-athena/api/InvoiceService.ts/invoiceData";
    $http.get(invoiceServiceUrl)
        .then(function (response) {
            $scope.InvoiceData = response.data;
            calculateGrossProfit();
        });

    async function getProductData() {
        try {
            const response = await $http.get("/services/ts/codbex-athena/api/ProductService.ts/productData");
            return response.data;
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    function calculateGrossProfit() {
        if ($scope.InvoiceData && $scope.OrderData) {
            $scope.GrossProfit = (($scope.InvoiceData.SalesInvoiceTotal + $scope.OrderData.SalesOrderTotal) - ($scope.InvoiceData.PurchaseInvoiceTotal + $scope.OrderData.PurchaseOrderTotal)).toFixed(2);
        }
    }

}]);