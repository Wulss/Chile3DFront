import React, { Component } from "react";

import { ReactDOM } from "react";
import PropTypes from "prop-types";
import OlMap from "ol/map";
import OlView from "ol/view";
import OlLayerTile from "ol/layer/tile";
import OlSourceOSM from "ol/source/osm";
import OlDraw from "ol/interaction/draw";
import OlSourceVector from "ol/source/vector";
import OlLayerVector from "ol/layer/vector";
import OlStyle from "ol/style";
import OlProj from "ol/proj";
import { useEffect } from "react";


export function SearchMap() {
  return <Map></Map>;
}
var url = "http://127.0.0.1:8000"

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { center: [-412304.01680521877, 4926693.014295412], zoom: 12 };

    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM(),
        }),
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom,
      }),
    });

    this.source = new OlSourceVector({ wrapX: false });
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() {
    this.olmap.setTarget("map");

    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  userAction() {
    this.setState({ center: [-7000000, -4100000], zoom: 5 });
  }
  

  draw() {
    let draw = new OlDraw({
      source: this.source,
      type: "Polygon",
    });
    this.olmap.addInteraction(draw);
    draw.on("drawend", (e) => {
      var polygon = e.feature.getGeometry();
      var coords = polygon.getCoordinates();
      for (var i = 0; i < coords[0].length; i++) {
        coords[0][i] = OlProj.transform(coords[0][i], "EPSG:3857", "EPSG:4326");
      }
      var geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: coords,
            },
          },
        ],
      };
      geojson = JSON.stringify(geojson);
      
      
      var makeRequest = function () {
        fetch(
          "http://127.0.0.1:8000/geojson  ",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: geojson,
          }
        ).then((response) => {
          if (response.ok) {
            response.json().then((json) => {
              console.log(json);
              var archive = String(json["inside"][0]);
              console.log(archive);

              var archivo = {
                files: [archive],
              };
              var data = JSON.stringify(archivo);
              console.log(data);
              var downloadData = function () {
                fetch(
                  "http://127.0.0.1:8000/files",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                      "Accept": "*/*",
                      "Accept-Encoding": "gzip, deflate, br",
                      "Connection": "keep-alive",
                    }, 
                    body: 
                      data
                  ,
                  }
                ).then((response) => {
                  console.log("tengo respuestsa");
                  if(response.ok) {
                   response.json().then((json) => {
                      console.log("respuesta ok");
                    
                      console.log(json);
                   })
                  }
                });
              }
              downloadData();
            });
          }
        });
      };
      makeRequest();

      
      console.log(geojson);
    });
  }

  render() {
    return (
      <div id="map" style={{ width: "100%", height: "60vh" }}>
        <button onClick={(e) => this.userAction()}>goto Chile</button>
        <button onClick={(e) => this.draw()}>Draw</button>
      </div>
    );
  }
}

/* class Polygon extends Component {
  componentDidMount() {
  	const source = new OlSourceVector({wrapX: false});
    this.polygonBase = new OlLayerVector({ source });
    this.context.map.addLayer(this.polygonBase);
		
		const styleFunction = feature => {
      var geometry = feature.getGeometry();
      console.log('geometry', geometry.getType());
      if (geometry.getType() === 'LineString') {
        var styles = [
          new OlStyle.style({
            stroke: new OlStyle.Stroke({
              color: 'rgba(255, 102, 0, 1)',
              width: 3
            })
          })
        ];
        return styles;
      }
		
      if (geometry.getType() === 'Polygon') {
        var styles = [
          new OlStyle.Style({
            stroke: new OlStyle.Stroke({
              color: 'rgba(255, 102, 0, 0)',
              width: 20
            }),
            fill: new OlStyle.Fill({
              color: 'rgba(255, 102, 0, 0.3)'
            })
          })
        ];
        return styles;
      }
      return false;
    };
    
    // Define the polygon draw interaction
    this.draw = new OlDraw({
      source: source,
      type: 'Polygon',
			style: styleFunction,
        persist: true,
    });
    // Add the draw interaction
    this.context.map.addInteraction(this.draw);
		
  }

  

  render() { return <p>Drawing polygon</p>; }
} */
