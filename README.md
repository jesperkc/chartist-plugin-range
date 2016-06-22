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
/* selected rect */
.ct-range-rect {
  fill: rgba(255, 255, 255, 0);
  stroke: transparent;
}
/* outside rects on the left and right side of the selected range */
.ct-range-rect-left,
.ct-range-rect-right {
  fill: rgba(255, 255, 255, 0.8);
  stroke: #ffffff;
}
/* lines between selected rect and outside rects */
.ct-range-rect-left-line,
.ct-range-rect-right-line {
  stroke: rgba(0, 0, 0, 0.5);
}
/* handlebar styling */
.ct-range-rect-handle-left,
.ct-range-rect-handle-right {
  stroke: rgba(0, 0, 0, 0.5);
  fill: #fff;
}
```
