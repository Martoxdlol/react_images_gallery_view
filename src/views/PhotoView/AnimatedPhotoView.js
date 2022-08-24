import { useEffect, useState } from "react"
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

export default function AnimatedPhotoView({ controller }) {
    const [animating, setAnimating] = useState(false)
    const [visible, setVisible] = useState(false)

    const duration = 200

    const [animateFrom, setAnimateFrom] = useState(null)
    const [animateTo, setAnimateTo] = useState(null)

    const [_shouldZero, set_shouldZero] = useState(false)
    const shouldZero = _shouldZero || !!animateFrom

    useEffect(() => {
        controller.setControls({ openView })
    }, [controller])

    function openView(source, animateFrom) {
        if (animating) return
        setAnimating(true)
        setVisible(true)
        setAnimateFrom(animateFrom)
        setTimeout(() => {
            setAnimateFrom(null)
            setAnimateTo(animateFrom)
        }, 0)
        setTimeout(() => setAnimating(false), duration)
    }

    function closeView() {
        set_shouldZero(true)
        setAnimating(true)
        setTimeout(() => {
            set_shouldZero(false)
            setAnimating(false)
            setVisible(false)
        }, duration)
    }

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

    const _width = shouldZero ? 0 : animateFrom?.width ?? bodyWidth
    const _height = shouldZero ? 0 : animateFrom?.height ?? bodyHeight

    const _left = (_shouldZero ? animateTo : animateFrom)?.x ?? 0
    const _top = (_shouldZero ? animateTo : animateFrom)?.y ?? 0

    const _duration = duration

    const [imageSize, setImageSize] = useState({ width: 100, height: 100 })

    const style = {
        width: animating ? _width : '100%',
        height: animating ? _height : '100%',
        left: _left,
        top: _top,
        position: 'fixed',
        display: visible ? 'flex' : 'none',
        transition: animating ? `all ${_duration}ms` : null,
        overflow: 'hidden',
        justifyContent: 'center',
    }

    const bgStyle = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        opacity: shouldZero ? 0 : 1,
        backgroundColor: '#000',
        transition: `opacity ${duration}ms ease-in-out`,
        display: visible ? 'block' : 'none',
    }

    const imageAspectRatio = imageSize.height / imageSize.width
    const screenAspectRatio = bodyHeight / bodyWidth

    if (imageAspectRatio < screenAspectRatio) {
        style.alignItems = 'center'
    }

    let left = (bodyWidth - (screenAspectRatio / imageAspectRatio) * bodyWidth) / 2
    if (left < 0) left = 0


    style.paddingLeft = left + 'px'
    style.paddingRight = left + 'px'

    if (shouldZero) {
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
                        onLoad={e => {
                            setImageSize({ width: e.target.naturalWidth, height: e.target.naturalHeight })
                        }}
                        onClick={closeView}
                    />
                </AspectRatio>
            </div>
        </div>
    </div>

}