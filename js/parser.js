function generateTree(array, level) {
    var array_root = [{
            "name": "Datos Abiertos",
            "link": "/data/datos-abiertos",
            "size": level,
            "children": generateChildrenTree(array, level)
    }];
    return array_root;
}
function generateChildrenTree(array, level) {
  var arr = [];

  for(var i=0; i < array.length; i++){
    arr.push(createDataSet(array[i], level+1));
  }
  return arr;
}

function createDataSet(datum, level) {
    var name = datum.titulo;
    var link = datum.url;
    var arrCh = [];
    if (datum.versiones.length != 0) {
        for(var i=0; i < datum.versiones.length; i++){
          arrCh.push(createVer(datum.versiones[i], level+1));
        }
        return {
            name: name,
            children: arrCh,
            size: level,
            link: link,
            data: datum
        };
    } else {
        return {name: fullName, size: level, link: link, data: datum};
    }
    return null;
}

function createVer(version, level) {
    var name = version.titulo;
    var link = version.url;
    var arrCh = [];
    if (version.recursos.length != 0) {
      for(var i=0; i < version.recursos.length; i++){
        arrCh.push(createRec(version.recursos[i], level+1));
      }
      return {
          name: name,
          children: arrCh,
          size: level,
          link: link,
          data: version
      };
    } else {
        return {name: name, size: level, link: link, data: version};
    }
    return null;
}

function createRec(resource, level) {
    var name = resource.titulo;
    var link = resource.url;
    var icon = resource.icon;
    return {name: name, size: level, icon: icon, link: link, data: resource};
}
