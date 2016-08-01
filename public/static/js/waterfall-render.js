ReactDOM.render(
  React.createElement(Root, {data: window.serverData}),
  document.getElementById('root')
);

console.log("rendering");

var Alert = ReactBootstrap.Alert;
var Popover = ReactBootstrap.Popover;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Button = ReactBootstrap.Button;

const popoverLeft = (
    React.createElement(Popover, {id: "popover-positioned-left", title: "Popover left"}, 
        React.createElement("strong", null, "Holy guacamole!"), " Check this info."
            )
);

const popoverTop = (
    React.createElement(Popover, {id: "popover-positioned-top", title: "Popover top"}, 
        React.createElement("strong", null, "Holy guacamole!"), " Check this info."
            )
);

const popoverBottom = (
    React.createElement(Popover, {id: "popover-positioned-bottom", title: "Popover bottom"}, 
        React.createElement("strong", null, "Holy guacamole!"), " Check this info. ", React.createElement("a", {href: "/yolo"}, " text ")
            )
);

const popoverRight = (
    React.createElement(Popover, {id: "popover-positioned-right", title: "Popover right"}, 

        React.createElement("strong", null, "Holy guacamole!"), " Check this info."
            )
);


ReactDOM.render((
    React.createElement(ButtonToolbar, null, 
        React.createElement(OverlayTrigger, {trigger: "click", placement: "left", overlay: popoverLeft}, 
              React.createElement(Button, null, "Holy guacamole!")
                  ), 

                      React.createElement(OverlayTrigger, {trigger: "click", placement: "top", overlay: popoverTop}, 
                            React.createElement(Button, null, "Holy guacamole!")
                                ), 
                               
                                    React.createElement(OverlayTrigger, {trigger: "click", placement: "bottom", overlay: popoverBottom}, 
                                          React.createElement(Button, null, "Holy guacamole!")
                                              ), 

                                                  React.createElement(OverlayTrigger, {trigger: "click", placement: "right", overlay: popoverRight}, 
                                                        React.createElement(Button, null, "Holy guacamole!")
                                                            )
                                                              )
), mountNode);
