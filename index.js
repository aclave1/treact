'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.arrayToTree = exports.TreeIndicator = exports.TreeNode = exports.defaultCallbacks = exports.defaultClassNames = exports.defaultSetters = exports.defaultGetters = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};
var undef = function undef(x) {
    return typeof x === 'undefined';
};
var undefOrNull = function undefOrNull(x) {
    return typeof x === 'undefined' || x === null;
};

var defaultGetters = exports.defaultGetters = {
    children: function children(node) {
        return node.children;
    },
    id: function id(node) {
        return node.id;
    },
    contents: function contents(node) {
        return node.contents;
    },
    parent: function parent(node) {
        return node.parent;
    },
    isOpen: function isOpen(node) {
        return node.isOpen === true;
    }
};

var defaultSetters = exports.defaultSetters = {
    children: function children(node) {
        return node.children = [];
    },
    addChild: function addChild(parent, node, getters) {
        return getters.children(parent).push(node);
    }
};

var defaultClassNames = exports.defaultClassNames = {
    root: 'tree-root',
    tree: 'tree',
    node: 'tree-node',
    treeActive: 'tree-node-is-active',
    children: 'tree-node-children',
    indicator: 'tree-node-indicator',
    indicatorOpen: 'tree-node-indicator-is-open',
    indicatorClosed: 'tree-node-indicator-is-closed'
};

var defaultCallbacks = exports.defaultCallbacks = {
    nodeToggled: noop,
    nodeClicked: noop
};

var TreeView = function (_Component) {
    _inherits(TreeView, _Component);

    function TreeView() {
        _classCallCheck(this, TreeView);

        var _this = _possibleConstructorReturn(this, (TreeView.__proto__ || Object.getPrototypeOf(TreeView)).call(this));

        _this.state = {
            openedMap: {}
        };
        return _this;
    }

    _createClass(TreeView, [{
        key: 'render',
        value: function render() {
            var tree = undef(this.props.tree.length) ? [this.props.tree] : this.props.tree;

            var treeProps = {
                getters: _extends({}, defaultGetters, this.props.getters),
                classNames: _extends({}, defaultClassNames, this.props.classNames),
                callbacks: _extends({}, defaultCallbacks, this.props.callbacks),
                indicators: _extends({}, this.props.indicators),
                template: typeof this.props.template === 'function' ? this.props.template : undefined,
                actions: buildActions(this)
            };
            return _react2.default.createElement(
                'div',
                { className: treeProps.classNames.root },
                this.props.styleTag === false ? '' : styleTag(treeProps.classNames),
                tree.map(function (child) {
                    return _react2.default.createElement(TreeNode, { key: treeProps.getters.id(child), node: child, treeProps: treeProps });
                })
            );
        }
    }]);

    return TreeView;
}(_react.Component);

exports.default = TreeView;


TreeView.getDefaultClassNames = function () {
    return defaultClassNames;
};

//traverse a tree and apply cb to each (node,parent) pair
TreeView.traverseTree = function (tree, cb) {
    var _getters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    throw new Error('not implemented');
};

//traverse a tree and return a new tree
TreeView.mapTree = function (tree, cb) {
    var _getters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    throw new Error('not implemented');
};

var renderNodeContents = function renderNodeContents(node, contents) {
    return typeof contents === 'function' ? contents(node) : contents;
};
var TreeNode = exports.TreeNode = function TreeNode(props) {
    var node = props.node;
    var treeProps = props.treeProps;
    var actions = treeProps.actions;
    var classNames = treeProps.classNames;
    var getters = treeProps.getters;
    var callbacks = treeProps.callbacks;

    var isOpened = actions.isOpen(getters.id(node)) || getters.isOpen(node);
    var children = !undef(getters.children(node)) ? getters.children(node) : []; //if the node is missing the children property, just skip it
    var hasChildren = children.length > 0;

    return _react2.default.createElement(
        'div',
        { className: combineClassNames(classNames.tree, hasChildren ? classNames.treeActive : '') },
        _react2.default.createElement(
            'span',
            { className: classNames.node },
            _react2.default.createElement(TreeIndicator, { opened: isOpened, leaf: !hasChildren, node: node, treeProps: props.treeProps }),
            _react2.default.createElement(
                'span',
                { onClick: function onClick() {
                        return callbacks.nodeClicked(node);
                    } },
                !undef(treeProps.template) ? treeProps.template(node) : renderNodeContents(node, getters.contents(node))
            )
        ),
        _react2.default.createElement(
            'div',
            { style: { display: isOpened ? 'block' : 'none' }, className: classNames.children },
            children.map(function (child) {
                return _react2.default.createElement(TreeNode, { key: getters.id(child), node: child, treeProps: props.treeProps });
            })
        )
    );
};

