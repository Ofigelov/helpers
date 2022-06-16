import React, { useState, useEffect, useMemo, useRef, Ref, ReactElement } from 'react';
import { nanoid } from 'nanoid';

const TitleSpans = ({
    text,
    delayStart = 0,
    delayStep,
    parentNodeWidth,
    setTimeForClear,
}: iTitleSpans): ReactElement => {
    const id = useMemo(() => nanoid(10), []);
    const [words, setWords] = useState(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        text
            .split(' ')
            .map((word) => ({ value: word, ref: useRef<HTMLSpanElement>(null), delay: 0 }))
    );
    useEffect(() => {
        let lastLineWidth = 0;
        let delay = 0;

        words.forEach((word) => {
            const {
                ref: { current },
            } = word;
            const width = ((current as unknown) as HTMLSpanElement).clientWidth;
            if (lastLineWidth + width >= parentNodeWidth) {
                lastLineWidth = width;
                delay += delayStep;
            } else {
                lastLineWidth += width;
            }
            word.delay = delay;
        });
        setTimeForClear(delay);
        setWords(words);
    }, []);

    return (
        <>
            {words.map((word, index) => (
                <span
                    key={id + index}
                    className="title-animate__word-wrapper"
                    aria-hidden={true}
                    ref={word.ref}
                >
                    <span
                        className="title-animate__word"
                        style={{
                            transitionDelay: delayStart + word.delay + 'ms',
                        }}
                    >
                        {`${word.value}${index < words.length - 1 ? ' ' : ''}`}
                    </span>
                </span>
            ))}
        </>
    );
};

interface iTitleSpans {
    parentNodeWidth: number;
    text: string;
    delayStep: number;
    delayStart: number;
    setTimeForClear: CallableFunction;
}

export { TitleSpans };
