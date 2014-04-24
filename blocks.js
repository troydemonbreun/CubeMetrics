			  function calcTotalAreaSquareDimension(blocks, margin)
			  {
			  
				margin = margin * 2;
			  
				var totalArea = 0;
			  
				for(var n = 0 ; n < blocks.length ; n++)
				{
					var block = blocks[n];
					totalArea += ((block.w + margin) * (block.h + margin))
				}

				return Math.ceil(Math.sqrt(totalArea));
				
			  };
			  
			  function maxWidth(blocks, margin)
			  {
			  
				var max = 0;
			  
				for(var n = 0 ; n < blocks.length ; n++)
				{
					var block = blocks[n];
					max = Math.max(block.w + (margin * 2), max)
				}				
				
				return max;
			  };
			  
			  function drawBlocks(paper, blocks, xOffset, yOffset)
			  {
			    
				for(var n = 0 ; n < blocks.length ; n++)
				{
					var block = blocks[n];
					
					console.log(block.w + " " + block.h);					
					
					if (!block.fit)
						console.log("not fit");	
					
					if (block.fit) {
						var rc = paper.rect(block.fit.x + xOffset, block.fit.y + yOffset, block.w, block.h);
						paper.text(block.fit.x + xOffset + (block.w / 2), block.fit.y + yOffset + (block.h / 2), n);
					}
				}

			  };
			  
			  function getTrimmedRootBlock(blocks)
			  {
				var pr = blocks.packerRef;
				var r = pr.root;
				r.w -= pr.shortestRemainderWidth; //trim extra space
				r.h -= pr.shortestRemainderHeight; //trim extra space
				return r
			  };
			  