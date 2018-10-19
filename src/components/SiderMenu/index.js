import 'rc-drawer/assets/index.css';
import React from 'react';
import Drawer from 'rc-drawer';
import SiderMenu from './SiderMenu';

const SiderMenuWrapper = props =>
  props.isMobile ? (
    <Drawer
      parent={null}
      level={null}
      iconChild={null}
      open={!props.collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
      onHandleClick={()=>{
        props.onCollapse(!props.collapsed);
      }}

      width="256px"
    >
      <SiderMenu {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );

export default SiderMenuWrapper;
