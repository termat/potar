import React,{ useState }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Link from '@mui/material/Link';
import { Box } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import Image from 'next/image'
import {handleDialogOpen} from './DataTableDialog';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://twitter.com/t_mat">
        t.matsuoka
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export let handleHelpDialogOpen;
let handleDialogClose;

const closeDialog=()=>{
  handleDialogClose();
  setTimeout(() => {
    handleDialogOpen();
  }, 1000);
}

const img_style = {
  width: "100%" 
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DataTableDialog(props) {
  const [open, setOpen] = useState(props.open);

  handleHelpDialogOpen = () => {
    setOpen(true);
  };

  handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          <DirectionsBikeIcon />
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
          　Potar：ポタリングの記録（自転車走行記録の可視化）
          </Typography>
          <div style={{ flexGrow: 1 }}></div>
          <CloseIcon onClick={handleDialogClose} />
          <Button color="inherit" onClick={handleDialogClose}>
              Close
          </Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:60}}>
          <Image src={'./icons/back2.jpg'} width={1920} height={461} style={img_style} alt={'top'} />
          <Box textAlign="center">
          <h1 style={{fontSize: "24px",margin: "6px"}}><b>Potar ： ポタリングした地域を3D地図で俯瞰するWebアプリです。</b></h1>
          <p style={{fontSize: "18px",margin: "6px"}}>ポタリング（自転車散歩）した地域を俯瞰してみたいと思い作成したWebアプリです<br />
            自転車で走った経路が、3D地図上の俯瞰画像が表示されます。<br />
            実際に走った経路を俯瞰してみると小さな発見があって結構面白いです。<br />
            <Button variant="contained" style={{margin:"10px"}} size="large" component="a" onClick={closeDialog}>　開　始　</Button>
            <br />
             </p>
            <hr />
            <div>
						<h5 style={{fontSize: "14px",margin: "8px"}}>免責事項</h5>
						<p style={{fontSize: "12px",margin: "8px"}}>
							明示、暗黙を問わず本サイトの内容に関してはいかなる保証も適用しません。<br />
							作者は本サイトの利用による損害、損失に対していかなる場合も一切の責任を負いません。<br />
							全てのコンテンツは、内容の合法性・正確性・安全性等、あらゆる点において一切保証しません。<br />
							事前予告無く、コンテンツの提供を中止する可能性があります。<br />
						</p>
            </div>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
