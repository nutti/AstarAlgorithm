#include <list>
#include <algorithm>
#include <iostream>

enum NodeID
{
	NODE_ID_NORMAL,
	NODE_ID_START,
	NODE_ID_GOAL,
};

struct Coord2D
{
	int		m_X;
	int		m_Y;
};

struct Node
{

	NodeID		m_ID;			// node ID
	Coord2D		m_Coord;		// coordinate
	int			m_H;			// heuristics
	int			m_F;			// cost
	Node*		m_pParent;		// parent
};

const int MAX_X		= 20;		// maximum X
const int MAX_Y		= 20;		// maximum Y

Node g_Map[ MAX_X * MAX_Y ];

std::list < Node* >		g_OpenList;			// open list
std::list < Node* >		g_CloseList;		// close list

// calculate distance
inline int DISATANCE( const Coord2D& c1, const Coord2D& c2 )
{
	int dx = abs( c1.m_X - c2.m_X );
	int dy = abs( c1.m_Y - c2.m_Y );
	int d = ( ( dx < dy ) ? dx : dy ) / 2;
	return dx + dy - d;
}

// convert coordinate to index
inline int COORD_TO_INDEX( int x, int y )
{
	return x + y * MAX_X;
}

const int START_NODE_COORD = COORD_TO_INDEX( 2, 2 );		// coordinate of start node
const int GOAL_NODE_COORD = COORD_TO_INDEX( 10, 17 );		// coordinate of goal node

// check neighbor node
void Check( int dx, int dy, Node* pNode )
{
	// neighbor's coordinate
	int x = pNode->m_Coord.m_X + dx;
	int y = pNode->m_Coord.m_Y + dy;

	// out of range
	if( x < 0 || x >= MAX_X ){
		return;
	}
	if( y < 0 || y >= MAX_Y ){
		return;
	}

	// calculate cost.
	Node* pNeighbor = &g_Map[ COORD_TO_INDEX( x, y ) ];		// neighbor node
	int df;					// calculated new cost
	bool findOnOpen;		// is neighbor node in open list?
	bool findOnClose;		// is neighbor node in close list?
	df = pNode->m_F - pNode->m_H + pNeighbor->m_H + DISATANCE( pNode->m_Coord, pNeighbor->m_Coord );
	findOnOpen = ( std::find( g_OpenList.begin(), g_OpenList.end(), pNeighbor ) != g_OpenList.end() );
	findOnClose = ( std::find( g_CloseList.begin(), g_CloseList.end(), pNeighbor ) != g_CloseList.end() );
	
	// neighbor node is neither on open list nor on close list
	if( !findOnOpen && !findOnClose ){
		pNeighbor->m_F = df;
		pNeighbor->m_pParent = pNode;
		g_OpenList.push_back( pNeighbor );
	}
	// neighbor node is found on open list
	else if( findOnOpen ){
		if( df < pNeighbor->m_F ){
			pNeighbor->m_F = df;
			pNeighbor->m_pParent = pNode;
		}
	}
	// neighbor node is found on close list
	else if( findOnClose ){
		if( df < pNeighbor->m_F ){
			pNeighbor->m_F = df;
			pNeighbor->m_pParent = pNode;
			g_CloseList.remove( pNeighbor );
			g_OpenList.push_back( pNeighbor );
		}
	}
}

// main function
int main()
{
	// initialize.
	int i = 0;
	Node* pResult = NULL;	// terminal node
	std::for_each( g_Map, g_Map + sizeof( g_Map ) / sizeof( g_Map[ 0 ] ), [&i]( Node& n ){
		n.m_Coord.m_X = i % MAX_X;
		n.m_Coord.m_Y = i / MAX_Y;
		n.m_H = 0;
		n.m_ID = NODE_ID_NORMAL;
		n.m_pParent = NULL;
		n.m_F = n.m_H;
		++i;
	});
	g_Map[ START_NODE_COORD ].m_ID = NODE_ID_START;
	g_Map[ GOAL_NODE_COORD ].m_ID = NODE_ID_GOAL;
	g_OpenList.clear();
	g_CloseList.clear();

	// add start node to open list
	g_OpenList.push_back( &g_Map[ START_NODE_COORD ] );

	// path finding process
	while( 1 ){
		// if open list is empty, path finding is failed
		if( g_OpenList.empty() ){
			std::cout << "Failed to find path." << std::endl;
			break;
		}
		// find minimum node's cost
		Node *minNode = NULL;
		minNode = *std::min_element( g_OpenList.begin(), g_OpenList.end(), []( Node* lhs, Node* rhs ) -> bool{
				return lhs->m_F < rhs->m_F;
		});
		g_OpenList.remove( minNode );

		// if minNode is goal, path finding is finishded.
		if( minNode->m_ID == NODE_ID_GOAL ){
			std::cout << "Finished path finding." << std::endl;
			pResult = minNode;
			break;
		}
		// if not, add to close list.
		else{
			g_CloseList.push_back( minNode );
		}

		// check for all neighbor nodes.
		Check( -1, -1, minNode );
		Check( -1, 0, minNode );
		Check( -1, 1, minNode );
		Check( 0, -1, minNode );
		Check( 0, 1, minNode );
		Check( 1, -1, minNode );
		Check( 1, 0, minNode );
		Check( 1, 1, minNode );

	}

	// output result.
	while( pResult->m_pParent != NULL ){
		std::cout << "(" << pResult->m_Coord.m_X << "," << pResult->m_Coord.m_Y << ")" << std::endl;
		pResult = pResult->m_pParent;
	}

	return 0;
}