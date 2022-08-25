import '../styles/Test.css';

// Function to get all images from a folder
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
const images = importAll(require.context('../assets/questions/perception1', false, /\.(png|jpe?g|svg)$/)); // Answer is c

const Test = () => {
    return(
        <div className='test'>
            <div className='test__content'>
                <div className='test__question'>
                    <img src={images['question.png']} className='test__image' alt=''/>
                    <p>Which of the following cubes can you make with these four pieces?</p>
                </div>

                <div className='test__answers'>
                    <div className='answer__option'>
                        <label for="a"><img src={images['a.png']} alt=''/></label>
                        <input type="radio" id="a" value="a" name="answer"/>
                    </div>
                    <div className='answer__option'>
                        <label for="b"><img src={images['b.png']} alt=''/></label>
                        <input type="radio" id="b" value="b" name="answer"/>
                    </div>
                    <div className='answer__option'>
                        <label for="c"><img src={images['c.png']} alt=''/></label>
                        <input type="radio" id="c" value="c" name="answer"/>
                    </div>
                    <div className='answer__option'>
                        <label for="d"><img src={images['d.png']} alt=''/></label>
                        <input type="radio" id="d" value="d" name="answer"/>
                    </div>
                    <div className='answer__option'>
                        <label for="e"><img src={images['e.png']} alt=''/></label>
                        <input type="radio" id="e" value="e" name="answer"/>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default Test;