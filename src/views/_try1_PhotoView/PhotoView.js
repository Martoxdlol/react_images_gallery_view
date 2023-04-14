export default function PhotoView({ animated, width, height, zIndex, objectFit }) {

    if (!height) height = 100
    if (!width) width = 170

    

    if (typeof height === 'number') height = height + 'px'
    if (typeof width === 'number') width = width + 'px'

    const style = {
        width: width,
        height: height,
        zIndex,
    }

    if (animated) {
        style.transition = 'all 0.2s ease-in-out';
    }

    return (
        <div style={style}>
            <img
                src="https://cdn.pixabay.com/photo/2022/05/09/11/20/flower-7184366_960_720.jpg"
                style={{ width: '100%', height: '100%', objectFit: objectFit || 'cover' }}
                onLoad={e => {
                    console.log(e.target.naturalWidth, e.target.naturalHeight)

                }}
            />
        </div>
    );
}