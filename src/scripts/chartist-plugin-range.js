/**
 * Chartist.js range plugin.
 *
 */
(function (window, document, Chartist) {
  'use strict';

  var defaultOptions = {
    // onRange
  };


  Chartist.plugins = Chartist.plugins || {};
  Chartist.plugins.range = function (options) {

    options = Chartist.extend({}, defaultOptions, options);

    return function range(chart) {

      if (!(chart instanceof Chartist.Line)) {
        return;
      }

      var rect, svg, axisX, axisY, chartRect;
      var downPosition;
      var onRange = options.onRange;
      var ongoingTouches = [];
      
      chart.on('draw', function (data) {
        var type = data.type;
        if (type === 'line' || type === 'bar' || type === 'area' || type === 'point') {
          data.element.attr({
            'clip-path': 'url(#range-mask)'
          });
        }
      });

      chart.on('created', function (data) {
        axisX = data.axisX;
        axisY = data.axisY;
        chartRect = data.chartRect;
        svg = data.svg._node;
        rect = data.svg.elem('g', {}, 'ct-range-rect');
        var rectBox = data.svg.elem('rect', {width: '100', height: '100', x:0, y:0}, 'ct-range-rect-box');
        rect.append(rectBox);
        
        
        var rectLeft = data.svg.elem('rect', {width: '100', height: '100', x:0, y:0}, 'ct-range-rect-left');
        var rectRight = data.svg.elem('rect', {width: '100', height: '100', x:0, y:0}, 'ct-range-rect-right');
        
        rect.append(rectLeft);
        rect.append(rectRight);
        
        var rectHandleLeft = data.svg.elem('path', {d: 'M-0.5,86.66666666666667A6,6 0 0 0 -6.5,92.66666666666667V167.33333333333334A6,6 0 0 0 -0.5,173.33333333333334ZM-2.5,94.66666666666667V165.33333333333334M-4.5,94.66666666666667V165.33333333333334'}, 'ct-range-rect-handle-left');
        var rectHandleRight = data.svg.elem('path', {d: 'M0.5,86.66666666666667A6,6 0 0 1 6.5,92.66666666666667V167.33333333333334A6,6 0 0 1 0.5,173.33333333333334ZM2.5,94.66666666666667V165.33333333333334M4.5,94.66666666666667V165.33333333333334'}, 'ct-range-rect-handle-right');
        rect.append(rectHandleLeft);
        rect.append(rectHandleRight);
        
        var rectLineLeft = data.svg.elem('line', {height: '100', x:0, y:0}, 'ct-range-rect-left-line');
        var rectLineRight = data.svg.elem('line', {height: '100', x:0, y:0}, 'ct-range-rect-right-line');
        
        rect.append(rectLineLeft);
        rect.append(rectLineRight);
        
        hide(rect);
        
        var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
        var width = chartRect.width();
        var height = chartRect.height();
        
        defs
          .elem('clipPath', {
            id: 'range-mask'
          })
          .elem('rect', {
            x: chartRect.x1,
            y: chartRect.y2,
            width: width,
            height: height,
            fill: 'white'
          });

        svg.addEventListener('mousedown', onMouseDown);
        svg.addEventListener('mouseup', onMouseUp);
        svg.addEventListener('mousemove', onMouseMove);
        svg.addEventListener('touchstart', onTouchStart);
        svg.addEventListener('touchmove', onTouchMove);
        svg.addEventListener('touchend', onTouchEnd);
        svg.addEventListener('touchcancel', onTouchCancel);
      });

      function copyTouch(touch) {
        var p = position(touch, svg);
        p.id = touch.identifier; 
        return p;
      }

      function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
          var id = ongoingTouches[i].id;
          if (id === idToFind) {
            return i;
          }
        }
        return -1;
      }

      function onTouchStart(event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
          ongoingTouches.push(copyTouch(touches[i]));
        }        
      
        if (ongoingTouches.length > 1) {
          //rectBox.attr(getRect(ongoingTouches[0], ongoingTouches[1]));
          show(rect);
        }
      }
      
      function onTouchMove(event) {
        var touches = event.changedTouches;        
        for (var i = 0; i < touches.length; i++) {
          var idx = ongoingTouchIndexById(touches[i].identifier);
          ongoingTouches.splice(idx, 1, copyTouch(touches[i]));
        }
        
        if (ongoingTouches.length > 1) {
          //rectBox.attr(getRect(ongoingTouches[0], ongoingTouches[1]));
          show(rect);
          event.preventDefault();
        }
      }
      
      function onTouchCancel(event) {
        removeTouches(event.changedTouches);
      }
      
      function removeTouches(touches) {
        for (var i = 0; i < touches.length; i++) {
          var idx = ongoingTouchIndexById(touches[i].identifier);
          if (idx >= 0) {
            ongoingTouches.splice(idx, 1);
          } 
        }
      }
      
      function onTouchEnd(event) {
        if (ongoingTouches.length > 1) {
          rangeIn(getRect(ongoingTouches[0], ongoingTouches[1]));
        }
        removeTouches(event.changedTouches);
        hide(rect);
      }
      
      function onMouseDown(event) {
        hide(rect);
        if (event.button === 0) {
          downPosition = position(event, svg);
          downPosition.y = 0;
          var rectAttr = getRect(downPosition, downPosition);
          
          transformRect(rectAttr, rect, chartRect);
          event.preventDefault();
        }
      }

      var reset = function () {
        chart.options.selectedRange = null;
        onRange && onRange(chart);
      };

      function onMouseUp(event) {
        if (event.button === 0 && downPosition) {
          var box = getRect(downPosition, position(event, svg));
          rangeIn(box);          
          downPosition = null;
          //hide(rect);
          event.preventDefault();
        }
        else if (options.resetOnRightMouseBtn && event.button === 2) {
          reset();
          event.preventDefault();
        }
      }
      
      function rangeIn(rect) {
        if (rect.width > 5 && rect.height > 5) {
            var x1 = rect.x - chartRect.x1;
            var x2 = x1 + rect.width;

            chart.options.selectedRange = { low: project(x1, axisX), high: project(x2, axisX) };
            
            //chart.update(chart.data, chart.options);
            onRange && onRange(chart);
          }else{
            reset();
          }
      }

      function onMouseMove(event) {
        if (downPosition) {
          var point = position(event, svg);
          var rectAttr = getRect(downPosition, point);
          transformRect(rectAttr, rect, chartRect);
          if (rect.width() > 5) {
            show(rect);
          }
          event.preventDefault();
        }
      }
    };

  };

  function hide(rect) {
    rect.attr({ style: 'display:none' });
  }

  function show(rect) {
    rect.attr({ style: 'display:block' });
  }
  
  function transformRect(rectAttr, rect, chartRect){
      rectAttr.y = chartRect.y2;
      rectAttr.height = chartRect.height();
      rect.querySelectorAll('.ct-range-rect-box').attr(rectAttr);
      var handle_y = ((((rectAttr.height)-86)/2)-86) + chartRect.y2;
      rect.querySelectorAll('.ct-range-rect-handle-left').attr({'style':'transform:translate('+ (rectAttr.x > chartRect.x1 ? rectAttr.x : chartRect.x1)+'px, '+ handle_y +'px)'});
      rect.querySelectorAll('.ct-range-rect-handle-right').attr({'style':'transform:translate('+(rectAttr.x + rectAttr.width)+'px, '+ handle_y +'px)'});
      
      var rectLeftAttr = {
        x: rectAttr.x,
        y: chartRect.y2,
        width: rectAttr.width,
        height: rectAttr.height,
    };
    rectLeftAttr.width = rectAttr.x - chartRect.x1 > 0 ? rectAttr.x - chartRect.x1 : 0;
    rectLeftAttr.x = chartRect.x1;
    rect.querySelectorAll('.ct-range-rect-left').attr(rectLeftAttr);
    
    
    rect.querySelectorAll('.ct-range-rect-left-line').attr({
        x1: rectLeftAttr.x + rectLeftAttr.width,
        x2: rectLeftAttr.x + rectLeftAttr.width,
        y1: rectLeftAttr.y,
        y2: rectLeftAttr.y + rectLeftAttr.height
    });
    
    var rectRightAttr = {
        x: rectAttr.x,
        y: chartRect.y2,
        width: rectAttr.width,
        height: rectAttr.height,
    };
    rectRightAttr.x = rectAttr.x + rectAttr.width;
    rectRightAttr.width = chartRect.x2 - (rectAttr.x + rectAttr.width) > 0 ? chartRect.x2 - (rectAttr.x + rectAttr.width) : 0;
    rect.querySelectorAll('.ct-range-rect-right').attr(rectRightAttr);
    
    
    rect.querySelectorAll('.ct-range-rect-right-line').attr({
        x1: rectRightAttr.x,
        x2: rectRightAttr.x,
        y1: rectRightAttr.y,
        y2: rectRightAttr.y + rectRightAttr.height
    });
    
    
    
  }
  
  function getRect(firstPoint, secondPoint) {
    var x = firstPoint.x;
    var y = firstPoint.y;
    var width = secondPoint.x - x;
    var height = secondPoint.y - y;
    if (width < 0) {
      width = -width;
      x = secondPoint.x;
    }
    if (height < 0) {
      height = -height;
      y = secondPoint.y;
    }
    y = 50;//this.options.chartPadding.top;
    height = 370;
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  function position(event, svg) {
    return transform(event.clientX, event.clientY, svg);
  }

  function transform(x, y, svgElement) {
    var svg = svgElement.tagName === 'svg' ? svgElement : svgElement.ownerSVGElement;
    var matrix = svg.getScreenCTM();
    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    point = point.matrixTransform(matrix.inverse());
    return point || { x: 0, y: 0 };
  }

  function project(value, axis) {
      if (axis.bounds){
    var max = axis.bounds.max;
    var min = axis.bounds.min;
    if (axis.scale && axis.scale.type === 'log') {
      var base = axis.scale.base;
      return Math.pow(base,
        value * baseLog(max / min, base) / axis.axisLength) * min;
    }
    return (value * axis.bounds.range / axis.axisLength) + min;
    }else{
        
        //var unix_day = 86400000;
        var pct = (value / axis.stepLength) - Math.floor(value / axis.stepLength);
        
        var start_tick = Math.floor(value / axis.stepLength);
        var start_date = Number(new Date(axis.ticks[start_tick]));
        var end_tick = start_tick + 1;
        if (end_tick < axis.ticks.length){
            var end_date = Number(new Date(axis.ticks[Math.floor(value / axis.stepLength) + 1])); 
            var date_pct = start_date + ((end_date - start_date) * pct);
            return new Date(date_pct); //axis.ticks[tick];
        }else{
            return new Date(start_date);            
        }
    }
  }

  function baseLog(val, base) {
    return Math.log(val) / Math.log(base);
  }

} (window, document, Chartist));