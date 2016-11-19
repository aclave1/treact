import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai,{expect} from 'chai';
import jsxChai from 'jsx-chai';
chai.use(jsxChai);

import TreeView,{TreeIndicator,TreeNode,defaultClassNames,defaultGetters,defaultCallbacks} from '../src';


const noop = ()=>{};
//https://gist.github.com/justinobney/26593cff2b0c8e991198
const render = (component) => {
  const renderer = createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
};

const mockActions = {
    toggleNode:noop,
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

describe('A basic TreeView',()=>{
    it('should render an array of one node',()=>{
        const tree = [{
            id:1,
            contents:'contents'
        }];
        const actual = render(<TreeView tree={tree} styleTag={false}/>);
        const expected = (
            <div className={defaultClassNames.root}>
                <TreeNode node={tree[0]} treeProps={defaultTreeProps}/>
            </div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should render an array of many nodes',()=>{
        const tree = [{
            id:1,
            contents:'contents'
        },{id:2,contents:'contents'}];

        const actual = render(<TreeView tree={tree} styleTag={false}/>);
        
        const expected = (
            <div className={defaultClassNames.root}>
                <TreeNode node={tree[0]} treeProps={defaultTreeProps}/>
                <TreeNode node={tree[1]} treeProps={defaultTreeProps}/>
            </div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should render a single root node',()=>{
        const tree = {
            id:1,
            contents:'contents'
        };

        const actual = render(<TreeView tree={tree} styleTag={false}/>);
        
        const expected = (
            <div className={defaultClassNames.root}>
                <TreeNode node={tree} treeProps={defaultTreeProps}/>
            </div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should be able to render a different node schema',()=>{
        const node = {
            identifier:1,
            body:'contents 1',
            kids:[
                {identifier:2,body:'contents 2',kids:[]}
            ]
        };
        const getters = {
            id:(node)=>node.identifier,
            contents:(node)=>node.body,
            children:(node)=>node.kids
        };
        
        const actual = render(<TreeView tree={node} getters={getters} styleTag={false}/>);

        const expected = (
            <div className={defaultClassNames.root}>
                <TreeNode node={node} treeProps={defaultTreeProps} />
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });
});
describe('A Tree Node',()=>{
    it('should render itself',()=>{
        const node = {
            id:1,
            contents:'contents 1',
            children:[]
        };

        const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
        const expected = (
            <div className={defaultClassNames.tree}>
                <span className={defaultClassNames.node}>
                    <TreeIndicator opened={false} leaf={true} treeProps={defaultTreeProps} node={node}/>
                    {'contents 1'}
                </span>
                <div className={defaultClassNames.children} style={{display:'none'}}>
                </div>
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });
    it('should render itself and a single child',()=>{
        const node = {
            id:1,
            contents:'contents 1',
            children:[
                {id:2,contents:'contents 2',children:[]}
            ]
        };
        let child = node.children[0];

        const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
        const expected = (
            <div className={'tree tree-node-is-active'}>
                <span className={defaultClassNames.node}>
                    <TreeIndicator opened={false} leaf={false} treeProps={defaultTreeProps} node={node}/>
                    {'contents 1'}
                </span>
                <div className={defaultClassNames.children} style={{display:'none'}}>
                    <TreeNode key={child.id} node={child} treeProps={defaultTreeProps} />
                </div>
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });
    it('should not show an indicator if it has no children',()=>{
        const node = {
            id:1,
            contents:'contents 1',
            children:[]
        };

        const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
        const expected = (
            <div className={'tree'}>
                <span className={defaultClassNames.node}>
                    <TreeIndicator opened={false} leaf={true} treeProps={defaultTreeProps} node={node}/>
                    {'contents 1'}
                </span>
                <div className={defaultClassNames.children} style={{display:'none'}}>
                </div>
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });
    it('should handle undefined/null children property',()=>{
        const node = {
            id:1,
            contents:'contents 1'
        };
        const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
        const expected = (
            <div className={'tree'}>
                <span className={defaultClassNames.node}>
                    <TreeIndicator opened={false} leaf={true} treeProps={defaultTreeProps} node={node}/>
                    {'contents 1'}
                </span>
                <div className={defaultClassNames.children} style={{display:'none'}}>
                </div>
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });

    it('should be able to render a different node schema',function(){
        const node = {
            identifier:1,
            body:'contents 1',
            kids:[
                {identifier:2,body:'contents 2',kids:[]}
            ]
        };
        const child = node.kids[0];
        
        const treeProps = {
                ...defaultTreeProps,
                ...{
                    getters:{
                    ...defaultTreeProps.getters,
                    ...{
                        id:(node)=>node.identifier,
                        contents:(node)=>node.body,
                        children:(node)=>node.kids
                    }
                }
            }
        };
        
        const actual = render(<TreeNode key={node.identifier} node={node} treeProps={treeProps}/>);

        const expected = (
            <div className={'tree tree-node-is-active'}>
                <span className={defaultClassNames.node}>
                    <TreeIndicator opened={false} leaf={false} treeProps={treeProps} node={node}/>
                    {'contents 1'}
                </span>
                <div className={defaultClassNames.children} style={{display:'none'}}>
                    <TreeNode key={child.identifier} node={child} treeProps={treeProps} />
                </div>
            </div>
        );
        
        expect(actual).to.deep.equal(expected);
    });
});