import TileLayer from "ol/layer/Tile"
import TileArcGISRest from 'ol/source/TileArcGISRest'


let maptype=2          

var streetmap=function(){
    var maplayer=new TileLayer({
                source:new TileArcGISRest({
                    url:'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
                })
    })
    return [maplayer];
}

var mapconfig={
    x:114,     //中心点经度和纬度
    y:22,
    zoom:10,          //地图缩放级别
    streetmap:streetmap
};

export default mapconfig

