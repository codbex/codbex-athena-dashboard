const dashboard = angular.module('dashboard', ['ideUI', 'ideView']);

dashboard.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'app';
}]);

dashboard.controller('DashboardController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    $http.get("/services/ts/codbex-athena/api/WidgetsExtension/WidgetService.ts")
        .then(function (response) {
            $scope.widgetList = response.data;

            $scope.widgetList.forEach(e => createWidget(e));
            $scope.state.isBusy = false;
        })
        .catch(function (error) {
            console.error('Error fetching widget list:', error);
            $scope.state.error = true;
            $scope.errorMessage = 'Failed to load widget list';
        });

    function createWidget(widgetData) {
        if (!widgetData || !widgetData.id || !widgetData.link) {
            console.error('Invalid widget data:', widgetData);
            return;
        }

        const widgetContainer = document.createElement('div');

        widgetContainer.onclick = () => {
            if (widgetData.redirectViewId) {
                console.log("swithcing to view :" + widgetData.redirectViewId)
                messageHub.postMessage('launchpad.switch.perspective', { viewId: widgetData.redirectViewId }, true);
            }
        }

        if (widgetData.size == "small") {
            widgetContainer.className = 'fd-col fd-col--6 fd-col-md--3 fd-col-lg--3 fd-col-xl--3';
        } else if (widgetData.size == "medium") {
            widgetContainer.className = 'fd-col fd-col--12 fd-col-md--6 fd-col-lg--6 fd-col-xl--6';
        } else { // large - TODO: needs to be made higher.
            widgetContainer.className = 'fd-col fd-col--12 fd-col-md--6 fd-col-lg--6 fd-col-xl--6';
        }

        const iframe = document.createElement('iframe');
        iframe.src = widgetData.link;
        iframe.title = widgetData.label;
        iframe.className = 'tile-auto-layout';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.style.display = 'block';
        // @ts-ignore
        iframe.loading = "lazy";

        // iframe.setAttribute('scrolling', 'no');
        // iframe.loading = widgetData.lazyLoad ? 'lazy' : 'eager'; 

        widgetContainer.appendChild(iframe);

        const widgetRow = document.querySelector('.fd-row');

        if (widgetRow) {
            widgetRow.appendChild(widgetContainer);
        } else {
            console.error('Widget container not found');
        }
    }



    messageHub.onDidReceiveMessage(
        "contextmenu",
        function (msg) {
            messageHub.postMessage('launchpad.switch.perspective', { viewId: msg.data }, true);
        }
    );
}]);