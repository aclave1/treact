import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai,{expect} from 'chai';
import jsxChai from 'jsx-chai';
chai.use(jsxChai);

import {TreeIndicator,TreeNode,defaultClassNames,defaultGetters,defaultCallbacks} from '../src';


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

describe('Node templates',()=>{
  it('renders a string',()=>{
    const node = {
      id:1,
      contents:'contents 1',
      children:[{
        id:2,
        contents:'contents 2'
      }]
    };
    const child = node.children[0];

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
  it('renders a number',()=>{
    const node = {
      id:1,
      contents:100,
      children:[{
        id:2,
        contents:200
      }]
    };
    const child = node.children[0];

    const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
    const expected = (
        <div className={'tree tree-node-is-active'}>
            <span className={defaultClassNames.node}>
                <TreeIndicator opened={false} leaf={false} treeProps={defaultTreeProps} node={node}/>
                {100}
            </span>
            <div className={defaultClassNames.children} style={{display:'none'}}>
                <TreeNode key={child.id} node={child} treeProps={defaultTreeProps} />
            </div>
        </div>
    );
        
    expect(actual).to.deep.equal(expected);
  });
  it('renders per-node custom jsx',()=>{
    const node = {
      id:1,
      contents:<span>custom jsx 1</span>,
      children:[{
        id:2,
        contents:<span>custom jsx 2</span>
      }]
    };
    const child = node.children[0];

    const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
    const expected = (
      <div className={'tree tree-node-is-active'}>
          <span className={defaultClassNames.node}>
              <TreeIndicator opened={false} leaf={false} treeProps={defaultTreeProps} node={node}/>
              <span>custom jsx 1</span>
          </span>
          <div className={defaultClassNames.children} style={{display:'none'}}>
              <TreeNode key={child.id} node={child} treeProps={defaultTreeProps} />
          </div>
      </div>
    );
      
    expect(actual).to.deep.equal(expected);
  });
  it('renders a per-node custom function',()=>{
    const node = {
      id:1,
      nodeCustomProperty:'my property',
      contents:(node)=><span>{node.nodeCustomProperty}</span>,
      children:[{
        id:2,
        contents:'2'
      }]
    };
    const child = node.children[0];

    const actual = render(<TreeNode key={node.id} node={node} treeProps={defaultTreeProps}/>);
    const expected = (
        <div className={'tree tree-node-is-active'}>
            <span className={defaultClassNames.node}>
                <TreeIndicator opened={false} leaf={false} treeProps={defaultTreeProps} node={node}/>
                <span>my property</span>
            </span>
            <div className={defaultClassNames.children} style={{display:'none'}}>
                <TreeNode key={child.id} node={child} treeProps={defaultTreeProps} />
            </div>
        </div>
    );
    
    expect(actual).to.deep.equal(expected);
  });
  it('renders a global template function',()=>{
    const tpl = (node)=>(<div id={node.id}>{node.id} {node.contents}</div>);
    const treeProps = {...defaultTreeProps,...{
      template:tpl
    }};

    const node = {
      id:1,
      nodeCustomProperty:'my property',
      contents:'contents 1',
      children:[{
        id:2,
        contents:'contents 2'
      }]
    };
    const child = node.children[0];

    const actual = render(<TreeNode key={node.id} node={node} treeProps={treeProps}/>);
    const expected = (
      <div className={'tree tree-node-is-active'}>
          <span className={defaultClassNames.node}>
              <TreeIndicator opened={false} leaf={false} treeProps={treeProps} node={node}/>
              <div id={node.id}>{node.id} {node.contents}</div>
          </span>
          <div className={defaultClassNames.children} style={{display:'none'}}>
              <TreeNode key={child.id} node={child} treeProps={treeProps} />
          </div>
      </div>
  );

  expect(actual).to.deep.equal(expected);
  });
});