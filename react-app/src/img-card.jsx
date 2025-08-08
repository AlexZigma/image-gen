import viteLogo from '/img.jpg'

function ImgCard(props) {
    return (
        <div className='image-card'>
            {/* <a href=""> */}
            <img src={props.img} alt="" />
            {/* </a> */}
            <div className='buttons'>
                <button
                    type='button'
                    onClick={() => props.deleteImage(props.id)}
                >
                    Delete
                </button>
                <button type='button'>Edit</button>
            </div>
        </div>
    )
}

export default ImgCard