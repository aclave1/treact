import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai,{expect} from 'chai';
import jsxChai from 'jsx-chai';
chai.use(jsxChai);

import TreeView,{arrayToTree,TreeIndicator,TreeNode,defaultClassNames,defaultGetters,defaultCallbacks} from '../src';

const sortById = (a,b)=>a.id-b.id;

const render = (component) => {
  const renderer = createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
};
const mockActions = {
    toggleNode:()=>{},
    isOpen:()=>false
};
const defaultTreeProps = {
    classNames:defaultClassNames,
    actions:mockActions,
    getters:defaultGetters,
    callbacks:defaultCallbacks,
    indicators:{},
    template:undefined
};

describe('arrayToTree',()=>{
    it('does not modify the original array',()=>{
        const inputarray = Object.freeze([
            {id:1,parent:null},
            {id:2,parent:null},
            {id:3,parent:1},
        ]);

        const expectedTree = [
            {id:1,parent:null,children:[{id:3,parent:1,children:[]}]},
            {id:2,parent:null,children:[]},
        ];
        const actualTree = arrayToTree(inputarray);
        expect(actualTree.sort(sortById)).to.deep.equal(expectedTree.sort(sortById));
    });
    it('elements with no parent are top level',()=>{
        const inputarray = [
            {id:1,parent:null},
            {id:2,parent:null},
            {id:3,parent:1},
        ];
        const expectedTree = [
            {id:1,parent:null,children:[{id:3,parent:1,children:[]}]},
            {id:2,parent:null,children:[]},
        ];
        const actualTree = arrayToTree(inputarray);
        expect(actualTree.sort(sortById)).to.deep.equal(expectedTree.sort(sortById));
    });
    it('can handle nodes with a different schema',()=>{
        const sortByIdent = (a,b)=>a.ident-b.ident;
        const inputarray = [
            {ident:1,parentNode:null,childNodes:[]},
            {ident:2,parentNode:null,childNodes:[]},
            {ident:3,parentNode:1,childNodes:[]},
        ];
        const expectedTree = [
            {ident:1,parentNode:null,childNodes:[{ident:3,parentNode:1,childNodes:[]}]},
            {ident:2,parentNode:null,childNodes:[]},
        ];
        const getters = {
            id:(node)=>node.ident,
            parent:(node)=>node.parentNode,
            children:(node)=>node.childNodes,
        };

        const actualTree = arrayToTree(inputarray,getters);
        expect(actualTree.sort(sortByIdent)).to.deep.equal(expectedTree.sort(sortByIdent));

    });

    it('can use setters to normalize nodes',()=>{
        const sortByIdent = (a,b)=>a.ident-b.ident;
        //nodes without childNodes property set
        const inputarray = [
            {ident:1,parentNode:null},
            {ident:2,parentNode:null},
            {ident:3,parentNode:1},
        ];
        const expectedTree = [
            {ident:1,parentNode:null,childNodes:[{ident:3,parentNode:1,childNodes:[]}]},
            {ident:2,parentNode:null,childNodes:[]},
        ];
        const getters = {
            id:(node)=>node.ident,
            parent:(node)=>node.parentNode,
            children:(node)=>node.childNodes,
        };
        const setters = {
            children:(node)=>node.childNodes = []
        };
        const actualTree = arrayToTree(inputarray,getters,setters);
        expect(actualTree.sort(sortByIdent)).to.deep.equal(expectedTree.sort(sortByIdent));

    });
    it('nodes with no children still have the children setter applied to them',()=>{
        const sortByIdent = (a,b)=>a.ident-b.ident;
        //nodes without childNodes property set
        const inputarray = [
            {ident:1,parentNode:null},
            {ident:2,parentNode:null},
            {ident:3,parentNode:1},
        ];
        const expectedTree = [
            {ident:1,parentNode:null,childNodes:[{ident:3,parentNode:1,childNodes:[]}]},
            {ident:2,parentNode:null,childNodes:[]},
        ];
        const getters = {
            id:(node)=>node.ident,
            parent:(node)=>node.parentNode,
            children:(node)=>node.childNodes,
        };
        const setters = {
            children:(node)=>node.childNodes = []
        };
        const actualTree = arrayToTree(inputarray,getters,setters);
        expect(actualTree.sort(sortByIdent)).to.deep.equal(expectedTree.sort(sortByIdent));

    });
    it('converts a flat array to an array compatible with TreeView',function(){
        const inputarray = [
            {id:1,parent:null},
            {id:2,parent:null},
            {id:3,parent:1},
            {id:4,parent:2},
        ];
        const tree = arrayToTree(inputarray);
        const actual = render(<TreeView tree={tree} styleTag={false}/>);
        const expected = (
            <div className={defaultClassNames.root}>
                <TreeNode node={tree[0]} treeProps={defaultTreeProps}/>
                <TreeNode node={tree[1]} treeProps={defaultTreeProps}/>
            </div>
        );
        expect(actual).to.deep.equal(expected);
    });
});