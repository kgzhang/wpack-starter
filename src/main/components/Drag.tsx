import * as React from "react"
import cx from 'classnames'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DroppableProvided,
    DraggableProvided,
    DroppableStateSnapshot,
    DraggableStateSnapshot,
    DraggingStyle,
    NotDraggingStyle,
    DropResult,
    DraggableLocation
} from 'react-beautiful-dnd'
import Modal from './Modal'

import { Drag, Cross, FileAdd } from './Icons'

type DraggableStyle = DraggingStyle | NotDraggingStyle | undefined

// 在同column进行移动
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    // 拷贝源数据
    const result = Array.from(list)
    // 取出移动item
    const [removed] = result.splice(startIndex, 1)
    // 插入移动item
    result.splice(endIndex, 0, removed)
    return result
}


const move = (source: any[], detination: any[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {

    const sourceClone = Array.from(source)
    const destClone = Array.from(detination)

    const [removed] = sourceClone.splice(droppableSource.index, 1)
    destClone.splice(droppableDestination.index, 0, removed)

    const result: Record<string, any[]> = {}

    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone
    return result
}

const randomId = () => Math.ceil(Math.random() * 10000)

interface IExtra {
    id: number
    key: string
    value: string
}

export interface IItem {
    objectId: string
    text?: string,
    extra?: {
        key: string,
        value: string
    }[]
}

interface IProps {
    // 开启调试
    isDev?: boolean
    // 左侧问卷问题列表
    items?: IItem[]
    //右侧表格组装列表
    selected?: IItem[]
    // 获取问卷结果
    submit: any
}

interface IState {
    items: IItem[]
    selected: IItem[]
    showModal: boolean
    activeId: string | null
    formula: string
    extraItems: IExtra[]
}

/**
 * FormDrag component
 * @since v1.0
 * @author [Kaige Zhang](zhangkeger@gmail.com)
 */

class FormDrag extends React.Component<IProps, IState> {

    state = {
        items: this.props.items || [],
        selected: this.props.selected || [],
        showModal: false,
        activeId: null,
        formula: '',
        extraItems: []
    }


    componentDidMount () {
        console.log(this.state.selected)
    }

    


    // handleSearch = debounce(() => {
    //     let { selected } = this.state
    //     let number = Math.ceil(Math.random() * 10)
    //     let items = getItems(number, number)

    //     // 这一步是为了去重，防止一个列表内部有两个id相同的item, 导致排序混乱

    //     items = items.filter(item => selected.findIndex((select: IItem) => select.id === item.id) < 0)
    //     this.setState({
    //         items
    //     })
    // }, 500)

    handleOutClick = () => {
        this.setState({
            showModal: false,
            activeId: null,
            extraItems: []
        })
    }

    handleAddInfo = (id: string) => {
        // 添加modal层，让用户添加信息
        let { selected } = this.state
        let item: IItem | undefined = selected.find((item: IItem) => item.objectId === id)
        let extraItems = item ? (item.extra || []) : []
        // @ts-ignore
        extraItems.map(item => item.id = randomId())
        // debugger


        // @ts-ignore
        this.setState({
            showModal: true,
            activeId: id,
            extraItems
        })
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        this.setState({ [e.target.name]: e.target.value })
    }

    handleExtraSubmit = () => {

        // 为了不弄脏数据，故把修改数据存到其他地方
        let { activeId, selected, extraItems } = this.state
        // @ts-ignore
        let index = selected.findIndex(select => select.objectId === activeId)

        // debugger

        if (index >= 0 && extraItems.length > 0) {
            // @ts-ignore
            selected[index].extra = extraItems.map((item: IExtra) => ({
                key: item.key,
                value: item.value
            }))
        }


        this.setState({
            activeId: null,
            selected,
            extraItems: [],
            showModal: false
        })
    }
    // 从选择组删除的内容应该回到来源组
    handleDeleteItem = (index: number) => {

        let { selected, items } = this.state

        let [deleted] = selected.splice(index, 1)

        items.push(deleted)

        this.setState({
            items,
            selected
        })
    }

    handleSubmit = (e: any) => {
        e.preventDefault()

        let { selected, formula } = this.state


        let form = selected.map((select: IItem) => ({
            objectId: select.objectId,
            extra: select.extra ? select.extra: null
        }))

        let result = {
            form,
            formula
        }
        // alert(JSON.stringify(result, null, 2))

        this.props.submit(result)
    }
    onDragEnd = (result: DropResult) => {
        const { source, destination } = result

        // 超出 droppable范围
        if (!destination) {
            return
        }
        // 组内操作
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            )

            let state = { items }

            if (source.droppableId === 'drop2') {
                // @ts-ignore
                state = { selected: items }
            }

            this.setState(state)
        } else {
            // 组间操作
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            )


            this.setState({
                items: result.drop1,
                selected: result.drop2
            })
        }
    }

    // @ts-ignore
    getList = (id: string) => this.state[this.id2List[id]]

    id2List = {
        drop1: 'items',
        drop2: 'selected'
    }

    addExtraItem = () => {
        this.setState(({ extraItems }) => (
            {
                extraItems: [
                    ...extraItems,
                    {
                        // 增加随机ID解决React key的问题
                        id: randomId(),
                        key: '',
                        value: ''
                    }
                ]
            }
        ))
    }

    removeExtraItem = (id: number) => {
        let { extraItems } = this.state
        let index = extraItems.findIndex((item: IExtra) => item.id === id)
        extraItems.splice(index, 1)

        this.setState({
            extraItems
        })
    }

    onExtraKeyChange = (id: number, e: React.ChangeEvent<HTMLInputElement>, type: keyof (IExtra)) => {
        let { extraItems } = this.state
        let index = extraItems.findIndex((item: IExtra) => item.id === id)
        // @ts-ignore
        extraItems[index][type] = e.target.value
        this.setState({
            extraItems
        })
    }

    render() {
        const {
            extraItems
        } = this.state
        return (
            <>
                <DragDropContext
                    onDragEnd={this.onDragEnd}
                >

                    <div className="wrapper">

                        <div className="questions">

                            <Droppable
                                droppableId="drop1"
                                isDropDisabled
                            >

                                {
                                    (
                                        provided: DroppableProvided,
                                        snapshot: DroppableStateSnapshot
                                    ) => (
                                            <div
                                                ref={provided.innerRef}
                                            >

                                                {/* <div className="input-group">
                                                    <label className="label">题库搜索</label>
                                                    <div className="input-wrapper">
                                                        <input className="input text" type="search" onChange={this.handleSearch} />
                                                        <Search />
                                                    </div>
                                                </div> */}


                                                {
                                                    this.state.items.map((item: IItem, index) => (
                                                        <Draggable
                                                            key={item.objectId}
                                                            draggableId={item.objectId}
                                                            index={index}
                                                        >
                                                            {
                                                                (
                                                                    provided: DraggableProvided,
                                                                    snapshot: DraggableStateSnapshot
                                                                ) => (

                                                                        <div className={cx('item', {
                                                                            dragging: snapshot.isDragging
                                                                        })}
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            style={provided.draggableProps.style}
                                                                        >
                                                                            <div className="handler" {...provided.dragHandleProps}>
                                                                                <Drag />
                                                                            </div>
                                                                            {item.text}
                                                                        </div>
                                                                    )
                                                            }
                                                        </Draggable>
                                                    ))
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )
                                }
                            </Droppable>

                        </div>

                        <div className="form-wrapper">

                            <Droppable
                                droppableId="drop2"
                            >
                                {(
                                    provided: DroppableProvided,
                                    snapshot: DroppableStateSnapshot
                                ) => (

                                        <div
                                            className={
                                                cx('list', {
                                                    'over': snapshot.isDraggingOver
                                                })
                                            }
                                            ref={provided.innerRef}
                                        >
                                            {
                                                this.state.selected.map((item: IItem, index) => (
                                                    <Draggable
                                                        key={item.objectId}
                                                        draggableId={item.objectId}
                                                        index={index}
                                                    >
                                                        {
                                                            (
                                                                provided: DraggableProvided,
                                                                snamshot: DraggableStateSnapshot
                                                            ) => (
                                                                    <div
                                                                        className={cx("item item-selected", {
                                                                            dragging: snamshot.isDragging
                                                                        })}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        style={provided.draggableProps.style}
                                                                    >
                                                                        {item.text || item.objectId}
                                                                        <div className="arrange">
                                                                            <div  {...provided.dragHandleProps}>
                                                                                <Drag />
                                                                            </div>
                                                                            <div
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => this.handleAddInfo(item.objectId)}
                                                                            >
                                                                                <FileAdd />
                                                                            </div>
                                                                            <div
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => this.handleDeleteItem(index)}
                                                                            >
                                                                                <Cross />
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                )
                                                        }
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                            </Droppable>

                            <div className="input-group">
                                <h5>公式输入</h5>
                                <textarea className="input textaread" name="formula" onChange={this.handleChange} />
                            </div>

                            <button className="button" onClick={this.handleSubmit}>提交数据</button>
                        </div>
                    </div>
                </DragDropContext>

                <Modal
                    shouldShow={this.state.showModal}
                    outClick={this.handleOutClick}
                >

                    <div className="modal-form">
                        <h4>填写额外信息</h4>

                        <div>
                            <button onClick={this.addExtraItem} className="handle-button">
                                +
                            </button>
                        </div>

                        {
                            extraItems.map((item: IExtra, index) => (
                                <div className="extra-wrapper" key={item.id}>
                                    <div>
                                        <input type="text" className="input text" value={item.key} onChange={(e) => this.onExtraKeyChange(item.id, e, 'key')} />
                                    </div>

                                    <div>
                                        <input type="text" className="input text" value={item.value} onChange={(e) => this.onExtraKeyChange(item.id, e, 'value')} />
                                    </div>

                                    <span className="remove" onClick={() => this.removeExtraItem(item.id)}>
                                        <button className="handle-button">
                                            -
                                        </button>
                                    </span>
                                </div>
                            ))
                        }
                        <button className="button" onClick={this.handleExtraSubmit}>确认</button>
                    </div>

                </Modal>
            </>
        )
    }
}


export default FormDrag
