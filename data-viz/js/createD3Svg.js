var width = 600;
var height = 400;

function locHappyScatter(data){
  
  var dataInfo = d3.select('#data-info');

  var y = d3.scale.linear().domain([0,1])
      .range([height, 0]);

  var x = d3.scale.linear()
      .domain([-10, d3.max(data, function(d, i){
      return d.happy + d.sad;
    })]).range([0,width]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(5);
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5);

  var svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis);
  
  svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height - 6)
      .text('Feedback Quantity')  
  
  svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .text('% Happy Feedback')
  
  
  var points = svg.selectAll('circle')
      .data(data)
      .enter();
  
  points.append('circle')
      .attr('cx', function(d,i){
    return x(d.happy + d.sad);
  })
      .attr('cy', function(d,i){
    return y(d.happy / (d.happy + d.sad));
  })
      .attr('r', '5')
      .attr('title', function(d,i) {
    return d.loc})
      .on('mouseenter', function(d,i){
    dataInfo.text(d.loc);
  })
      .on('mouseout', function(d,i){
    dataInfo.text('')
  });
  
}


function versHappyBar(data){
  
  var dataInfo = d3.select('#data-info');
  
  var maxCount = d3.max(data, function(d){
    return d.happy + d.sad;
  })

  var y = d3.scale.linear().domain([0, maxCount])
      .range([height, 0]);

  var x = d3.scale.ordinal()
      .rangeRoundBands([0,width])
      .domain(data.sort(function(a, b){
      return d3.ascending(a.version, b.version);
    }).map(function(d){ return d.version }));

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5);

  var svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis);
    
  svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', width - 40)
      .attr('y', height + 40)
      .text('Firefox Version')  
  
  svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -40)
      .text('Feedback Quantity')

  
  var rects = svg.selectAll('rect')
      .data(data)
      .enter();
  
  rects.append('rect')
      .attr('x', function(d,i){
    return x(d.version);
  })
      .attr('y', function(d,i){
    return y(d.happy + d.sad);
  })
      .attr('height', function(d,i){
    return y(0) - y(d.happy + d.sad)
  })
      .attr('width', x.rangeBand())
      .attr('fill', function(d){
    var hue = 180 * d.happy / (d.happy + d.sad);
    return 'hsl(' + hue + ', 100%, 50%)';
  })
      .on('mouseenter', function(d,i){
    dataInfo.text('Version: ' + d.version + 
                  ', Feedback quantity: ' + (d.sad + d.happy) + 
                  ', ' + Math.round(100 * d.happy / (d.happy + d.sad)) + '% Positive');
  })
      .on('mouseout', function(d,i){
    dataInfo.text('')
  });
  
}