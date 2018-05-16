function generateTree(array, level) {
    var array_root = [{
            "name": "Datos Abiertos",
            "link": "/data/datos-abiertos",
            "size": level,
            "children": generateChildrenTree(array, "Datos Abiertos", level)
    }];
    return array_root;
}
function generateChildrenTree(array, parent, level) {
  array = _.each(array, function (catData) {
          if(catData.depende_de == null){
            catData.depende_de = "Datos Abiertos";
          }
      });
  return _.map(getSubordinates(array, parent), function (catData) {
          var children = generateChildrenTree(array, catData.nombre, level + 1);
          var catData = createDataSet(catData, children, level);
          return catData;
      }
  );
}


function createDataSet(datum, children, level) {
    var name = datum.nombre;
    var link = datum.url;
    if (children.length != 0) {
        return {
            name: name,
            children: children,
            size: level,
            link: link,
            data: datum
        };
    } else {
        return {name: name, size: level, link: link, data: datum};
    }
    return null;
}

function getSubordinates(array, parent) {
    return _.filter(array, function(datum) {
      return datum.depende_de == parent;
    });
}
