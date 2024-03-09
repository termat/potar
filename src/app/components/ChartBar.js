import { LineChart,MarkElement} from '@mui/x-charts/LineChart';
import React, { useState } from 'react';

export let setXYData;
export let setChartVisible;
export let getChartVisible;
export let setCurrentIndex;

export default function ChartBar(){

    const [xydata, setData] = useState({x:[],y:[]}); 
    const [visible, setVisible] = useState("hidden");
    const [currentIndex,setIndex]=useState(0);

    setXYData=(v)=>{
        setData(v);
    };

    setChartVisible=(v)=>{
        setVisible(v);
    }

    getChartVisible=()=>{
        return visible;
    }

    setCurrentIndex=(percent)=>{
        let ii=parseInt(xydata.x.length*percent);
        setIndex(ii);
    }

    return (
        <div style={
            {
                float: "left",
                width: "96%", 
                lineHeight: "120px",
                borderRadius: 4,
                border: "none",
                padding: "0px 5px 0px 5px",
                color: "#fff",
                background: "#ffffff88",
                position: "absolute",
                bottom: 96,
                left: "2%",
                zindex:255,
                opacity:1.0,
                visibility:visible
            }
            }
        >
        <LineChart
            xAxis={[{ data: xydata.x,hideTooltip: true }]}
            series={[
                {
                    data: xydata.y,
                    showMark: ({ index }) => index === currentIndex,
                    area: true,
                },
            ]}
            height={200}
        />
        </div>
   );
}

const onChangeProgress=(value)=>{};

const onChangeVal=(val)=>{

};
