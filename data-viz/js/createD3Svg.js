function createD3Svg(data){

  var y = d3.scale.linear().domain([0,1]).range([200, 0]);

  var x = d3.scale.linear()
      .domain([-10, d3.max(data, function(d, i){
      return d.happy + d.sad;
    })]).range([0,300]);

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
      .attr('width', 300)
      .attr('height', 200);
  
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.append('g')
      .attr('class', 'x axis')
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
      .attr('r', '5');
  
  
}