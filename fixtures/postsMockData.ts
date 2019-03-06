

import { IPostAttributes } from '../src/database/models/PostModel'
import * as moment from 'moment'

const postMessages = [
  '1. Color Block Instagram Feed Theme',
  '2. Minimalist Instagram Feed Theme',
  '3. Black and White Instagram Feed Theme',
  '4. Color Splash Instagram Feed Theme',
  '5. Flatlay Instagram Feed Theme',
  '6. Monotheme Instagram Feed Theme',
  '7. Dark Theme Instagram Feed Theme',
  '8. Color Co-ordinated Instagram Feed Theme',
  '9. Instagram Feed Themes – Sticking To The Same Filter',
  '10. White Borders Instagram Feed Theme',
  '11. Black Borders Instagram Feed Theme',
  '12. Mixed White Border Instagram Feed Theme',
  '13. Squares Instagram Feed Theme',
  '14. Pretty In Pink Instagram Feed Theme',
  '15. Pastel Bright Instagram Feed Theme',
  '16. Patterns Theme Instagram Feed Theme',
  '17. Vertical Lines Instagram Feed Theme',
  '18. Puzzle Instagram Feed Theme',
  '19. The Checkerboard Instagram Feed Theme',
  '20. Floral Instagram Feed Theme',
  '21. Grayscale Instagram Feed Theme',
  '22. Horizontal Lines Instagram Feed Theme',
  '23. Across the Grid – Instagram Feed Themes',
  '24. HDR Instagram Feed Theme',
]
// images are stolen from: https://randomuser.me/photos
const userMockData: IPostAttributes[] = [
  ...Array(60).fill(0).map((_, i) => ({
    author_user_id: i,
    text: postMessages[i],
    created_at: moment('1.1.2016', 'DD.MM.YYYY').add('days', i).valueOf(),
  }))
]

export default userMockData
