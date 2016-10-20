# Treact

* self contained, no external styles or libraries are needed
* custom jsx templates for individual nodes, or the whole tree
* any node schema you want
* can convert flat arrays to tree representation

# Installation

Just call 

```
import TreeView from 'scopic-react-tree';
```

There's no minified dist version currently. Feel free to submit a PR.

# Examples

Here are some contrived examples which highlight various features

Some real world use cases:

- building a file explorer
- building a context menu

# Api

## <TreeView/>

Props api:

* `tree` (required): array of tree node data
* `isFlat`:if the tree node data is "flat"(a 1 dimensional array of nodes), the array will be converted into tree form
* `getters`: overridecallbacks used to retrieve node properties. Use these to override the schema of your nodes.
* `callbacks` : callbacks to indicate node events
* `classNames`:a map of custom classnames to override defaults
* `template`: custom per-node template function
* `indicators` : override default opened and closed indicators

### `tree`

The array of tree node data. This can be specified in 2 formats. 

**Flat array**

The simplest format is a flat array of nodes. Here is an example of an array of tree nodes with the default node schema:

```
var nodes = [
	{id:1,contents:'1',parent:null},
	{id:2,contents:'2',parent:1},
	{id:3,contents:'3',parent:1},
];
<TreeView tree={nodes}/>
```

In the default schema, it is assumed that each node specifies a unique id, their parent, and their contents. Nodes with null/undefined parents are considered root nodes.

**Nested array**

A pre-built tree can also be accepted. Here is an example of a using a prebuilt tree:

```
var nodes = getNodes();
<TreeView tree={nodes} isFlat={false}/>

function getNodes(){
	return [{
		"id": 1,
		"contents": "1",
		"parent": null,
		"children": [{
			"id": 2,
			"contents": "2",
			"parent": 1,
			"children": [{
				"id": 3,
				"contents": "3",
				"parent": 2,
				"children": [{
					"id": 4,
					"contents": "4",
					"parent": 3,
					"children": []
				}]
			}]
		}]
	}, {
		"id": 5,
		"contents": "5",
		"parent": null,
		"children": [{
			"id": 7,
			"contents": "7",
			"parent": 5,
			"children": []
		}]
	}, {
		"id": 6,
		"contents": "6",
		"parent": null,
		"children": [{
			"id": 8,
			"contents": "7",
			"parent": 6,
			"children": []
		}]
	}];
}

```

TreeView also provides the helper function `arrayToTree` which converts a flat node array into a tree.

### `getters`


Treact needs to know which properties to use to determine the node relationships. If the nodes do not conform to the correct schema, getters can be used to specify node relationships without requiring a pre-processing step. For example, lets say a database returns an array like this:

```
var nodes = [
	{node_id:1,data:"some data",node_parent:null},
	{node_id:2,data:"some data",node_parent:1},
	{node_id:3,data:"some data",node_parent:1},
];
```
You could write these getters
```
var getters = {
	id: node =>node.node_id,
	contents: node =>node.node_data,
	parent:node => node.node_parent
};

<TreeView tree={nodes} getters={getters} />

```

and use Treact exactly the same.

Here is a full list of the default getters

* `id`: unique id of the node
* `contents`: what to render in the node
* `parent`: node to nest current node under
* `children`: nodes nested under this node
* `isOpen`: whether the node is showing its children or not

and the code for them:

```
const defaultGetters = {
    children:(node)=>node.children,
    id:(node)=>node.id,
    contents:(node)=>node.contents,
    parent:(node)=>node.parent,
    isOpen:(node)=>node.isOpen === true
};

```

### `callbacks`

The only callback available currently is `nodeToggled`. Here is an example of using it:
```
const callbacks = {
    nodeToggled:(node)=>console.dir(node);
};
var nodes = [
	{id:1,contents:'1',parent:null},
	{id:2,contents:'2',parent:1},
	{id:3,contents:'3',parent:1},
];
<TreeView tree={nodes} callbacks={callbacks}/>
```

### `indicators`

Override the default open/closed indicators with custom jsx.

```
const customIcons = {
    opened:">",
    closed:"V"
};
const customJSXIcons = {
	opened:<img src="test.com/opened.jpg"/>,
	closed:<img src="test.com/closed.jpg"/>,
};
var nodes = [
	{id:1,contents:'1',parent:null},
	{id:2,contents:'2',parent:1},
	{id:3,contents:'3',parent:1},
];

<TreeView tree={nodes} indicators={customIcons}/>
or
<TreeView tree={nodes} indicators={customJSXIcons}/>
```

### `template`

override the default node template

```
var nodes = [
	{id:1,contents:'1',parent:null},
	{id:2,contents:'2',parent:1},
	{id:3,contents:'3',parent:1},
]
var template = (node)=>(<div><p>node.contents</p><img src={node.imgsrc} alt={node.imgalt}/></div>);

<TreeView tree={nodes} indicators={customJSXIcons} template={template}/>
```
Note: template is expecting a function which returns a react view. You can use this feature to dynamically compute your node template based on the properties of your nodes.