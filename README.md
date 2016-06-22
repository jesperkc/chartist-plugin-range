# Range plugin for Chartist.js

## Available options and their defaults

```javascript
var defaultOptions = {
  onRange : undefined  // A callback (chart) => void which will be called on range selection. 
};
```

## Sample usage in Chartist.js

    
```javascript
var chart = new Chartist.Line('.ct-chart', {
  series: [/* */]
}, {
  axisX : {
    type: Chartist.AutoScaleAxis,
  },
  plugins: [
    Chartist.plugins.range({
      onRange : function(chart) {  };
    })
  ]
});
```

```css
/* style the svg rect */
.ct-range-rect {
  fill: rgba(255, 255, 255, 0);
  stroke: transparent;
}
.ct-range-rect-left,
.ct-range-rect-right {
  fill: rgba(255, 255, 255, 0.8);
  stroke: #ffffff;
}
.ct-range-rect-left-line,
.ct-range-rect-right-line {
  stroke: rgba(0, 0, 0, 0.5);
}
.ct-range-rect-handle-left,
.ct-range-rect-handle-right {
  stroke: rgba(0, 0, 0, 0.5);
  fill: #fff;
}
```
