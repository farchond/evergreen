ReactDOM.render(
  <Root data={window.serverData} ></Root>,
  document.getElementById('root')
);

console.log("rendering");

var Alert = ReactBootstrap.Alert;
var Popover = ReactBootstrap.Popover;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Button = ReactBootstrap.Button;

const popoverLeft = (
    <Popover id="popover-positioned-left" title="Popover left">
        <strong>Holy guacamole!</strong> Check this info.
            </Popover>
);

const popoverTop = (
    <Popover id="popover-positioned-top" title="Popover top">
        <strong>Holy guacamole!</strong> Check this info.
            </Popover>
);

const popoverBottom = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
        <strong>Holy guacamole!</strong> Check this info. <a href="/yolo"> text </a>
            </Popover>
);

const popoverRight = (
    <Popover id="popover-positioned-right" title="Popover right">

        <strong>Holy guacamole!</strong> Check this info.
            </Popover>
);


ReactDOM.render((
    <ButtonToolbar>
        <OverlayTrigger trigger="click" placement="left" overlay={popoverLeft}>
              <Button>Holy guacamole!</Button>
                  </OverlayTrigger>

                      <OverlayTrigger trigger="click" placement="top" overlay={popoverTop}>
                            <Button>Holy guacamole!</Button>
                                </OverlayTrigger>
                               
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                                          <Button>Holy guacamole!</Button>
                                              </OverlayTrigger>

                                                  <OverlayTrigger trigger="click" placement="right" overlay={popoverRight}>
                                                        <Button>Holy guacamole!</Button>
                                                            </OverlayTrigger>
                                                              </ButtonToolbar>
), mountNode);
