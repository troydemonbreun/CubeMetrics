/******************************************************************************
Borrowed heavily from https://github.com/jakesgordon
******************************************************************************/

Packer = function(w, h) {
  this.init(w, h);
};

Packer.prototype = {

  init: function(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };
	this.shortestRemainderWidth = 0;
	this.shortestRemainderHeight = 0;
  },

  fit: function(blocks, margin) {
    
    var maxX = 0
	var maxY = 0;
	var n, node, block;
  
	blocks.sort(function(a,b){return b.h - a.h});
	
	for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.w, block.h, margin))
	  {
        block.fit = this.splitNode(node, block.w, block.h, margin);
		maxX = Math.max(node.x + block.w + (margin * 2), maxX);
		maxY = Math.max(node.y + block.h + (margin * 2), maxY);
	  }
    }
	this.shortestRemainderWidth = this.root.w - maxX;
	this.shortestRemainderHeight = this.root.h - maxY;
	blocks.packerRef = this;
  },

  findNode: function(root, w, h, margin) {
  	if (!root)
		return null;
    if (root.used)
      return this.findNode(root.right, w, h, margin) || this.findNode(root.down, w, h, margin);
    else if ((w + (margin * 2) <= root.w) && (h + (margin * 2) <= root.h))
      return root;
    else
	  return null;
  },

  splitNode: function(node, w, h, margin) {
	w = w + (margin * 2);
	h = h + (margin * 2);
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  }
    
}