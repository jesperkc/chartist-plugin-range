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
	fill: rgba(200, 100, 100, 0.3);
  stroke: red;
}
```
