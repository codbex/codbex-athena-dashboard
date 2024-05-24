const perspectiveData = {
    id: "codbex-athena-launchpad",
    name: "Hestia",
    link: "../codbex-athena/index.html",
    order: "0",
    icon: "../codbex-athena/images/navigation.svg",
};

if (typeof exports !== 'undefined') {
    exports.getPerspective = function () {
        return perspectiveData;
    }
}