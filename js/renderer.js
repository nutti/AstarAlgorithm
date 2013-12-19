var path = new Array();

// path finding
function calcPath()
{
	// initialize
	initAster();
	// start path finding
	if( findPath() != 0 ){
		console.log( "Failed to find path." );
		return;
	}
	// get result
	var n = result;
	while( 1 ){
		var p = nodes[ coord_to_index( n._coord ) ]._parent;
		if( p._x == -1 && p._y == -1 ){
			break;		// this is start node
		}
		n = nodes[ coord_to_index( p ) ];
		path.push( n );
		console.log( n );
	}
}

function drawGrid()
{
	var canvas = document.getElementById( 'aster' );
	if( !canvas.getContext ){
		return;
	}
	
	calcPath();
	
	var context = canvas.getContext( '2d' );
	var i = 0;
	var j = 0;
	
	context.strokeStyle = 'rgb(255,255,255)';
	context.fillStyle = 'rgb(0,0,0)';
	context.lineWidth = 10;
	
	for( i = 0; i < MAX_X; ++i ){
		for( j = 0; j < MAX_Y; ++j ){
			var c = new Coord2D();
			c.set( i, j ); 
			if( path.indexOf( nodes[ coord_to_index( c ) ] ) != -1 ){
				context.fillStyle = 'rgb(255,255,0)';
			}
			else if( start._x == i && start._y == j ){
				context.fillStyle = 'rgb(255,0,0)';
			}
			else if( goal._x == i && goal._y == j ){
				context.fillStyle = 'rgb(0,0,255)';
			}
			else{
				context.fillStyle = 'rgb(0,0,0)';
			}
			context.strokeRect( i * 35, j * 35, 35, 35 );
			if( i != MAX_X && j != MAX_Y ){
				context.fillRect( i * 35, j * 35, 35, 35 );
			}
		}
	}
}