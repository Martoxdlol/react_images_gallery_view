import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-history-pro";
import PhotoView from "./PhotoView";

export default function PhotoSwitcher({ width, height }) {

    const [expanded, setExpanded] = React.useState(false)
    const [small, setSmall] = React.useState(true)

    // SMALL: true, EXPANEED: false = closed
    // SMALL: true, EXPANEED: true = opening
    // SMALL: false, EXPANEED: true = opened
    // SMALL: false, EXPANEED: false = closing

    const [offsetTop, setOffsetTop] = React.useState(null)
    const [offsetLeft, setOffsetLeft] = React.useState(null)

    const ref = useRef(null)

    const _height = expanded ? '100vh' : height
    const _width = expanded ? '100vw' : width

    const history = useHistory()

    function expandImage() {
        if (expanded) return
        const elemBounds = ref.current.getBoundingClientRect()
        setOffsetTop(elemBounds.y)
        setOffsetLeft(elemBounds.x)
        setExpanded(true)
    }


    const style = {
        position: 'relative',
        top: 0,
        left: 0,
    }

    if (expanded === small) {
        style.transition = 'all 0.2s ease-in-out'
    }

    if (!(!expanded && small)) {
        style.zIndex = 2;
    }
    if (expanded) {
        style.top = -offsetTop
        style.left = -offsetLeft
        style.zIndex = 2;
    }

    useEffect(() => {
        if (expanded) {
            history.push(`/photo/1`)
            return history.block((e, unblock) => {
                e.setContinue(true)
                unblock()
                setExpanded(false)
            }, { doNotPreventExit: true })
        }
    }, [expanded])

    useEffect(() => {
        // Is opening 
        if (expanded && small) {
            console.log("OPENING")
            let t = setTimeout(() => {
                setSmall(false)
            }, 200)
            return () => clearTimeout(t)
        }
    }, [expanded, small])

    useEffect(() => {
        // Is closing
        if (!small && !expanded) {
            console.log("CLOSING")
            let t = setTimeout(() => {
                setSmall(true)
            }, 200)
            return () => clearTimeout(t)
        }
    }, [small, expanded])

    return (
        <div style={{ width, height }}>
            <div style={style} ref={ref} onClick={expandImage}>
                <PhotoView width={_width} height={_height} animated={expanded == small} objectFit={small && !expanded ? 'cover' : 'contain'} />
            </div>
        </div>
    );
}