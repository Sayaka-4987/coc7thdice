import React, { useState } from 'react'
import { Checkbox, InputNumber, Button, List, Space, Layout, Divider } from 'antd';
import 'moment/locale/zh-cn';
import './App.css';
import { Header } from 'antd/lib/layout/layout';

const SVG = () => <svg t="1642497827253" class="icon"
  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2306"
  width="25px" height="25px" vertical-align="super">
  <path d="M910.145163 0H113.854837A114.143809 114.143809 0 0 0 0 113.854837v796.290326a114.143809 114.143809 0 0 0 113.854837 113.854837h796.290326a114.143809 114.143809 0 0 0 113.854837-113.854837V113.854837A114.259397 114.259397 0 0 0 910.145163 0zM331.797268 331.797268a85.362231 85.362231 0 1 1 0-120.674568 85.188847 85.188847 0 0 1 0 120.674568z m240.540016 240.655605a85.362231 85.362231 0 1 1 0-120.674568A85.188847 85.188847 0 0 1 572.163901 572.510667z m240.655605 240.540016a85.362231 85.362231 0 1 1 0-120.674569 85.188847 85.188847 0 0 1 0.057794 120.732363z" p-id="2307" fill="#FFFFFF"></path></svg>

// 生成从1到max_value的随机数
const randomNumber = (max_value) => {
  let result = Math.floor(Math.random() * (max_value) + 1);
  return result;
}

const toAttrString = (arr) => {
  if (arr.length === 9) {
    let res = `力量(STR): ${arr[0]}, 体质(CON): ${arr[1]}, 体型(SIZ): ${arr[2]}, 敏捷(DEX): ${arr[3]}, 外貌(APP): ${arr[4]}, 智力/灵感(INT): ${arr[5]}, 意志(POW): ${arr[6]}, 教育/知识(EDU): ${arr[7]}, 幸运(LUCK): ${arr[8]}`
    return res
  } else {
    let res = `力量(STR): ${arr[0]}, 体质(CON): ${arr[1]}, 体型(SIZ): ${arr[2]}, 敏捷(DEX): ${arr[3]}, 外貌(APP): ${arr[4]}, 智力/灵感(INT): ${arr[5]}, 意志(POW): ${arr[6]}, 教育/知识(EDU): ${arr[7]}`
    return res
  }
}

const App = () => {
  const [includeLuck, setIncludeLuck] = useState(true)
  const [attrTotal, setAttrTotal] = useState(425)
  const [attribution, setAttribution] = useState(["", "", "", "", ""])
  const [diceNumber, setDiceNumber] = useState(1)
  const [dice6, setDice6] = useState([])
  const [dice20, setDice20] = useState([])
  const [dice100, setDice100] = useState([])

  // 生成人物九维属性
  const generateAttr = () => {
    let attr = ["", "", "", "", ""]

    let length = includeLuck ? 9 : 8
    let miu = Math.floor(Number(attrTotal) / length / 5) * 5
    let diff = Number(attrTotal) - miu * length

    for (let i = 0; i < 5; i++) {
      let arr = new Array(length).fill(miu);
      for (let j = 0; j < 5; j++) {
        // 增加属性方差
        let x = randomNumber(length) - 1
        let y = randomNumber(length) - 1
        while (x === y) {
          y = randomNumber(length) - 1
        }
        arr[x] += 5
        arr[y] -= 5
      }
      // 避免出现人类难以达到的属性
      arr[randomNumber(length) - 1] += diff
      let minI = arr.indexOf(Math.min(...arr))
      let maxI = arr.indexOf(Math.max(...arr))
      while (arr[maxI] > 80) {
        arr[minI] += (arr[maxI] - 80)
        arr[maxI] -= (arr[maxI] - 80)
        maxI = arr.indexOf(Math.max(...arr))
        minI = arr.indexOf(Math.min(...arr))
      }
      attr[i] = toAttrString(arr)
    }
    console.log(attr)
    setAttribution(attr)
  }

  const throwDice = (diceNumber) => {
    let [arr6, arr20, arr100] = [new Array(diceNumber).fill(1), new Array(diceNumber).fill(1), new Array(diceNumber).fill(1)]
    for (let i = 0; i < diceNumber; i++) {
      arr6[i] = randomNumber(6)
      arr20[i] = randomNumber(20)
      arr100[i] = randomNumber(100)
    }
    setDice6(arr6)
    setDice20(arr20)
    setDice100(arr100)
  }

  return (
    <Layout className="layout" style={{ height: '100%' }}>
      <Space direction='vertical'>
        <Header >
          <Space size='middle'>
            <SVG></SVG>
            <h1>CoC7th 规则用临时骰子</h1></Space>
        </Header>
        <Layout style={{ padding: '10px 50px' }} className="content">
          <h2>人物卡9维属性生成</h2>
          <div>
            <Space>
              请输入属性点总和：
              <InputNumber min={120} max={640} value={attrTotal} onChange={setAttrTotal} />
              <Checkbox
                checked={includeLuck}
                onChange={(e) => { setIncludeLuck(e.target.checked) }}
              />含幸运
              <Button
                type="primary"
                onClick={() => {
                  generateAttr()
                }}>
                随机5组
              </Button>
            </Space>
          </div>
          <div>
            <br />
            <List
              style={{ backgroundColor: '#FFFFFF' }}
              size="small"
              header={<div>生成结果</div>}
              bordered
              dataSource={attribution}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
          <h2><br></br>掷骰和检定</h2>
          <Space >
            投掷<InputNumber min={1} max={10} size='small' value={diceNumber} onChange={setDiceNumber} />次
            <Button
              type="primary"
              onClick={() => { throwDice(diceNumber) }}>
              掷骰子
            </Button>
          </Space>
          <ul>
            <li>r6骰子：您骰出了<a style={{ color: '#003a8c' }}>{dice6.toString()}</a></li>
            <li>r20骰子：您骰出了<a style={{ color: '#003a8c' }}>{dice20.toString()}</a></li>
            <li>r100骰子：您骰出了<a style={{ color: '#003a8c' }}>{dice100.toString()}</a></li>
          </ul>
        </Layout>
      </Space>
      <Layout style={{ textAlign: 'center', height: '100%' }} >
        <p>
          Copyright © Sayaka-4987 2022<br />
          Powered by React and Ant Design
        </p>
      </Layout>
    </Layout>
  )
}

export default App