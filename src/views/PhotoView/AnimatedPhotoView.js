import { useEffect, useRef, useState } from "react"
import AspectRatio from "../../AspectRatio"
export class AnimateFromReferenceInstance {
    constructor(divRef) {
        this._ref = divRef
    }

    get elementBounds() {
        return this._ref.current.getBoundingClientRect()
    }

    get x() {
        return this.elementBounds.x
    }

    get y() {
        return this.elementBounds.y
    }

    get width() {
        return this._ref.current.offsetWidth
    }

    get height() {
        return this._ref.current.offsetHeight
    }
}

export class AnimatedPhotoViewController {
    setControls(photoViewControls) {
        // Controls:
        // {
        //     openView(source, animateFrom?)
        // }
        this._openView = photoViewControls.openView;
    }

    openView(source, animateFromReference) {
        // animateFromReference: AnimateFromReferenceInstance { get x, get y, get width, get height }
        this._openView(source, animateFromReference);
    }
}


function useWindowSize() {
    const [bodyWidth, setBodyWidth] = useState(global?.innerWidth || 1000)
    const [bodyHeight, setBodyHeight] = useState(global?.innerHeight || 1000)

    useEffect(() => {
        const f = (e) => {
            setBodyWidth(global?.innerWidth)
            setBodyHeight(global?.innerHeight)
        }
        window.addEventListener('resize', f)
        return () => window.removeEventListener('resize', f)
    }, [])
    return [bodyWidth, bodyHeight]
}

function useUpdate() {
    // updating will be true for one render cycle
    const [updating, setUpdating] = useState(false)
    // set updating to true and trigger an async immediate re-render
    const update = (cb) => {
        setUpdating(true)
        setTimeout(() => {
            setUpdating(false)
            // it also can recive a callback to execute when updating
            cb && cb()
        }, 0)
    }
    return [updating, update]
}


export default function AnimatedPhotoView({ controller }) {
    // Is image visible? Is true even when opening and closing
    const [visible, setVisible] = useState(false)
    // Is animating the opening
    const [opening, setOpening] = useState(false)
    // Is animating the closing
    const [closing, setClosing] = useState(false)
    // Origin from image opening or destination when closing
    const [animationTarget, setAnimationTarget] = useState(null)
    // Is either closing or opening
    const animating = closing || opening
    // Animation duration
    const duration = 2000
    // Updated body width and height
    const [bodyWidth, bodyHeight] = useWindowSize()
    // Current loaded image
    const image = useRef(null)

    // It will be called when starting to open/close the view
    const [updating, update] = useUpdate()

    // Set constrols to controller, this enables the controller to open/close the view
    useEffect(() => {
        controller.setControls({ openView })
    }, [controller])

    function openView(source, animateFrom) {
        if (animating) return
        setVisible(true)
        setOpening(true)
        setAnimationTarget(animateFrom)
        update()
        setTimeout(() => setOpening(false), duration)
    }

    function closeView() {
        if (animating) return
        update()
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setVisible(false)
        }, duration)
    }

    let _width = bodyWidth
    let _height = bodyHeight

    let _left = 0
    let _top = 0

    if (updating || closing) {
        _width = animationTarget?.width || 0
        _height = animationTarget?.height || 0
        _left = animationTarget?.x || 0
        _top = animationTarget?.y || 0
    }


    const _duration = duration

    const [imageSize, setImageSize] = useState({ width: 100, height: 100 })

    // Style of main container (not background, not image)
    const style = {
        width: animating ? _width : '100%', // Use 100% just in case there is some problem with real time window size
        height: animating ? _height : '100%', // Use 100% just in case there is some problem with real time window size
        left: _left,
        top: _top,
        position: 'fixed',
        display: visible ? 'flex' : 'none', // Hide if not visible
        transition: animating ? `all ${_duration}ms` : null,
        overflow: 'hidden',
        justifyContent: 'center',
    }

    // Style of only black background
    const bgStyle = {
        // Use entire screen
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        // If updating and openening: 0, if opening and visible (not updating): 1, if closing: 0
        opacity: (!(visible && !updating) || closing) ? 0 : 1,
        backgroundColor: '#000',
        transition: `opacity ${duration}ms ease-in-out`,
        display: visible ? 'block' : 'none', // Hide if not visible
    }

    // Calculate image source aspect ratio or default to 1:1
    const imageAspectRatio =  image.current ? (image.current.naturalHeight || 1) / (image.current.naturalWidth || 1) : 1
    // Calculate in real time screen aspect ratio or use default 1000x1000 -> 1:1
    const screenAspectRatio = bodyHeight / bodyWidth

    // If screen is larger than image use vertial center
    if (imageAspectRatio < screenAspectRatio) {
        style.alignItems = 'center'
    }

    // Calculate left margin of image to centered
    let left = (bodyWidth - (screenAspectRatio / imageAspectRatio) * bodyWidth) / 2
    if (left < 0) left = 0

    // Set image container padding to ensure image is centered and the animation moves correctly 
    // It works without this but the animation is better this way
    style.paddingLeft = left + 'px'
    style.paddingRight = left + 'px'

    // If updating (the animation just started to open) or closing it should have no padding
    if (updating || closing) {
        style.paddingLeft = 0
        style.paddingRight = 0
    }


    return <div>
        <div style={bgStyle}>

        </div>
        <div style={style}>
            <div style={{
                maxWidth: 'calc(100vw / ' + (imageAspectRatio / screenAspectRatio) + ' )',
                maxHeight: 'calc(100vh / ' + (imageAspectRatio / screenAspectRatio) + ' )',
                width: '100%',
            }}>
                <AspectRatio aspectRatio={imageAspectRatio}>
                    <img
                        src="https://cdn.pixabay.com/photo/2022/05/09/11/20/flower-7184366_960_720.jpg"
                        style={{ width: '100%', height: '100%', }}
                        ref={image}
                        onClick={closeView}
                    />
                </AspectRatio>
            </div>
        </div>
    </div>

}