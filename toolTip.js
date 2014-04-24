/******************************************************************************
Borrowed heavily from http://stemkoski.github.io/Three.js/Mouse-Tooltip.html
******************************************************************************/

maxToolTipWidth = 600;
maxToolTipHeight = 400;

var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
var spriteTL, spriteTR, spriteBL, spriteBR, spriteC; 
var cameraOrtho, sceneOrtho;

function initToolTip() 
{
	// initialize object to perform world/screen calculations
	projector = new THREE.Projector();
	
	// when the mouse moves, call the given function
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	var width = window.innerWidth;
	var height = window.innerHeight; 

	cameraOrtho = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, 1, 100 );
	cameraOrtho.position.z = 5; 	

	sceneOrtho = new THREE.Scene();
	
	toolTipCanvas = document.createElement('canvas');
	toolTipCanvas.width = maxToolTipWidth;
	toolTipCanvas.height = maxToolTipHeight;
	toolTipCanvasContext = toolTipCanvas.getContext('2d');
	toolTipCanvasContext.font = "Bold 10px Arial";
    //toolTipCanvasContext.textAlign = "center";
    //toolTipCanvasContext.textBaseline = "middle";
    
	// canvas contents will be used for a texture
	texture1 = new THREE.Texture(toolTipCanvas) 
	texture1.needsUpdate = true;
		
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture1 } );

	var width2 = spriteMaterial.map.image.width;
	var height2 = spriteMaterial.map.image.height;
	
	sprite1 = new THREE.Sprite( spriteMaterial );
	sprite1.scale.set( width2, height2, 1 );
	sceneOrtho.add( sprite1 );
}

function onDocumentMouseMove( event ) 
{
	
	var xPercent = event.clientX / window.innerWidth;
	var yPercent = - (event.clientY / window.innerHeight);

	// update the mouse variable
	mouse.x = (xPercent * 2) - 1;
	mouse.y = (yPercent * 2) + 1;
	
	// update tooltip position
	toolTip = { x: mouse.x * (window.innerWidth / 2), y: mouse.y * (window.innerHeight / 2), w: (toolTipCanvas.width / 2), h: (toolTipCanvas.height / 2) };
	sprite1.position.set( toolTip.x + toolTip.w + 10 + ((32 * xPercent)), toolTip.y + toolTip.h - 30, 0 ); //why 32?
	
}



function updateToolTip()
{

	var yPercent = (mouse.y - 1) / 2;
			
	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
		
	//adjustments - no idea why these numbers work, trial and error results
	var xPercent = (mouse.x + 1) / 2;
	vector.x = vector.x + (72 * xPercent);
	vector.y = vector.y + 30;
	
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	
	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( scene.children );

	// INTERSECTED = the object in the scene currently closest to the camera 
	//		and intersected by the Ray projected from the mouse position 	
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED ) 
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED ) 
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
	
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
	
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			
			// update text, if it has a "name" field.
			if ( INTERSECTED.name )
			{
			
				// set a new color for closest object
				INTERSECTED.material.color.setHex( 0xffff00 );
				
			    toolTipCanvasContext.clearRect(0,0,toolTipCanvas.width,toolTipCanvas.height);

				var name = INTERSECTED.name;	
				//var metrics = toolTipCanvasContext.measureText(name);
				var width = maxToolTipWidth;
				var height = 50 + 8; // tyically font size * number of lines + 8
				var x = 0;
				var y = toolTipCanvas.height - height;
				toolTipCanvasContext.fillStyle = "rgba(0,0,0,0.95)"; // black border
				toolTipCanvasContext.fillRect( x, y, width, height);
				toolTipCanvasContext.fillStyle = "rgba(255,255,255,0.95)"; // white filler
				toolTipCanvasContext.fillRect( x + 2, y + 2, width - 4, height - 4 );
				toolTipCanvasContext.fillStyle = "rgba(0,0,0,1)"; // text color
				
				//display multiple lines
				var lines = splitOnNthCharacter(name, 105);
				for (i = 0; i < lines.length; i++)
				{
					toolTipCanvasContext.fillText( lines[i], 4, y + (12 * (i + 1)) ); // y + font size + 2
				}
				
				texture1.needsUpdate = true;
			}
			else
			{
				toolTipCanvasContext.clearRect(0,0,toolTipCanvas.width,toolTipCanvas.height);
				texture1.needsUpdate = true;
			}
		}
	} 
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ) 
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
		toolTipCanvasContext.clearRect(0, 0, toolTipCanvas.width,toolTipCanvas.height);
		texture1.needsUpdate = true;
	}

	renderer.render( sceneOrtho, cameraOrtho );
	
}

function splitOnNthCharacter(string, n)
{
    return string.match(new RegExp(".{1," + n + "}", "g"));
}