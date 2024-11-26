const perspectiveData = {
    id: "launchpad",
    name: "Athena",
    link: "../index.html",
    order: 0,
    icon: "../images/navigation.svg",
};

if (typeof exports !== 'undefined') {
    exports.getPerspective = function () {
        return perspectiveData;
    }
}
