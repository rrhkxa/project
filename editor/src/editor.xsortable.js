
define(function(require,exports,module){
	var $=require("jquery");
    require("jqueryUi");
    module.exprots=window.widgetsSortable = $.widget( "ui.xsortable", $.ui.sortable, {
        version: "1.0.0",
        widgetEventPrefix: "xsort",
        ready: false,
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000,

            // Callbacks
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _mouseStart: function( event, overrideHandle, noActivation ) {
            this._super(event, overrideHandle, noActivation);
            this._updateItems();
        },

        _updateItems:function(){
            var item;
            for ( var i = this.items.length - 1; i >= 0; i-- ) {
                item = this.items[ i ];
                var itemElement = item.item[ 0 ];
                item.top=$(itemElement).offset().top;
            }
        }

    } );
});