(function() {
	'use strict';

	dojo.provide('SelectAllTextBox.widget.SelectAllTextBox');
		
	dojo.declare('SelectAllTextBox.widget.SelectAllTextBox', [ mxui.widget._WidgetBase, dijit._TemplatedMixin ], {

		templateString : '<div class="SelectAllTextBox-container"><input dojoAttachPoint="inputBox" class="mendixFormView_textBox form-control SelectAllTextBox-input" type="text"></div>',

		_contextGuid			: null,
		_contextObj				: null,
		_objSub					: null,
		 
		// DOJO.WidgetBase -> PostCreate is fired after the properties of the widget are set.
		postCreate: function() {
			// Setup events
			dojo.on(this.inputBox, 'click', dojo.hitch(this, function(){
				this.inputBox.focus();
				this.inputBox.select();
			}));
		},

		update : function (obj, callback) {
			if(typeof obj === 'string'){
				this._contextGuid = obj;
				mx.data.get({
					guids    : [obj],
					callback : dojo.hitch(this, function (objArr) {
						if (objArr.length === 1)
							this._loadData(objArr[0]);
						else
							console.log('Could not find the object corresponding to the received object ID.')
					})
				});
			} else if(obj === null){
				// Sorry no data no show!
				console.log('Whoops... the SelectAllTextBox has no data!');
			} else {
				// Attach to data refresh.
				if (this._objSub)
					this.unsubscribe(this._objSub);

				this._objSub = mx.data.subscribe({
					guid : obj.getGuid(),
					attr : this.displayAttr,
					callback : dojo.hitch(this, this.update)
				});
				// Load data
				this._loadData(obj);
			}

			if(typeof callback !== 'undefined') {
				callback();
			}
		},

		_loadData : function (obj) {
			this.inputBox.value = obj.get(this.displayAttr);
		}
	});
})();