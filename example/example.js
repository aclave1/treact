window.React = require('react');
window.ReactDom = require('react-dom');

import TreeView,{arrayToTree} from '../index';

const ImageNode = (props)=>{return <div><img src={props.img} style={{height:50,width:50}} alt=""/>{props.contents}</div>;};
const icon = "http://icons.iconarchive.com/icons/icons-land/3d-food/256/IceCream-Cone-icon.png";
const reacticon = "https://facebook.github.io/react/img/logo.svg";
const sampleTree = [
    {
        id:1,
        anyProperty:'google',
        linkAddress:'https://google.com',
        contents:(node)=><a href={node.linkAddress}>{node.anyProperty}</a>,
        children:[
            {
                id:2,
                contents:'2',
                children:[
                    {
                        id:3,
                        contents:'3',
                        children:[
                            {id:4,children:[],contents:(<ImageNode img={icon} contents={"sweeeet"}/>)},
                            {id:5,children:[],contents:(<ImageNode img={reacticon} contents={"sweeeet"}/>)}
                        ]
                    }
                ]
            },
            {id:6,contents:'4',children:[]},
            {id:7,contents:'5',children:[]},
            {id:8,contents:'6',children:[]},
            {id:9,contents:'7',children:[]},
            {id:10,contents:(
                <div><span style={{backgroundColor:'pink'}}>custom</span> jsx <em>contents</em></div>
            ),children:[]},
            {id:11,contents:(<ImageNode img={icon} contents={"sweeeet"}/>),children:[]},
        ]
    }
];

//if parent is null or undefined, it's a root node
const flatTree = [
    {id:1,contents:'1',parent:null},
        {id:2,contents:'2',parent:1},
            {id:3,contents:'3',parent:2},
                {id:4,contents:'4',parent:3},
    {id:5,contents:'5',parent:null},
        {id:7,contents:'7',parent:5},
    {id:6,contents:'6',parent:null},
        {id:8,contents:'7',parent:6},
];

/***

properties:
tree: the data
getters: functions used to access node properties, these are overrides
isFlat: is this a flat array with references to parent nodes, or is this a tree with children arrays? if this is a flat array, it will be converted into a tree with each render.
callbacks: functions to call when things happen
classNames:override the default classnames
indicators: override the default indicators. Pass {open:openjsx,closed:closedjsx} to replace both states. You could even pass the same custom component with different classnames to both open and closed.
*/

const getters = {};
const callbacks = {
    nodeToggled:(node)=>console.dir(node)
};

//custom icon can either be two discrete icons, one for the open and one for the closed state, or it can be a single icon which represents the closed state and will be rotated 90 degrees to form the opened state.
const customIcons = {
    opened:{},
    closed:{}
};

const customIcon = <span>{">"}</span>
ReactDom.render(<TreeView tree={arrayToTree(flatTree)} getters={getters} callbacks={callbacks} />,document.getElementById('react-container'));
