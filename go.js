function go(blocks)
{

				var unfitblocks = [];
				
				blocks.sort(function(a,b){return Math.max(b.w, b.h) - Math.max(a.w, a.h)});
				//blocks.sort(function(a,b){return b.w - a.w});
				//blocks.sort(function(a,b){return b.h - a.h});
				//blocks.sort(function(a,b){return (b.w * b.h) - (a.w * a.h)});
		
				var rootDD = calcTotalAreaSquareDimension(blocks, 5);
	
					console.log(rootDD + " root");
	
				var packer = new Packer(rootDD, rootDD);
					packer.fit(blocks);

				drawBlocks(blocks, 0, 0);					
					
				//get blocks that did not fit
				for(var n = 0 ; n < blocks.length ; n++)
				{
					var block = blocks[n];						
					if (!block.fit)
					{
						unfitblocks.push(block);
					}
				}
				
				if (unfitblocks.length == 0)
					return;
					
				var maxwidth = maxWidth(unfitblocks);
				
				var packer2 = new Packer(maxwidth, rootDD);
					packer2.fit(unfitblocks);
	
				drawBlocks(unfitblocks, rootDD, 0);
				
}