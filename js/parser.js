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
  return _.map(getChildrenData(array, parent), function (catData) {
          var catData = createDataSet(catData, level);
          return catData;
      }
  );
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
        children = $.merge(children, generateChildrenDataTree(arrayDatos, name, level+2));
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
          children: generateChildrenDataTree(arrayDatos, name, level+1)
        };
    }
    return null;
}


function createDataSet(datum, level) {
    var name = datum.titulo;
    var link = datum.url;
    var children = generateChildrenDataVersionTree(datum.versiones, level+1);
    return {
      name: name,
      size: level,
      link: link,
      data: datum,
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

function createDataSetVersion(dataset, level) {
    var name = dataset.titulo;
    var link = dataset.url;
    var children = generateChildrenDataVersionResourcesTree(dataset.recursos, level+1);
    return {
      name: name,
      size: level,
      link: link,
      data: dataset,
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

function createDataSetVersionResource(version, level) {
    var name = version.titulo;
    var link = version.url;
    return {
      name: name,
      size: level,
      link: link,
      data: version
    };
}
function getSubordinates(array, parent) {
    return _.filter(array, function(datum) {
      return datum.depende_de == parent;
    });
}
