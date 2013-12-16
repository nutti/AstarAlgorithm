function drawGrid()
{
	var canvas = document.getElementById( 'aster' );
	var path = new Array();
	
	if( !canvas.getContext ){
		return;
	}
	
	initAster();
	if( calc() != 0 ){
		console.log( "Failed to find path." );
		return;
	}
	var n = result;
	while( 1 ){
		var p = nodes[ coord_to_index( n._coord ) ]._parent;
		if( p._x == -1 && p._y == -1 ){
			break;
		}
		n = nodes[ coord_to_index( p ) ];
		path.push( n );
		console.log( n );
	}
	
	var context = canvas.getContext( '2d' );
	var i = 0;
	var j = 0;
	
	context.strokeStyle = 'rgb(255,255,255)';
	context.fillStyle = 'rgb(0,0,0)';
	context.lineWidth = 10;
	
	for( i = 0; i < 11; ++i ){
		for( j = 0; j < 11; ++j ){
			var c = new Coord2D();
			c.set( i, j ); 
			if( path.indexOf( nodes[ coord_to_index( c ) ] ) != -1 ){
				context.fillStyle = 'rgb(255,255,0)';
			}
			else if( start._x == i && start._y == j ){
				context.fillStyle = 'rgb(255,0,0)';
			}
			else if( goal.getX() == i && goal.getY() == j ){
				context.fillStyle = 'rgb(0,0,255)';
			}
			else{
				context.fillStyle = 'rgb(0,0,0)';
			}
			context.strokeRect( i * 35, j * 35, 35, 35 );
			if( i != 11 && j != 11 ){
				context.fillRect( i * 35, j * 35, 35, 35 );
			}
		}
	}
}