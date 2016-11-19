import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai,{expect} from 'chai';
import jsxChai from 'jsx-chai';
chai.use(jsxChai);

import {TreeIndicator,defaultClassNames,defaultGetters,defaultCallbacks} from '../src';


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

describe('A TreeView Indicator',()=>{
    it('should be closed by default',()=>{
        const className = defaultClassNames.indicator + ' ' + defaultClassNames.indicatorClosed;
        
        const actual = render(<TreeIndicator leaf={false} treeProps={defaultTreeProps} node={{}}/>);
        const expected = (
            <div onClick={noop} className={className} style={{display:'inline-block'}}></div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should be open if a node is marked true in the openedMap',()=>{
        const className = defaultClassNames.indicator + ' ' + defaultClassNames.indicatorOpen;
        
        const actual = render(<TreeIndicator opened={true} treeProps={defaultTreeProps} node={{}}/>);
        
        const expected = (
            <div onClick={noop} className={className} style={{display:'inline-block'}}></div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should be open if a node is marked as isOpen === true',()=>{
        const className = defaultClassNames.indicator + ' ' + defaultClassNames.indicatorOpen;
        
        const actual = render(<TreeIndicator opened={true} treeProps={defaultTreeProps} node={{isOpen:true}}/>);
        
        const expected = (
            <div onClick={noop} className={className} style={{display:'inline-block'}}></div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should not display if a node is a leaf',()=>{
        const className = defaultClassNames.indicator + ' ' + defaultClassNames.indicatorOpen;
        
        const actual = render(<TreeIndicator opened={true} leaf={true} treeProps={defaultTreeProps} node={{}}/>);
        
        const expected = (
            <div onClick={noop} className={className} style={{display:'none'}}></div>
        );
        expect(actual).to.deep.equal(expected);
    });
    it('should be be able to accept custom open and closed templates',()=>{
        const treeProps = {...defaultTreeProps};
        treeProps.indicators = {
            opened:<span customOpen={true}>+</span>,
            closed:<span customClosed={true}>-</span>
        };
        
        const openActual = render(<TreeIndicator opened={true} leaf={false} treeProps={treeProps} node={{}}/>);
        
        const openExpected = (
            <div onClick={noop} style={{display:'inline-block'}}>
                <span customOpen={true}>+</span>
            </div>
        );

        const closedActual = render(<TreeIndicator opened={false} leaf={false} treeProps={treeProps} node={{}}/>);
        
        const closedExpected = (
            <div onClick={noop} style={{display:'inline-block'}}>
                <span customClosed={true}>-</span>
            </div>
        );

        expect(openActual).to.deep.equal(openExpected);
        expect(closedActual).to.deep.equal(closedExpected);
    });
});