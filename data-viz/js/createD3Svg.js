function createD3Svg(data){
  console.log (d3.max(data, function(d, i){
    return d.happy + d.sad;
  }))
}