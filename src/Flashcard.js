import React, { useState, useRef, useEffect } from 'react'

function Flashcard({ flashcard }) {
    const [flip, setFlip] = useState(false)
    const [height, setHeight] = useState('initial')
    const frontEle = useRef()
    const backEle = useRef()

    function maxHeight() {
        const frontHeight = frontEle.current.getBoundingClientRect().height
        const backHeight = backEle.current.getBoundingClientRect().height
        setHeight(Math.max(frontHeight, backHeight, 100))
    }

    useEffect(maxHeight, [flashcard.question, flashcard.ans, flashcard.options])
    useEffect(() => {
        window.addEventListener('resize', maxHeight)
        return () => window.removeEventListener('resize', maxHeight)
    }, [])

    return (
        <div
            className={`card ${flip ? 'flip' : ''}`}
            style={{ height: height }}
            onClick={() => { setFlip(!flip) }}
        >
            <div className='front' ref={frontEle}>
                {flashcard.question}
                <div className='flashcard-options'>
                    {
                        flashcard.options.map(opt => {
                            return (
                                <div className='flash-card-option' key={opt}>
                                    {opt}
                                </div>)
                        }
                        )
                    }
                </div>
            </div>
            <div className='back' ref={backEle}>
                {flashcard.ans}
            </div>
        </div>
    )
}

export default Flashcard