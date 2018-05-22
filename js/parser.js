
$(document).ready(function() {

  var spinner;
  function startSpinner(elementId) {
      var opts = {
          lines: 9, // The number of lines to draw
          length: 9, // The length of each line
          width: 5, // The line thickness
          radius: 14, // The radius of the inner circle
          color: '#00a650', // #rgb or #rrggbb or array of colors
          speed: 1.9, // Rounds per second
          trail: 40, // Afterglow percentage
          className: 'spinner' // The CSS class to assign to the spinner
      };
      var target = document.getElementById(elementId);
      spinner = new Spinner(opts).spin(target);
  }

  function stopSpinner(elementId) {
      spinner.stop();
  }

  startSpinner("vis");
  var today = new Date().toLocaleDateString();
    var cats;
    var datos;
    if (localStorage.datosData == null || localStorage.datosData == "null" || localStorage.datosData == "undefined" || localStorage.userDate != today ) {
      $.getJSON("https://gobiernoabierto.cordoba.gob.ar/api/categorias-datos-abiertos/?page_size=100", function(dataJSON) {
        cats = dataJSON;
        localStorage.datosData = JSON.stringify(cats);
        getData();
      });
    } else {
        cats = JSON.parse(localStorage.datosData);
        getData();
    }

    function getData(){
      if (localStorage.graphDatosData == null || localStorage.graphDatosData == "null" || localStorage.graphDatosData == "undefined" || localStorage.userDate != today ) {
        $.getJSON("https://gobiernoabierto.cordoba.gob.ar/api/datos-abiertos/?page_size=600", function(dataJSON) {
          datos = dataJSON.results;
          localStorage.graphDatosData = JSON.stringify(datos);
          graph();
        });
      } else {
          datos = JSON.parse(localStorage.graphDatosData);
          graph();
      }
    }

    function graph(){
      stopSpinner('vis');
      var results = generateTree(cats.results, datos, 1)[0];

      var cluster = d3.select("#vis").append("svg")

        .chart("cluster.radial")

        .radius(function(d) { if( d.size ) return 30/d.size; else return 3; })
        .levelGap(200)
        .zoomable([0.1, 3])
        .collapsible(1)
        .colors(d3.scale.category10())

        //.duration(200)
        ;
      console.log(results);
      cluster.draw(results);
    }
    function generateTree(array, arrayDatos, level) {
        var array_root = [{
                "name": "Datos Abiertos",
                "link": "/data/datos-abiertos",
                "size": level,
                "children": generateChildrenTree(array,arrayDatos, "Datos Abiertos", level)
        }];
        return array_root;
    }
    function generateChildrenTree(array, arrayDatos, parent, level) {
      array = _.each(array, function (catData) {
              if(catData.depende_de == null){
                catData.depende_de = "Datos Abiertos";
              }
          });
      return _.map(getSubordinates(array, parent), function (catData) {
              var children = generateChildrenTree(array, arrayDatos, catData.nombre, level + 1);
              var catData = createCatDataSet(catData, arrayDatos, children, level);
              return catData;
          }
      );
    }


    function generateChildrenDataTree(array, parent, level) {
      if(parent.nombre.toLowerCase() != "declaraciones juradas de funcionarios"){
        return _.map(getChildrenData(array, parent.nombre), function (catData) {
              var catData = createDataSet(catData, level);
              return catData;
        });
      }else{
            var auxA = [];
            var aux ={};
            var tot = _.map(getChildrenData(array, parent.nombre), function (catData) {
                  var catData = createDataSet(catData, level);
                  return catData;
            });
            aux["titulo"]="Existen "+ tot.length+" datos";
            aux["icon"]="multiple";
            aux["url"] = "/data/datos-abiertos/categoria/declaraciones-juradas-de-funcionarios";
            auxA[0]=aux;
        return _.map(auxA, function (catData) {
              var catData = createDataSetVersionResource(catData, level);
              return catData;
        });
      }
    }

    function getChildrenData(arrayDatos, cat) {
        return _.filter(arrayDatos, function(datum) {
          return datum.categoria.nombre == cat;
        });
    }

    function createCatDataSet(datum, arrayDatos, children, level) {
        var name = datum.nombre;
        var link = datum.url;

        if (children.length != 0) {
            children = $.merge(children, generateChildrenDataTree(arrayDatos, datum, level+2));
            return {
                name: name,
                children: children,
                size: level,
                link: link,
                data: datum
            };
        } else {
            return {
              name: name,
              size: level,
              link: link,
              data: datum,
              children: generateChildrenDataTree(arrayDatos, datum, level+1)
            };
        }
        return null;
    }


    function createDataSet(dataset, level) {
        var name = dataset.titulo;
        var link = dataset.url;
        var children = generateChildrenDataVersionTree(dataset.versiones, level+1);
        return {
          name: name,
          size: level,
          link: link,
          data: dataset,
          children: children
        };
    }

    function generateChildrenDataVersionTree(array, level) {
      return _.map(array, function (datumVersion) {
              var catData = createDataSetVersion(datumVersion, level);
              return catData;
          }
      );
    }

    function createDataSetVersion(version, level) {
        var name = version.titulo;
        var link = version.url;
        var children = generateChildrenDataVersionResourcesTree(version.recursos, level+1);
        return {
          name: name,
          size: level,
          link: link,
          data: version,
          children: children
        };
    }

    function generateChildrenDataVersionResourcesTree(array, level) {
      return _.map(array, function (datumResource) {
              var datumResource = createDataSetVersionResource(datumResource, level);
              return datumResource;
          }
      );
    }

    function createDataSetVersionResource(recurso, level) {
        var name = recurso.titulo;
        var link = recurso.url;
        var tipo = recurso.icon;
        return {
          name: name,
          size: level,
          link: link,
          icon: tipo,
          data: recurso
        };
    }

    function getSubordinates(array, parent) {
        return _.filter(array, function(datum) {
          return datum.depende_de == parent;
        });
    }

});
