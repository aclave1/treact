import React, {Component} from 'react';

const noop = ()=>{};
const undef = (x)=>typeof x === 'undefined';
const undefOrNull = (x)=>typeof x === 'undefined' || x === null;

export const defaultGetters = {
    children:(node)=>node.children,
    id:(node)=>node.id,
    contents:(node)=>node.contents,
    parent:(node)=>node.parent,
    isOpen:(node)=>node.isOpen === true
};

export const defaultSetters = {
    children:(node)=>node.children = [],
    addChild:(parent,node,getters)=>getters.children(parent).push(node)
};

export const defaultClassNames = {
    root:'tree-root',
    tree:'tree',
    node:'tree-node',
    treeActive:'tree-node-is-active',
    children:'tree-node-children',
    indicator:'tree-node-indicator',
    indicatorOpen:'tree-node-indicator-is-open',
    indicatorClosed:'tree-node-indicator-is-closed'
};

export const defaultCallbacks = {
    nodeToggled:noop,
    nodeClicked:noop
};
export default class TreeView extends Component{
    constructor(){
        super();
        this.state = {
            openedMap:{}
        };
    }
    render(){
        let tree = undef(this.props.tree.length) ? [this.props.tree] : this.props.tree;
        
        const treeProps = {
            getters:{...defaultGetters,...this.props.getters},
            classNames:{...defaultClassNames,...this.props.classNames},
            callbacks:{...defaultCallbacks,...this.props.callbacks},
            indicators:{...this.props.indicators},
            template:typeof this.props.template === 'function' ? this.props.template : undefined,
            actions:buildActions(this)
        };
        return (
            <div className={treeProps.classNames.root}>
                {this.props.styleTag === false ? '' : styleTag(treeProps.classNames)}
                {tree.map(child =><TreeNode key={treeProps.getters.id(child)} node={child} treeProps={treeProps}/>)}    
            </div>
        );
    }
}

TreeView.getDefaultClassNames = ()=>defaultClassNames;

//traverse a tree and apply cb to each (node,parent) pair
TreeView.traverseTree = (tree,cb,_getters = {})=>{
    //const getters = {...defaultGetters,..._getters};
    throw new Error('not implemented');
};

//traverse a tree and return a new tree
TreeView.mapTree = (tree,cb,_getters = {})=>{
    throw new Error('not implemented');
};




let renderNodeContents = (node,contents)=> typeof contents === 'function' ? contents(node) : contents;

export const TreeNode = (props)=>{
    const {node,treeProps} = props; 
    const {actions, classNames, getters, callbacks} = treeProps;

    const isOpened = actions.isOpen(getters.id(node)) || getters.isOpen(node);
    let children = !undef(getters.children(node)) ? getters.children(node) : [];//if the node is missing the children property, just skip it
    const hasChildren = children.length > 0;

    return (
        <div className={combineClassNames(classNames.tree, hasChildren ? classNames.treeActive : '')}>
            <span className={classNames.node}>
                <TreeIndicator opened={isOpened} leaf={!hasChildren} node={node} treeProps={props.treeProps}/>
                <span onClick={() => callbacks.nodeClicked(node)}>                
                    {!undef(treeProps.template) ? treeProps.template(node) : renderNodeContents(node,getters.contents(node))}
                </span>
            </span>
            <div style={{display:isOpened ? 'block' : 'none'}} className={classNames.children}>
                {children.map(child=> <TreeNode key={getters.id(child)} node={child} treeProps={props.treeProps}/>)}
            </div>
        </div>
    );
};

export const TreeIndicator = (props)=>{
    const {treeProps, node} = props;
    const {actions, classNames, getters, callbacks} = treeProps;
    //let the user define custom indicators or use our own:
    const {indicator,indicatorOpen,indicatorClosed} = classNames;
    const className = combineClassNames(indicator, props.opened ? indicatorOpen : indicatorClosed);
    const useCustomTemplate = !undef(treeProps.indicators.opened) && !undef(treeProps.indicators.closed); 
    if(useCustomTemplate){
        return <div onClick={()=>actions.toggleNode(getters.id(node), node, callbacks)} style={{display:props.leaf ? 'none' : 'inline-block'}}>{props.opened ? treeProps.indicators.opened : treeProps.indicators.closed}</div>;
    }
    return (<div onClick={()=>actions.toggleNode(getters.id(node), node)} className={className} style={{display:props.leaf ? 'none' : 'inline-block'}}></div>);
};

//converts a flat array to a tree compatible with treeact
export const arrayToTree = (_array,_getters = {},_setters={})=>{
    const getters = {...defaultGetters,..._getters};
    const setters = {...defaultSetters,..._setters};

    const tree = [];
    const map = {};//hash table used to speed up element lookup during tree building.
    const array = _array.slice();//make a copy of the array to avoid modifying it.

    const addToParentAndMap = (el)=>{
        const parentId = getters.parent(el);
        const parentNode = map[parentId];
        setters.addChild(map[parentId],el,getters);
        map[getters.id(el)] = el;
    };
    const parentMapped = (node)=> !undef(map[getters.parent(node)]);

    for(var i=0;i<array.length;i++){
        let node = array[i];
        let removeElement = false;//if the element is a root element, or if its parent is already in the map, remove it from the array
        //ensure that every node has the children property
        if(undefOrNull(getters.children(node))) setters.children(node);

        if(undefOrNull(getters.parent(node))){
            map[getters.id(node)] = node;
            tree.push(node);
            removeElement = true;
        }else if(parentMapped(node)){
            addToParentAndMap(node);
            removeElement = true;
        }

        if(removeElement){
            array.splice(i,1);
            /**reassign i because splice modifies the length of the array, causing elements to be skipped.
               counting backwards would fix this, but reverse the sort order and I don't want to force the user to re-sort their data after using this.
            */
            i--;
        }
    }
    while(array.length > 0){
        var node = array.shift();
        if(parentMapped(node)){
            addToParentAndMap(node);
        }else{
            array.push(node);
        }
    }
    return tree;
};

function buildActions(component){
    const isOpen = (id)=>{
        return component.state.openedMap[id] === true;
    };
    const toggleNode = (id, node)=>{
        component.setState({
            openedMap:{
                ...component.state.openedMap,
                ...{[id]:!isOpen(id)}
            }
        }, function(){
            component.props.callbacks.nodeToggled(node);
        });
    };
    return {
        toggleNode,
        isOpen
    };
}

function styleTag(classNames){
    return (
        <style>
            {
                `
                .${classNames.children}{
                    padding-left:10px;
                }
                .${classNames.indicator}{
                    margin-right:5px;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 5px 0 5px 8.7px;
                    border-color: transparent transparent transparent #000000;
                }
                .${classNames.indicator}:hover{
                    cursor:pointer;
                }
                .${classNames.node}:hover{
                    background-color:#ccc;
                    cursor:pointer;
                }
                .${classNames.indicatorOpen}{
                   transform:rotate(90deg);
                }
                .${classNames.indicatorClosed}{
                }
                `
        }
        </style>
    );
}

function combineClassNames(){
    return [].filter.call(arguments,arg=>arg.trim() !== '').join(' ');
}