var TreeIndicator = exports.TreeIndicator = function TreeIndicator(props) {
    var treeProps = props.treeProps;
    var node = props.node;
    var actions = treeProps.actions;
    var classNames = treeProps.classNames;
    var getters = treeProps.getters;
    var callbacks = treeProps.callbacks;
    //let the user define custom indicators or use our own:

    var indicator = classNames.indicator;
    var indicatorOpen = classNames.indicatorOpen;
    var indicatorClosed = classNames.indicatorClosed;

    var className = combineClassNames(indicator, props.opened ? indicatorOpen : indicatorClosed);
    var useCustomTemplate = !undef(treeProps.indicators.opened) && !undef(treeProps.indicators.closed);
    if (useCustomTemplate) {
        return _react2.default.createElement(
            'div',
            { onClick: function onClick() {
                    return actions.toggleNode(getters.id(node), node, callbacks);
                }, style: { display: props.leaf ? 'none' : 'inline-block' } },
            props.opened ? treeProps.indicators.opened : treeProps.indicators.closed
        );
    }
    return _react2.default.createElement('div', { onClick: function onClick() {
            return actions.toggleNode(getters.id(node), node);
        }, className: className, style: { display: props.leaf ? 'none' : 'inline-block' } });
};

//converts a flat array to a tree compatible with treeact
var arrayToTree = exports.arrayToTree = function arrayToTree(_array) {
    var _getters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _setters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var getters = _extends({}, defaultGetters, _getters);
    var setters = _extends({}, defaultSetters, _setters);

    var tree = [];
    var map = {}; //hash table used to speed up element lookup during tree building.
    var array = _array.slice(); //make a copy of the array to avoid modifying it.

    var addToParentAndMap = function addToParentAndMap(el) {
        var parentId = getters.parent(el);
        var parentNode = map[parentId];
        setters.addChild(map[parentId], el, getters);
        map[getters.id(el)] = el;
    };
    var parentMapped = function parentMapped(node) {
        return !undef(map[getters.parent(node)]);
    };

    for (var i = 0; i < array.length; i++) {
        var _node = array[i];
        var removeElement = false; //if the element is a root element, or if its parent is already in the map, remove it from the array
        //ensure that every node has the children property
        if (undefOrNull(getters.children(_node))) setters.children(_node);

        if (undefOrNull(getters.parent(_node))) {
            map[getters.id(_node)] = _node;
            tree.push(_node);
            removeElement = true;
        } else if (parentMapped(_node)) {
            addToParentAndMap(_node);
            removeElement = true;
        }

        if (removeElement) {
            array.splice(i, 1);
            /**reassign i because splice modifies the length of the array, causing elements to be skipped.
               counting backwards would fix this, but reverse the sort order and I don't want to force the user to re-sort their data after using this.
            */
            i--;
        }
    }
    while (array.length > 0) {
        var node = array.shift();
        if (parentMapped(node)) {
            addToParentAndMap(node);
        } else {
            array.push(node);
        }
    }
    return tree;
};

function buildActions(component) {
    var isOpen = function isOpen(id) {
        return component.state.openedMap[id] === true;
    };
    var toggleNode = function toggleNode(id, node) {
        component.setState({
            openedMap: _extends({}, component.state.openedMap, _defineProperty({}, id, !isOpen(id)))
        }, function () {
            component.props.callbacks.nodeToggled(node);
        });
    };
    return {
        toggleNode: toggleNode,
        isOpen: isOpen
    };
}

function styleTag(classNames) {
    return _react2.default.createElement(
        'style',
        null,
        '\n                .' + classNames.children + '{\n                    padding-left:10px;\n                }\n                .' + classNames.indicator + '{\n                    margin-right:5px;\n                    width:0;\n                    height:0;\n                    border-style:solid;\n                    border-width:5px 0 5px 8.7px;\n                    border-color:transparent transparent transparent #000000;\n                }\n                .' + classNames.indicator + ':hover{\n                    cursor:pointer;\n                }\n                .' + classNames.node + ':hover{\n                    background-color:#ccc;\n                    cursor:pointer;\n                }\n                .' + classNames.indicatorOpen + '{\n                   transform:rotate(90deg);\n                }\n                .' + classNames.indicatorClosed + '{\n                }\n                '
    );
}

function combineClassNames() {
    return [].filter.call(arguments, function (arg) {
        return arg.trim() !== '';
    }).join(' ');
}

