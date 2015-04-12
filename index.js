var Events = require('ampersand-events');
var assign = require('lodash.assign');
var isEqual = require('lodash.isequal');
var isFunction = require('lodash.isfunction');


module.exports = assign(Events, {
    // proxy method for this.registerListeners. register listeners to other event emitters
	_registerListeners: function(props, state) {
		if (isFunction(this.registerListeners)) {
			return this.registerListeners.apply(this, arguments);
		}

		return this;

	},

	// proxy method for this.deregisterListeners. deregister listeners to other event emitters, when non passed, stops listening to all
	_deregisterListeners: function(props, state) {
		if (isFunction(this.deregisterListeners)) {
			return this.deregisterListeners.apply(this, arguments);
		}

		this.stopListening();

		return this;
	},

	// Lifecycle management
	// --------------------

	componentDidMount: function() {
		this._registerListeners(this.props, this.state);
	},

	componentWillUnmount: function() {
		this._deregisterListeners(this.props, this.state);
	},

	componentWillReceiveProps: function(newProps) {
		var oldProps = this.props;
		var state = this.state;
		if (isEqual(oldProps, newProps)) return;

		this._deregisterListeners(oldProps, state);
		this._registerListeners(newProps, state);
	},

	componentDidUpdate: function(oldProps, oldState) {
		// assume that if we updated, props or state have changed
		this._deregisterListeners(oldProps, oldState);
		this._registerListeners(this.props, this.state);
	}
});
