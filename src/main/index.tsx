import * as React from 'react'
import { render } from 'react-dom'
import Drag from './components/Drag'
import { IItem } from './components/Drag'

import './style.scss'


// type Iterm = {
//     objectId: string
//     text?: string
//     extra?: {
//         key: string
//         value: string
//     }
// }

interface IProps {
    // 渲染id
    id: string
    // 开启调试
    isDev: boolean
    // 左侧问卷问题列表
    items: IItem[]
    //右侧表格组装列表
    selected: IItem[]
    // 获取问卷结果
    submit: () => void
}

const drag = ({
    id,
    isDev,
    selected,
    items,
    submit
}: IProps) => {
    if (!id) alert('请先创建渲染节点')
    const root = document.getElementById(id)
    if (root) {
        render(<Drag
            items={items}
            selected={selected}
            isDev={isDev}
            submit={submit}
        />, root)
    } else {
        alert(`页面不存在渲染节点，请创建<div id="${id}"></div>节点`);
    }
}


(window as any).drag = drag