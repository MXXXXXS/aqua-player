import { El } from 'r/fundamental/creatEl'
import controlBar from './controlBar'
import coverInfo from './coverInfo'
import progressBar from 'c/progressBarWithTimeStamp'

const config: El = {
  template: __filename,
  states: ['color'],
  children: {
    '.control': controlBar,
    '.cover': coverInfo(),
    '.progressBar': progressBar,
  },
}

export default config
