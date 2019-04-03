import React, { Component, ReactNode, SyntheticEvent } from 'react'
import cx from 'classnames'


class Modal extends Component<IProps> {
    private wrapperRef = React.createRef<HTMLDivElement>()

    /**
     * Check if click is inside <Inner />
     * if not call outer click prop
     * @param e Event Object
     */
    outClick = (e: SyntheticEvent) => {
        
        const wrapper = this.wrapperRef
        const target = e.target as HTMLInputElement
        if (wrapper.current && !wrapper.current.contains(target)) {
            this.props.outClick()
        }
    }

    render() {
        const { shouldShow } = this.props
        return (
            <div
                className={cx('outer', {
                    show: shouldShow,
                    hidden: !shouldShow
                })}
                onClick={this.outClick}
            >

                <div className="inner" ref={this.wrapperRef}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

interface IProps {
    /** One or more elements */
    children: ReactNode
    /** Whether or not the component is at full width/height */
    shouldShow?: boolean
    /** What happens when you click the outside */
    outClick: () => void
}


export default Modal
