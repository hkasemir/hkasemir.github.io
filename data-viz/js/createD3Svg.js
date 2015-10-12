function locHappyScatter(data){
  
  var dataInfo = d3.select('#data-info');

  var y = d3.scale.linear().domain([0,1]).range([400, 0]);

  var x = d3.scale.linear()
      .domain([-10, d3.max(data, function(d, i){
      return d.happy + d.sad;
    })]).range([0,600]);

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
      .attr('width', 600)
      .attr('height', 400);
  
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + 400 + ')')
      .call(xAxis);
  
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

  var y = d3.scale.linear().domain([0,1]).range([400, 0]);

  var x = d3.scale.ordinal()
      .rangeRoundBands([0,600])
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
      .attr('width', 600)
      .attr('height', 400);
  
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + 400 + ')')
      .call(xAxis);
  
  var rects = svg.selectAll('rect')
      .data(data)
      .enter();
  var maxCount = d3.max(data, function(d){
    return d.happy + d.sad;
  })
  
  rects.append('rect')
      .attr('x', function(d,i){
    return x(d.version);
  })
      .attr('y', function(d,i){
    return y(0) - y(d.sad / (d.happy + d.sad));
  })
      .attr('height', function(d,i){
    return y(d.sad / (d.happy + d.sad))
  })
      .attr('width', x.rangeBand())
      .attr('fill', function(d){
//    var opacity = 0.05 + 0.95 * (d.happy + d.sad) / maxCount
    var hue = 180 + 95 * (d.happy + d.sad) / maxCount
    return 'hsl(' + hue + ', 100%, 50%)';
  })
      .on('mouseenter', function(d,i){
    dataInfo.text('Version: ' + d.version + ', Feedback quantity: ' + (d.sad + d.happy));
  })
      .on('mouseout', function(d,i){
    dataInfo.text('')
  });
  
}