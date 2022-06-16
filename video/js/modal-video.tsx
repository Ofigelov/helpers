// @ts-ignore
import React, { ReactElement, useState } from 'react';
import { Spinner } from '../../spinner/js/spinner';
import { Modal } from '../../modal/js/modal';
import { VideoCreator } from './video-creator';
import { LazyImage } from '../../../general/js/lazy-image';

const ModalVideo = ({
    caption,
    imageAlt,
    imageSrcSet,
    type,
    id,
    closeCb,
    url,
}: iModalVideo): ReactElement => {
    const [isLoading, setLoading] = useState(true);
    return (
        <Modal closeCb={closeCb}>
            <div className="modal-video spinner-placeholder side-gaps">
                <div className="modal-video__inner responsive-media ratio ratio--16x9">
                    <VideoCreator
                        isActive={true}
                        url={url}
                        type={type}
                        id={id}
                        onReady={() => setLoading(false)}
                    />
                    {isLoading && imageSrcSet && (
                        <LazyImage src={imageSrcSet} alt={imageAlt || caption} />
                    )}
                </div>
                {caption && <div className="modal-video__caption">{caption}</div>}
                <Spinner isActive={isLoading} />
            </div>
        </Modal>
    );
};

interface iModalVideo {
    id: string;
    type: string;
    url: string;
    imageSrcSet?: string;
    caption?: string;
    imageAlt?: string;
    closeCb: () => void;
}

export { ModalVideo };
