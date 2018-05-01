(function() {
  angular.module("RadarChart", [])
    .directive("radar", radar)
    .directive("onReadFile", onReadFile)
    .controller("MainCtrl", MainCtrl);

  // controller function MainCtrl
  function MainCtrl($http) {
    var ctrl = this;
    init();


    // function init
    function init() {
      // initialize controller variables
      ctrl.examples = [
        "1960",
        "1970",
        "1980",
        "1990",
        "2000",
        "2010"
      ];
      ctrl.exampleSelected = ctrl.examples[0];
      ctrl.getData = getData;
      ctrl.selectExample = selectExample;

      // initialize controller functions
      ctrl.selectExample(ctrl.exampleSelected);
      ctrl.config = {
        w: 250,
        h: 250,
        facet: false,
        levels: 5,
        levelScale: 0.85,
        labelScale: 0.7,
        facetPaddingScale: 2.1,
        showLevels: true,
        showLevelsLabels: false,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showVertices: true,
        showPolygons: true
      };
    }

    // function getData
    function getData($fileContent) {
      ctrl.csv = $fileContent;
    }

    // function selectExample
    function selectExample(item) {
      var file = item + ".csv";
      $http.get(file).success(function(data) {
        ctrl.csv = data;
      });
    }
  }

  // directive function sunburst
  function radar() {
    return {
      restrict: "E",
      scope: {
        csv: "=",
        config: "="
      },
      link: radarDraw
    };
  }


  // directive function onReadFile
  function onReadFile($parse) {
    return {
      restrict: "A",
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on("change", function(onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              fn(scope, {
                $fileContent: onLoadEvent.target.result
              });
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  }
})();