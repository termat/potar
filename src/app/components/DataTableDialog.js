import React,{ useState }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { loadData,itemData,stop} from './Mappanel';
import { endRunning } from './ControlBar';
import Image from 'next/image';
import * as d3 from 'd3';
import { useSwipeable } from "react-swipeable";

const imagePrePage=8;

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export let handleDialogOpen;
export let handleDialogClose;
export let getTripData;
export let setUpPage;
let handleChange;

export const jumpData=(p)=>{
  d3.json("./geojson/"+p)
  .then(function(data){
    stop();
    endRunning();
    handleDialogClose();
    setTimeout(loadData(data),500);
  })
  .catch(function(error){
    // エラー処理
  });
}

export default function DataTableDialog(props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemList, setData] = useState([]);
  const [colnum,setColnum]= useState(4);

  const handlers = useSwipeable({
    onSwipedLeft: () => {handleChange(null,Math.max(1,page-1))},
    onSwipedRight: () => {handleChange(null,Math.min(Math.ceil(itemData.length/imagePrePage),page+1))},
    delta: 10, 
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  handleDialogOpen = () => {
    const mql1 = window.matchMedia("(orientation: landscape)");
    if(mql1.matches){
      setColnum(4);
    }else{
      setColnum(2);
    }
    setOpen(true);
    handleChange(null,1);
   };

  handleDialogClose = () => {
    setOpen(false);
  };

  handleChange = (e, p) => {
    setPage(p);
    p=p-1;
    let tmp=[];
    let tp=p*imagePrePage;
    for(let i=0;i<imagePrePage;i++){
      let ll=tp+i;
      if(ll<itemData.length){
        tmp[i]=itemData[ll]
      }
    }
    setData(tmp);
  };

  return (
    <div {...handlers}>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          <Pagination
              color="primary" 
              count={Math.ceil(itemData.length/imagePrePage)}
              page={page}
              onChange={handleChange}
              renderItem={(item) => (
              <PaginationItem
                style={{ fontSize: `18px` }}
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
          <div style={{ flexGrow: 1 }}></div>
          <CloseIcon onClick={handleDialogClose} />
          <Button color="inherit" onClick={handleDialogClose}>
              Close
          </Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:70}}>
          <Box textAlign="center">
          <ImageList cols={colnum}>
        {itemList.map((item) => (
          <ImageListItem key={item.no}>
            <Image
              src={"./images/"+item.img}
              alt={item.title}
              width={640}
              height={480}
              loading="lazy"
              onClick={() => jumpData(item.json)}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.date}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
 //                 onClick={()=>clip(item.json)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
