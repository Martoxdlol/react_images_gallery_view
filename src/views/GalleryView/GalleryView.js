import { useMemo } from "react";
import { useHistory } from "react-router-history-pro";
import AnimatedPhotoView, { AnimatedPhotoViewController, AnimateFromReferenceInstance } from "../PhotoView/AnimatedPhotoView";

export default function GalleryView() {
    const imageViewController = useMemo(() => new AnimatedPhotoViewController(), [])

    const history = useHistory()

    // history.block(() => {}, {})

    return (
        <div className="GalleryView">
            <AnimatedPhotoView controller={imageViewController} />
            <h1>GalleryView</h1>

            <button type='button'
                onClick={() => {
                    imageViewController.openView('', new AnimateFromReferenceInstance({ current: document.querySelector('button') }))
                }}
                style={{padding: '40px 70px'}}
            >
                Open image
            </button>
            {/* <PhotoSwitcher width={'300px'} height={'166px'}/>
            <PhotoSwitcher width={'300px'} height={'166px'}/>
            <PhotoSwitcher width={'300px'} height={'166px'}/>
            <PhotoSwitcher width={'300px'} height={'166px'}/> */}
        </div>
    );
}