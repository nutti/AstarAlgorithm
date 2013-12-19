// heuristics map
var heuristics = [
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 3, 7, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 8, 0, 0, 9, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];


var MAX_X = 20;		// maximum X
var MAX_Y = 20;		// maximum Y

var nodes;			// node list
var openList;		// open list
var closeList;		// close list
var goal;			// goal node
var start;			// start node

var result;			// final node


// coordinate 2D
var Coord2D = (function(){

	var obj = function(){};
	
	obj.prototype = {
		_x : 0,
		_y : 0,
		set : function( x, y ){
			this._x = x;
			this._y = y;
		},
		equal : function( rhs ){
			return ( this._x == rhs._x ) && ( this._y == rhs._y );
		}
	};
	
	return obj;
})();

// node
var Node = (function(){
	
	var obj = function(){};
	
	obj.prototype = {
		_id : 0,			// 0:normal, 1:start, 2:end
		_coord : 0,			// coordinate
		_h : 0,				// heuristics
		_f : 0,				// costs
		_parent : 0			// parent coordinate
	};
	
	return obj;
})();

// calculate distance. argument type is Coord2D object
function distance( c1, c2 )
{
	var dx = Math.abs( c1._x - c2._x );
	var dy = Math.abs( c1._y - c2._y );
	var d = ( ( dx < dy ) ? dx : dy ) / 2;
	
	return dx + dy -d;
}

// transform Coord2D to index of nodes
function coord_to_index( c )
{
	return c._x + c._y * MAX_X;
}

// initialize
function initAster()
{
	start = new Coord2D();
	start.set( 2, 2 );
	goal = new Coord2D();
	goal.set( 9, 7 );
	
	nodes = new Array();
	var i = 0;
	var j = 0;
	for( i = 0; i < MAX_Y; ++i ){
		for( j = 0; j < MAX_X; ++j ){
			nodes.push( (function(){
				var e = new Node();
				e._id = 0;
				e._coord = new Coord2D();
				e._coord.set( j, i );
				e._parent = new Coord2D();
				e._parent.set( -1, -1 );
				if( i < heuristics.length && j < heuristics[ 0 ].length ){
					e._h = heuristics[ i ][ j ];
				}
				else{
					e._h = 0;
				}
				return e;
			})() );
		}
	}
	
	nodes[ coord_to_index( start ) ]._id = 1;
	nodes[ coord_to_index( goal ) ]._id = 2;
	
	openList = new Array();
	closeList = new Array();
}

function check( dx, dy, node )
{
	var coord = new Coord2D();
	coord._x = node._coord._x + dx;
	coord._y = node._coord._y + dy;
	
	if( coord._x < 0 || coord._x >= MAX_X ){
		return;
	}
	if( coord._y < 0 || coord._y >= MAX_Y ){
		return;
	}
	
	// calculate cost.
	var neighbor = nodes[ coord_to_index( coord ) ];
	var df;
	var findOnOpen;
	var findOnClose;
	df = node._f - node._h + neighbor._h + distance( node._coord, neighbor._coord );
	findOnOpen = ( openList.indexOf( neighbor ) != -1 );
	findOnClose = ( closeList.indexOf( neighbor ) != -1 );
	
	// operate.
	if( !findOnOpen && !findOnClose ){
		neighbor._f = df;
		neighbor._parent._x = node._coord._x;
		neighbor._parent._y = node._coord._y;
		openList.push( neighbor );
	}
	else if( findOnOpen ){
		if( df < neighbor._f ){
			neighbor._f = df;
			neighbor._parent._x = node._coord._x;
			neighbor._parent._y = node._coord._y;
		}
	}
	else if( findOnClose ){
		if( df < neighbor._f ){
			neighbor._f = df;
			neighbor._parent._x = node._coord._x;
			neighbor._parent._y = node._coord._y;
			// remove from close list.
			closeList.some( function( v, i ){
				if( v._coord.equal( neighbor._coord ) ){
					openList.splice( i, 1 );
				}
			});
			openList.push( neighbor );
		}
	}
}

// find path
// 0 : ok
// 1 : failed
function findPath()
{
	
	// add start node to open list
	openList.push( nodes[ coord_to_index( start ) ] );
	
	while( 1 ){
		
		// if open list is empty, path finding is failed
		if( openList.length == 0 ){
			return 1;
		}
		
		// search node with minimum cost
		var nodeIdx;
		var minNode = openList[ 0 ];
		for( nodeIdx = 0; nodeIdx < openList.length; ++nodeIdx ){
			if( minNode._f > openList[ nodeIdx ]._f ){
				minNode = openList[ nodeIdx ];
			}
		}

		// remove minimum cost OST
		openList.some( function( v, i ){
			if( v._coord.equal( minNode._coord ) ){
				openList.splice( i, 1 );
			}
		});

		// if minNode == goal, path finding is finished
		if( minNode._id == 2 ){
			result = minNode;
			return 0;
		}
		// if minNode != goal, minNode is moved to close list
		else{
			closeList.push( minNode );
		}
		
		// check for all neighbors node
		check( -1, -1, minNode );
		check( -1, 0, minNode );
		check( -1, 1, minNode );
		check( 0, -1, minNode );
		check( 0, 1, minNode );
		check( 1, -1, minNode );
		check( 1, 0, minNode );
		check( 1, 1, minNode );
	}
}