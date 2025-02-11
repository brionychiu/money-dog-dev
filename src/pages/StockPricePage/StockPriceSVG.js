import { useState } from 'react';

// styles
import styles from './StockPrice.module.css'

export const StockPriceSVG = ({HY_price}) => {
    // data
    const name = HY_price? HY_price.name:null
    const open =  HY_price? HY_price.open:null
    const high =  HY_price? HY_price.high:null
    const low =  HY_price? HY_price.low:null
    const close =  HY_price? HY_price.close:null
    const date =  HY_price? HY_price.date:null
    const trancision =  HY_price? HY_price.Transaction:null
    const volume =  HY_price? HY_price.TradingVolume:null

    //---------- init topbar value -------- 
    const [stockDate ,setStockDate] = useState('')
    const [stockOpen, setStockOpen] = useState('')
    const [stockHigh, setStockHigh] = useState('')
    const [stockLow, setStockLow] = useState('')
    const [stockClose, setStockClose] = useState('')
    const [stockVolume, setStockVolume] = useState('')
    const [stockTrancision, setStockTrancision] = useState('')

    // ----------- horizontal line -------------
    let horizontalLine = () => {
        const horiLine = []
        let NumX
        for(let i = 0 ; i < 9; i++){
            NumX = 10+(50*i) 
            horiLine.push(NumX)
        }
        return(horiLine)
    }
    const horiLine = horizontalLine()

    // ----------- Candlestick chart -------------
    let roundDecimal = (val, precision) => {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))
        }
    let candleAndIndex = (high,low,open,close) => {
        let low_min = Math.floor(Math.min(...low))
        low_min = low_min - (low_min*0.01)
        let high_max = Math.ceil(Math.max(...high))
        high_max = high_max + (high_max*0.01)
        let difference = high_max - low_min
        const btw = roundDecimal(difference/8,1)
        //  price index
        const priceIndex = []
        for (let i = 0 ; i < 9 ; i++){
            let a = low_min + btw*i
            a = a.toFixed(1)
            priceIndex.push(a)
        }
        //  candle rectangle 
        const rectX = []
        const rectY = []
        const rectHeight = []
        const fillColor = []
        const lineX = []
        const lineY_1 = []
        const lineY_2 =[]
        let height, numy 
        for(let i=0 ; i<open.length ; i++){
            // rect X 
            const recx = 110+(i*20)
            rectX.push(recx)
            // line X
            const linex = 117+(i*20)
            lineX.push(linex)

            if (open[i]>close[i]){
                // rect Y
                numy = 10+roundDecimal(((priceIndex[8]-open[i])/btw),1 )*50
                numy = numy.toFixed(1)
                rectY.push(numy)
                // rect height
                height = ((open[i]-close[i])/btw)*50
                height = height.toFixed(0)
                rectHeight.push(height)
                // color -red
                fillColor.push("rgb(21,111,27)")

            }else if (open[i]<close[i]){
                // rect Y
                numy = 10+roundDecimal(((priceIndex[8]-close[i])/btw),1)*50
                numy = numy.toFixed(0)
                rectY.push(numy)
                // rect height
                height = ((close[i]-open[i])/btw)*50
                height = height.toFixed(1)
                rectHeight.push(height)
                // color -green
                fillColor.push("rgb(202,8,19)")
            }else{
                // rect Y
                numy = 10+roundDecimal(((priceIndex[8]-close[i])/btw),1)*50
                numy = numy.toFixed(1)
                rectY.push(numy)
                // rect height
                rectHeight.push("1")
                 // color
                fillColor.push("rgb(21,111,27)")

            }
            // line Y-1
            let y1 = 10+(((priceIndex[8]-high[i])/btw)*50)
            y1 = y1.toFixed(1)
            lineY_1.push(y1)
            // line Y-2
            let y2 = 10+(((priceIndex[8]-low[i])/btw)*50)
            y2 = y2.toFixed(1)
            lineY_2.push(y2)
        }

        return {priceIndex,rectX,rectY,rectHeight,fillColor,lineX,lineY_1,lineY_2,btw}
    }
    const priceIndex = candleAndIndex(high,low,open,close).priceIndex
    const maxPrice = priceIndex[8]
    const btw = candleAndIndex(high,low,open,close).btw
    const rectX = candleAndIndex(high,low,open,close).rectX
    const rectY = candleAndIndex(high,low,open,close).rectY
    const fillColor = candleAndIndex(high,low,open,close).fillColor
    const rectHeight = candleAndIndex(high,low,open,close).rectHeight
    const lineX = candleAndIndex(high,low,open,close).lineX
    const lineY_1 = candleAndIndex(high,low,open,close).lineY_1
    const lineY_2 = candleAndIndex(high,low,open,close).lineY_2

    //  --------------- 5MA -----------------
    let MA_5array = (close,maxPrice,lineX,btw) => {
        let MA_5pathY = []
        let MA_5pathX = []
        let b = close.map((e,i,arr) => {
            return ((arr[i]+arr[i+1]+arr[i+2]+arr[i+3]+arr[i+4])/5).toFixed(1)
        })
        b = b.filter(e =>e !== 'NaN')
        b.map((e,i,arr) => {
            // 5MA line-y
            let pathy = 10+((maxPrice-e)/btw)*50
            pathy = pathy.toFixed(1)
            MA_5pathY.push(pathy)
            // 5MA line-x
            let pathx = lineX[4]+(20*i)
            MA_5pathX.push(pathx)
            return MA_5pathY
        })
        // 讓5MA line-y 能stop
        let length = MA_5pathY.length
        MA_5pathY.push(MA_5pathY[length-1])
        return [{MA_5pathY,MA_5pathX}]
    }
   
    const MA_5pathY = MA_5array(close,maxPrice,lineX,btw)[0].MA_5pathY
    const MA_5pathX = MA_5array(close,maxPrice,lineX,btw)[0].MA_5pathX

    //  --------------- 10MA -----------------
    let MA_10array = (close,maxPrice,lineX,btw) => {
        let MA_10pathY = []
        let MA_10pathX = []
        let b = close.map((e,i,arr) => {
            return ((arr[i]+arr[i+1]+arr[i+2]+arr[i+3]+arr[i+4]+arr[i+5]+arr[i+6]
                +arr[i+7]+arr[i+8]+arr[i+9])/10).toFixed(1)
        })
        b = b.filter(e =>e !== 'NaN')
        b.map((e,i,arr) => {
            // 10MA line-y
            let pathy = 10+((maxPrice-e)/btw)*50
            pathy = pathy.toFixed(1)
            MA_10pathY.push(pathy)
            // 10MA line-x
            let pathx = lineX[9]+(20*i)
            MA_10pathX.push(pathx)
            return MA_10pathY
        })
        // 讓10MA line-y 能stop
        let length = MA_10pathY.length
        MA_10pathY.push(MA_10pathY[length-1])
        return [{MA_10pathY,MA_10pathX}]
    }
   
    const MA_10pathY = MA_10array(close,maxPrice,lineX,btw)[0].MA_10pathY
    const MA_10pathX = MA_10array(close,maxPrice,lineX,btw)[0].MA_10pathX

    //  --------------- 20MA -----------------
    let MA_20array = (close,maxPrice,lineX) => {
        let MA_20pathY = []
        let MA_20pathX = []
        let b = close.map((e,i,arr) => {
            return ((arr[i]+arr[i+1]+arr[i+2]+arr[i+3]+arr[i+4]+arr[i+5]+arr[i+6]
                +arr[i+7]+arr[i+8]+arr[i+9]+arr[i+10]+arr[i+11]+arr[i+12]
                +arr[i+13]+arr[i+14]+arr[i+15]+arr[i+16]+arr[i+17]+arr[i+18]
                +arr[i+19])/20).toFixed(1)
        })
        b = b.filter(e =>e !== 'NaN')
        b.map((e,i) => {
            // 20MA line-y
            let pathy = 10+((maxPrice-e)/btw)*50
            pathy = pathy.toFixed(1)
            MA_20pathY.push(pathy)
            // 20MA line-x
            let pathx = lineX[19]+(20*i)
            MA_20pathX.push(pathx)
            return MA_20pathY
        })
        // 讓20MA line-y 能stop
        let length = MA_20pathY.length
        MA_20pathY.push(MA_20pathY[length-1])
        return [{MA_20pathY,MA_20pathX}]
    }
   
    const MA_20pathY = MA_20array(close,maxPrice,lineX,btw)[0].MA_20pathY
    const MA_20pathX = MA_20array(close,maxPrice,lineX,btw)[0].MA_20pathX

    // -------- trading volume index & rectangle-----------
    let tradingVolmeIndex = (volume) => {
        let maxV =  Math.max(...volume)
        maxV = maxV + maxV*0.1
        let minV = Math.min(...volume)
        minV = minV - minV*0.1
        const difference = maxV - minV
        let btw =  Math.round(difference/3)
        // trading volume index
        const volumeIndex = []
        for (let i = 0 ; i < 3 ; i++){
            let a = minV + btw*i
            a = a.toFixed(0)
            volumeIndex.push(a)
        }
        // trading volume rectangle
        const volumeRect = []
        const volumeHeight = []
        let heightNum , rectY
        for(let i = 0 ; i<volume.length ; i++){
            heightNum = (volume[i]-volumeIndex[0])/btw*56
            heightNum = heightNum.toFixed(0)
            volumeHeight.push(heightNum)
            rectY = 580-heightNum
            volumeRect.push(rectY)
        }
        return {volumeIndex,volumeHeight,volumeRect}
    }
    
    const volumeIndex = tradingVolmeIndex(volume).volumeIndex
    const volumeHeight = tradingVolmeIndex(volume).volumeHeight
    const volumeRect = tradingVolmeIndex(volume).volumeRect

    // ------- checkbox ----------
    const [fiveMA,setFiveMA] = useState(true)
    const [tenMA,setTenMA] = useState(true)
    const [twentyMA,setTwentyMA] = useState(true)

    const handleClick = (e) => {
        e.target.style.stroke = "rgb(251,226,45)"
        e.target.style.strokeWidth = "3"
    }

    return(
        <div className={styles['price-container']}>
            <div className={styles['k-SVG']}>
                <div className={styles.title}>
                    <span>2022年{name}股價走勢</span>
                    <div className={styles.blue}></div>
                    <span>5日線</span>
                    <div className={styles.purple}></div>
                    <span>雙週線</span>
                    <div className={styles.yellow}></div>
                    <span>月線</span>
                </div>
                <div className={styles['price-detail']}>
                    <span>日期：</span>
                    <div>{stockDate}</div>
                    <span>開盤價：</span>
                    <div>{stockOpen}元</div>
                    <span>最高價：</span>
                    <div>{stockHigh}元</div>
                    <span>最低價：</span>
                    <div>{stockLow}元</div>
                    <span>收盤價：</span>
                    <div>{stockClose}元</div>
                    <span>成交金額：</span>
                    <div>{stockVolume}百萬</div>
                    <span>成交筆數：</span>
                    <div>{stockTrancision}筆</div>
                </div>
                <div className={styles.kChart}>
                    <svg 
                        cursor="pointer"
                        width="2170" height="600"
                        viewBox="0 0 2170 600"
                        xmlns="<http://www.w3.org/2000/svg>"
                        overflow="visisble"> 
                        {/* unit */}
                        <text x="130" y="30" fill="rgb(106,106,106)" fontSize='13'>單位:元</text>
                        <text x="130" y="430" fill="rgb(106,106,106)" fontSize='13'>單位:百萬</text>
                        <text x="1988" y="30" fill="rgb(106,106,106)" fontSize='13'>單位:元</text>
                        <text x="1988" y="430" fill="rgb(106,106,106)" fontSize='13'>單位:百萬</text>

                        {/* date line */}
                        <line x1="117" y1="400" x2="117" y2="420" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="105" y="440" fill="rgb(106,106,106)" fontSize='13'>1月</text>
                        <line x1="487" y1="400" x2="487" y2="420" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="465" y="440" fill="rgb(106,106,106)" fontSize='13'>2月</text>
                        <line x1="777" y1="400" x2="777" y2="420" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="765" y="440" fill="rgb(106,106,106)" fontSize='13'>3月</text>
                        <line x1="1237" y1="400" x2="1237" y2="420" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="1225" y="440" fill="rgb(106,106,106)" fontSize='13'>4月</text>
                        <line x1="1617" y1="400" x2="1617" y2="420" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="1605" y="440" fill="rgb(106,106,106)" fontSize='13'>5月</text>

                        {/* daily price index */}
                        {/* horizontal + straight line */}
                        <line x1="80" y1="10" x2="80" y2="410" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="2068" y1="10" x2="2068" y2="410" stroke='rgb(226,226,226)' strokeWidth='1' />
                        {horiLine.map((item,index) => (
                            <g key={item}>
                                <line x1="80" y1={item} x2="2068" y2={item} stroke='rgb(226,226,226)' strokeWidth='1' />
                                <text x="40" y={425-item} fill="rgb(106,106,106)" fontSize='13'>{priceIndex[index]}</text>
                                <text x="2078" y={425-item} fill="rgb(106,106,106)" fontSize='13'>{priceIndex[index]}</text>
                            </g>
                        ))}
    
                        {twentyMA && (
                            <>
                            {MA_20pathX.map((item,index) => (
                                <line key={index}
                                x1={item} y1={MA_20pathY[index]} x2={item+20} y2={MA_20pathY[index+1]} 
                                stroke='rgb(251,192,45)' strokeWidth='2' strokeLinecap="round"/>
                            ))}
                            </>
                        )}
                        {tenMA && (
                            <>
                            {MA_10pathX.map((item,index) => (
                                <line key={index}
                                x1={item} y1={MA_10pathY[index]} x2={item+20} y2={MA_10pathY[index+1]} 
                                stroke='rgb(103,58,183)' strokeWidth='2' strokeLinecap="round"/>
                            ))}
                            </>
                        )}
                        {fiveMA && (
                            <>
                            {MA_5pathX.map((item,index) => (
                                <line key={index}
                                x1={item} y1={MA_5pathY[index]} x2={item+20} y2={MA_5pathY[index+1]} 
                                stroke='rgb(38, 198, 218)' strokeWidth='2' strokeLinecap="round"/>
                            ))}
                            </>
                        )}
                        
                        {lineX.map((item,index) => (
                            <line key={index}
                           
                            x1={item} y1={lineY_1[index]} x2={item} y2={lineY_2[index]} stroke='rgb(93, 93, 93)' strokeWidth='2'/>
                        ))}
                        {rectX.map((item,index) => (
                            <rect key={index} 
                                onMouseMove={() => {
                                    setStockDate(date[index]) 
                                    setStockOpen(open[index])
                                    setStockHigh(high[index])
                                    setStockLow(low[index])
                                    setStockClose(close[index])
                                    setStockVolume(volume[index])
                                    setStockTrancision(trancision[index])
                                    }}
                                x={item} y={rectY[index]} onClick={handleClick}
                                width="15" height={rectHeight[index]} fill={fillColor[index]}/>
                        ))}
                        {/* trading volume index */}
                        <line x1="80" y1="580" x2="2068" y2="580" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="80" y1="400" x2="80" y2="580" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="2068" y1="400" x2="2068" y2="580" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="75" y1="468" x2="85" y2="468" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="75" y1="524" x2="85" y2="524" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="2063" y1="468" x2="2073" y2="468" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <line x1="2063" y1="524" x2="2073" y2="524" stroke='rgb(226,226,226)' strokeWidth='1' />
                        <text x="30" y="471" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[2]}</text>
                        <text x="30" y="527" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[1]}</text>
                        <text x="30" y="580" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[0]}</text>
                        <text x="2078" y="471" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[2]}</text>
                        <text x="2078" y="527" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[1]}</text>
                        <text x="2078" y="580" fill="rgb(106,106,106)" fontSize='13'>{volumeIndex[0]}</text>
                        
                        {/* trading volume rectangle */}
                        {volumeHeight.map((item,index) => (
                            <rect key={index} 
                            onClick={handleClick}
                            x={110+index*20} y={volumeRect[index]} 
                            width="18" height={item} fill={fillColor[index]}/>
                        ))}

                    </svg>
                </div>
                
                <span className={styles.checkbox}>
                    <input id='fiveMA' type='checkbox' vaule='5日線'onChange={() => setFiveMA(!fiveMA)} defaultChecked={fiveMA}/>
                    <label htmlFor='fiveMA'>5日線</label>
                    <input id='tenMA' type='checkbox' vaule='雙週線' onChange={() => setTenMA(!tenMA)} defaultChecked={tenMA} />
                    <label htmlFor='tenMA'>雙週線</label>
                    <input id='twentyMA' type='checkbox' vaule='月線'onChange={() => setTwentyMA(!twentyMA)} defaultChecked={twentyMA}/>
                    <label htmlFor='twentyMA'>月線</label>
                </span>
            

            </div>

            
    
        </div>
        )
}